import type { INodeProperties } from 'n8n-workflow';

const variantWriteFields: INodeProperties[] = [
	{
		displayName: 'Compare-at Price',
		name: 'compareAtPrice',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		routing: {
			send: { type: 'body', property: 'compareAtPrice' },
		},
	},
	{
		displayName: 'Condition',
		name: 'condition',
		type: 'options',
		options: [
			{ name: 'New', value: 'NEW' },
			{ name: 'Open Box', value: 'OPEN_BOX' },
			{ name: 'Refurbished', value: 'REFURBISHED' },
			{ name: 'Used', value: 'USED' },
		],
		default: 'NEW',
		routing: {
			send: { type: 'body', property: 'condition' },
		},
	},
	{
		displayName: 'Cost',
		name: 'cost',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Unit cost of the variant',
		routing: {
			send: { type: 'body', property: 'cost' },
		},
	},
	{
		displayName: 'GTIN',
		name: 'gtin',
		type: 'string',
		default: '',
		routing: {
			send: { type: 'body', property: 'gtin' },
		},
	},
	{
		displayName: 'MPN',
		name: 'mpn',
		type: 'string',
		default: '',
		description: 'Manufacturer part number',
		routing: {
			send: { type: 'body', property: 'mpn' },
		},
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Sell price of the variant',
		routing: {
			send: { type: 'body', property: 'price' },
		},
	},
	{
		displayName: 'SKU',
		name: 'sku',
		type: 'string',
		default: '',
		description: 'Leave empty to keep the auto-generated Foundry SKU',
		routing: {
			send: { type: 'body', property: 'sku' },
		},
	},
	{
		displayName: 'Track Inventory',
		name: 'trackInventory',
		type: 'boolean',
		default: true,
		description: 'Whether stock levels are tracked for this variant',
		routing: {
			send: { type: 'body', property: 'trackInventory' },
		},
	},
	{
		displayName: 'UPC',
		name: 'upc',
		type: 'string',
		default: '',
		routing: {
			send: { type: 'body', property: 'upc' },
		},
	},
	{
		displayName: 'Weight',
		name: 'weight',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		routing: {
			send: { type: 'body', property: 'weight' },
		},
	},
];

export const variantOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['variant'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a variant',
				routing: {
					request: {
						method: 'POST',
						url: '/variants',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a variant',
				routing: {
					request: {
						method: 'GET',
						url: '=/variants/{{$parameter.variantId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many variants',
				routing: {
					request: {
						method: 'GET',
						url: '/variants',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'data',
								},
							},
						],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a variant',
				routing: {
					request: {
						method: 'PUT',
						url: '=/variants/{{$parameter.variantId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const variantFields: INodeProperties[] = [
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the variant. Use Get Many with a search term to find it.',
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['get', 'update'],
			},
		},
	},
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the product this variant belongs to',
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['create'],
			},
		},
		routing: {
			send: { type: 'body', property: 'productId' },
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['create'],
			},
		},
		routing: {
			send: { type: 'body', property: 'name' },
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['create'],
			},
		},
		options: variantWriteFields,
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['update'],
			},
		},
		options: [
			...variantWriteFields,
			{
				displayName: 'MAP',
				name: 'map',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Minimum advertised price',
				routing: {
					send: { type: 'body', property: 'map' },
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'name' },
				},
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['getAll'],
			},
		},
		routing: {
			send: { type: 'query', property: 'limit' },
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['variant'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Number of results to skip (for paging)',
				routing: {
					send: { type: 'query', property: 'offset' },
				},
			},
			{
				displayName: 'Product ID',
				name: 'productId',
				type: 'string',
				default: '',
				description: 'Only variants of this product',
				routing: {
					send: { type: 'query', property: 'productId' },
				},
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Matches variant name, SKU, UPC, GTIN, or MPN',
				routing: {
					send: { type: 'query', property: 'search' },
				},
			},
		],
	},
];
