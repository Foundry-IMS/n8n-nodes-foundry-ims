import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import {
	customFieldValueFields,
	customFieldValueOperations,
} from './descriptions/CustomFieldValueDescription';
import { orderFields, orderOperations } from './descriptions/OrderDescription';
import { productFields, productOperations } from './descriptions/ProductDescription';
import { stockFields, stockOperations } from './descriptions/StockDescription';
import { variantFields, variantOperations } from './descriptions/VariantDescription';

export class FoundryIms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Foundry IMS',
		name: 'foundryIms',
		icon: { light: 'file:foundryIms.svg', dark: 'file:foundryIms.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Manage products, variants, stock, and orders in Foundry IMS',
		defaults: {
			name: 'Foundry IMS',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'foundryImsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Custom Field Value', value: 'customFieldValue' },
					{ name: 'Order', value: 'order' },
					{ name: 'Product', value: 'product' },
					{ name: 'Stock', value: 'stock' },
					{ name: 'Variant', value: 'variant' },
				],
				default: 'product',
			},
			...productOperations,
			...productFields,
			...variantOperations,
			...variantFields,
			...stockOperations,
			...stockFields,
			...orderOperations,
			...orderFields,
			...customFieldValueOperations,
			...customFieldValueFields,
		],
	};
}
