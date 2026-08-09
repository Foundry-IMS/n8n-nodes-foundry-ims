import { createHmac, timingSafeEqual } from 'node:crypto';

import type {
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

/**
 * Signature tolerance in seconds. Foundry signs `${timestamp}.${rawBody}` and
 * replays outside this window are rejected even with a valid HMAC.
 */
const SIGNATURE_TOLERANCE_SECONDS = 300;

async function foundryApiRequest(
	ctx: IHookFunctions | ILoadOptionsFunctions,
	method: 'GET' | 'POST' | 'DELETE',
	endpoint: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const credentials = await ctx.getCredentials('foundryImsApi');
	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		json: true,
	};
	if (body) options.body = body;
	return (await ctx.helpers.httpRequestWithAuthentication.call(
		ctx,
		'foundryImsApi',
		options,
	)) as IDataObject;
}

function verifySignature(header: string, rawBody: Buffer, secret: string): boolean {
	// Header shape: t=<unix seconds>,v1=<hex hmac-sha256 of `${t}.${rawBody}`>
	const parts = new Map<string, string>();
	for (const pair of header.split(',')) {
		const idx = pair.indexOf('=');
		if (idx > 0) parts.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
	}
	const timestamp = parts.get('t');
	const signature = parts.get('v1');
	if (!timestamp || !signature) return false;

	const age = Math.abs(Date.now() / 1000 - Number(timestamp));
	if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) return false;

	const expected = createHmac('sha256', secret)
		.update(`${timestamp}.`)
		.update(rawBody)
		.digest('hex');
	if (expected.length !== signature.length) return false;
	return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'));
}

export class FoundryImsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Foundry IMS Trigger',
		name: 'foundryImsTrigger',
		icon: { light: 'file:foundryIms.svg', dark: 'file:foundryIms.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Starts a workflow when something happens in Foundry IMS',
		defaults: {
			name: 'Foundry IMS Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'foundryImsApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event Names or IDs',
				name: 'events',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getEvents',
				},
				required: true,
				default: [],
				description:
					'The Foundry events that start this workflow. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await foundryApiRequest(this, 'GET', '/webhooks/events');
				const events = (response.events as string[]) ?? [];
				return events.map((event) => ({ name: event, value: event }));
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const response = await foundryApiRequest(this, 'GET', '/webhooks');
				const endpoints = (Array.isArray(response) ? response : (response.data as IDataObject[])) ?? [];
				for (const endpoint of endpoints as IDataObject[]) {
					if (endpoint.url === webhookUrl) {
						webhookData.webhookId = endpoint.id;
						// The signing secret is only returned at creation. If we are
						// re-adopting an endpoint we no longer hold the secret for,
						// recreate it so deliveries can be verified.
						if (webhookData.secret) return true;
						await foundryApiRequest(this, 'DELETE', `/webhooks/${endpoint.id as string}`);
						delete webhookData.webhookId;
						return false;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const events = this.getNodeParameter('events') as string[];
				const response = await foundryApiRequest(this, 'POST', '/webhooks', {
					name: `n8n: ${this.getWorkflow().name ?? 'workflow'}`,
					url: webhookUrl,
					events,
				});
				if (!response.id || !response.secret) return false;
				webhookData.webhookId = response.id;
				webhookData.secret = response.secret;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				if (webhookData.webhookId) {
					try {
						await foundryApiRequest(
							this,
							'DELETE',
							`/webhooks/${webhookData.webhookId as string}`,
						);
					} catch (error) {
						// Already gone upstream (deleted in Foundry, or auto-disabled and
						// removed) — clearing local state is still the right outcome.
						this.logger.warn(
							`Foundry IMS Trigger: could not delete webhook endpoint ${webhookData.webhookId as string}: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
					delete webhookData.webhookId;
					delete webhookData.secret;
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const res = this.getResponseObject();
		const webhookData = this.getWorkflowStaticData('node');

		const signatureHeader = req.headers['x-foundry-signature'];
		const secret = webhookData.secret as string | undefined;
		const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;

		if (
			!secret ||
			typeof signatureHeader !== 'string' ||
			!rawBody ||
			!verifySignature(signatureHeader, rawBody, secret)
		) {
			res.status(401).json({ message: 'Invalid signature' });
			return { noWebhookResponse: true };
		}

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject)],
		};
	}
}
