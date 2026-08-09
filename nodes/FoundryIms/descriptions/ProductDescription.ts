import type { INodeProperties } from 'n8n-workflow';

export const productOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['product'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a product',
				routing: {
					request: {
						method: 'POST',
						url: '/products',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a product',
				description: 'Move a product to the trash (soft delete — it can be restored)',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/products/{{$parameter.productId}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a product',
				routing: {
					request: {
						method: 'GET',
						url: '=/products/{{$parameter.productId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many products',
				routing: {
					request: {
						method: 'GET',
						url: '/products',
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
				name: 'Restore',
				value: 'restore',
				action: 'Restore a product from the trash',
				routing: {
					request: {
						method: 'POST',
						url: '=/products/{{$parameter.productId}}/restore',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a product',
				routing: {
					request: {
						method: 'PUT',
						url: '=/products/{{$parameter.productId}}',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const productFields: INodeProperties[] = [
	{
		displayName: 'Product ID',
		name: 'productId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the product. Use Get Many with a search term to find it.',
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['get', 'update', 'delete', 'restore'],
			},
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
				resource: ['product'],
				operation: ['create'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
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
				resource: ['product'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Brand ID',
				name: 'brandId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'brandId' },
				},
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'categoryId' },
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				routing: {
					send: { type: 'body', property: 'description' },
				},
			},
			{
				displayName: 'Featured',
				name: 'featured',
				type: 'boolean',
				default: false,
				description: 'Whether the product is flagged as featured',
				routing: {
					send: { type: 'body', property: 'featured' },
				},
			},
			{
				displayName: 'Meta Description',
				name: 'metaDescription',
				type: 'string',
				default: '',
				description: 'SEO meta description (max 500 characters)',
				routing: {
					send: { type: 'body', property: 'metaDescription' },
				},
			},
			{
				displayName: 'Meta Title',
				name: 'metaTitle',
				type: 'string',
				default: '',
				description: 'SEO meta title (max 255 characters)',
				routing: {
					send: { type: 'body', property: 'metaTitle' },
				},
			},
			{
				displayName: 'SKU',
				name: 'sku',
				type: 'string',
				default: '',
				description: 'SKU for the default variant (ignored for FAMILY products)',
				routing: {
					send: { type: 'body', property: 'sku' },
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Assembly', value: 'ASSEMBLY' },
					{ name: 'Bundle', value: 'BUNDLE' },
					{ name: 'Family', value: 'FAMILY' },
					{ name: 'Simple', value: 'SIMPLE' },
				],
				default: 'SIMPLE',
				routing: {
					send: { type: 'body', property: 'type' },
				},
			},
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['product'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Brand ID',
				name: 'brandId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'brandId' },
				},
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'categoryId' },
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				routing: {
					send: { type: 'body', property: 'description' },
				},
			},
			{
				displayName: 'Featured',
				name: 'featured',
				type: 'boolean',
				default: false,
				description: 'Whether the product is flagged as featured',
				routing: {
					send: { type: 'body', property: 'featured' },
				},
			},
			{
				displayName: 'Meta Description',
				name: 'metaDescription',
				type: 'string',
				default: '',
				description: 'SEO meta description (max 500 characters)',
				routing: {
					send: { type: 'body', property: 'metaDescription' },
				},
			},
			{
				displayName: 'Meta Title',
				name: 'metaTitle',
				type: 'string',
				default: '',
				description: 'SEO meta title (max 255 characters)',
				routing: {
					send: { type: 'body', property: 'metaTitle' },
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
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Assembly', value: 'ASSEMBLY' },
					{ name: 'Bundle', value: 'BUNDLE' },
					{ name: 'Family', value: 'FAMILY' },
					{ name: 'Simple', value: 'SIMPLE' },
				],
				default: 'SIMPLE',
				routing: {
					send: { type: 'body', property: 'type' },
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
				resource: ['product'],
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
				resource: ['product'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'options',
				options: [
					{ name: 'Active Only', value: 'false' },
					{ name: 'All', value: 'all' },
					{ name: 'Archived Only', value: 'true' },
				],
				default: 'false',
				routing: {
					send: { type: 'query', property: 'archived' },
				},
			},
			{
				displayName: 'Brand ID',
				name: 'brandId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'query', property: 'brandId' },
				},
			},
			{
				displayName: 'Category ID',
				name: 'categoryId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'query', property: 'categoryId' },
				},
			},
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
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description:
					'Matches product name and description, and variant SKU, UPC, GTIN, MPN, or a channel/supplier SKU',
				routing: {
					send: { type: 'query', property: 'search' },
				},
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Assembly', value: 'ASSEMBLY' },
					{ name: 'Bundle', value: 'BUNDLE' },
					{ name: 'Family', value: 'FAMILY' },
					{ name: 'Simple', value: 'SIMPLE' },
				],
				default: 'SIMPLE',
				routing: {
					send: { type: 'query', property: 'type' },
				},
			},
		],
	},
];
