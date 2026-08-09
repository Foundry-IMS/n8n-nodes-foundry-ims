import type { INodeProperties } from 'n8n-workflow';

import { buildCustomValuesBody } from '../GenericFunctions';

export const customFieldValueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['customFieldValue'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get the custom field values of a record',
				routing: {
					request: {
						method: 'GET',
						url: '=/{{$parameter.entityType}}/{{$parameter.itemId}}/custom-values',
					},
				},
			},
			{
				name: 'Get Definitions',
				value: 'getDefinitions',
				action: 'Get the custom field definitions',
				description: 'The field definitions for the organization, including each field ID and type',
				routing: {
					request: {
						method: 'GET',
						url: '/custom-fields',
					},
				},
			},
			{
				name: 'Set',
				value: 'set',
				action: 'Set custom field values on a record',
				routing: {
					request: {
						method: 'PUT',
						url: '=/{{$parameter.entityType}}/{{$parameter.itemId}}/custom-values',
					},
					send: {
						preSend: [buildCustomValuesBody],
					},
				},
			},
		],
		default: 'get',
	},
];

export const customFieldValueFields: INodeProperties[] = [
	{
		displayName: 'Entity Type',
		name: 'entityType',
		type: 'options',
		options: [
			{ name: 'Brand', value: 'brands' },
			{ name: 'Category', value: 'categories' },
			{ name: 'Channel SKU', value: 'channel-skus' },
			{ name: 'Product', value: 'products' },
			{ name: 'Variant', value: 'variants' },
		],
		default: 'products',
		description: 'The kind of record the custom field values live on',
		displayOptions: {
			show: {
				resource: ['customFieldValue'],
				operation: ['get', 'set'],
			},
		},
	},
	{
		displayName: 'Record ID',
		name: 'itemId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the product, variant, channel SKU, category, or brand',
		displayOptions: {
			show: {
				resource: ['customFieldValue'],
				operation: ['get', 'set'],
			},
		},
	},
	{
		displayName: 'Values',
		name: 'values',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Value',
		default: {},
		displayOptions: {
			show: {
				resource: ['customFieldValue'],
				operation: ['set'],
			},
		},
		options: [
			{
				displayName: 'Entry',
				name: 'entry',
				values: [
					{
						displayName: 'Field Definition ID',
						name: 'fieldDefId',
						type: 'string',
						required: true,
						default: '',
						description: 'The UUID of the custom field definition (use Get Definitions to find it)',
					},
					{
						displayName: 'Value Type',
						name: 'valueType',
						type: 'options',
						options: [
							{ name: 'Boolean', value: 'boolean' },
							{ name: 'Clear', value: 'clear' },
							{ name: 'Date', value: 'date' },
							{ name: 'JSON', value: 'json' },
							{ name: 'Number', value: 'number' },
							{ name: 'Text', value: 'text' },
						],
						default: 'text',
						description:
							'Must match the field definition\'s declared type — Text for TEXT/LONGTEXT/RICHTEXT/URL fields, JSON for SELECT/MULTISELECT/JSON/ARRAY/OBJECT fields. Clear removes the stored value.',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'For Date use ISO 8601. Ignored when Value Type is Clear.',
						displayOptions: {
							hide: {
								valueType: ['clear'],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['customFieldValue'],
				operation: ['getDefinitions'],
			},
		},
		options: [
			{
				displayName: 'Applies To',
				name: 'appliesTo',
				type: 'options',
				options: [
					{ name: 'Brand', value: 'BRAND' },
					{ name: 'Category', value: 'CATEGORY' },
					{ name: 'Channel SKU', value: 'CHANNEL_SKU' },
					{ name: 'Product', value: 'PRODUCT' },
					{ name: 'Variant', value: 'VARIANT' },
				],
				default: 'PRODUCT',
				description: 'Only definitions that apply to this entity kind',
				routing: {
					send: { type: 'query', property: 'appliesTo' },
				},
			},
		],
	},
];
