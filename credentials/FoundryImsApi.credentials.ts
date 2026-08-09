import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class FoundryImsApi implements ICredentialType {
	name = 'foundryImsApi';

	displayName = 'Foundry IMS API';

	icon: Icon = { light: 'file:foundryIms.svg', dark: 'file:foundryIms.dark.svg' };

	documentationUrl = 'https://foundryims.com/docs/authentication/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description:
				'A Foundry IMS admin API key (fims_…). Create one in Foundry under Settings → API Keys. The key is bound to one organization and only grants the permissions you tick.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.foundryims.com/api/v1',
			description: 'Only change this if Foundry support has given you a different API host',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/brands',
			qs: { limit: 1 },
		},
	};
}
