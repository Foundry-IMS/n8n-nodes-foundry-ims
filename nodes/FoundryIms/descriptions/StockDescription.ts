import type { INodeProperties } from 'n8n-workflow';

export const stockOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['stock'],
			},
		},
		options: [
			{
				name: 'Adjust',
				value: 'adjust',
				action: 'Adjust stock',
				description: 'Add or remove stock at a warehouse with an audited reason',
				routing: {
					request: {
						method: 'POST',
						url: '/stock/adjust',
					},
				},
			},
			{
				name: 'Get Breakdown',
				value: 'getBreakdown',
				action: 'Get the stock breakdown for a variant',
				description: 'Per-warehouse and per-bin stock rows for one variant',
				routing: {
					request: {
						method: 'GET',
						url: '=/stock/variant/{{$parameter.variantId}}/breakdown',
					},
				},
			},
			{
				name: 'Get Many Movements',
				value: 'getMovements',
				action: 'Get many stock movements',
				routing: {
					request: {
						method: 'GET',
						url: '/stock/movements',
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
				name: 'Transfer',
				value: 'transfer',
				action: 'Transfer stock between warehouses',
				routing: {
					request: {
						method: 'POST',
						url: '/stock/transfer',
					},
				},
			},
		],
		default: 'getBreakdown',
	},
];

export const stockFields: INodeProperties[] = [
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the variant',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['getBreakdown'],
			},
		},
	},
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the variant to adjust',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['adjust'],
			},
		},
		routing: {
			send: { type: 'body', property: 'variantId' },
		},
	},
	{
		displayName: 'Warehouse ID',
		name: 'warehouseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['adjust'],
			},
		},
		routing: {
			send: { type: 'body', property: 'warehouseId' },
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		default: 0,
		description: 'Positive adds stock, negative removes it',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['adjust'],
			},
		},
		routing: {
			send: { type: 'body', property: 'quantity' },
		},
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'options',
		required: true,
		options: [
			{ name: 'Correction', value: 'CORRECTION' },
			{ name: 'Cycle Count', value: 'CYCLE_COUNT' },
			{ name: 'Damage', value: 'DAMAGE' },
			{ name: 'Found', value: 'FOUND' },
			{ name: 'Other', value: 'OTHER' },
			{ name: 'Theft', value: 'THEFT' },
		],
		default: 'CORRECTION',
		description: 'Recorded on the stock movement for auditing',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['adjust'],
			},
		},
		routing: {
			send: { type: 'body', property: 'reason' },
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['adjust'],
			},
		},
		options: [
			{
				displayName: 'Allow Negative',
				name: 'allowNegative',
				type: 'boolean',
				default: false,
				description:
					'Whether to allow the adjustment to take the location below zero. Without this, such an adjustment is rejected.',
				routing: {
					send: { type: 'body', property: 'allowNegative' },
				},
			},
			{
				displayName: 'Bin ID',
				name: 'binId',
				type: 'string',
				default: '',
				description:
					'Target a specific bin. Leave the option off to let Foundry resolve the bin (primary bin, then single bin, then fullest).',
				routing: {
					send: { type: 'body', property: 'binId' },
				},
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'body', property: 'notes' },
				},
			},
		],
	},
	{
		displayName: 'Variant ID',
		name: 'variantId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the variant to transfer',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['transfer'],
			},
		},
		routing: {
			send: { type: 'body', property: 'variantId' },
		},
	},
	{
		displayName: 'From Warehouse ID',
		name: 'fromWarehouseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['transfer'],
			},
		},
		routing: {
			send: { type: 'body', property: 'fromWarehouseId' },
		},
	},
	{
		displayName: 'To Warehouse ID',
		name: 'toWarehouseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['transfer'],
			},
		},
		routing: {
			send: { type: 'body', property: 'toWarehouseId' },
		},
	},
	{
		displayName: 'Quantity',
		name: 'quantity',
		type: 'number',
		required: true,
		default: 0,
		description: 'Number of units to move',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['transfer'],
			},
		},
		routing: {
			send: { type: 'body', property: 'quantity' },
		},
	},
	{
		displayName: 'Notes',
		name: 'notes',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['stock'],
				operation: ['transfer'],
			},
		},
		routing: {
			send: { type: 'body', property: 'notes' },
		},
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
				resource: ['stock'],
				operation: ['getMovements'],
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
				resource: ['stock'],
				operation: ['getMovements'],
			},
		},
		options: [
			{
				displayName: 'Movement Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'Adjustment', value: 'ADJUSTMENT' },
					{ name: 'Build Consume', value: 'BUILD_CONSUME' },
					{ name: 'Build Produce', value: 'BUILD_PRODUCE' },
					{ name: 'Count', value: 'COUNT' },
					{ name: 'Receipt', value: 'RECEIPT' },
					{ name: 'Sale', value: 'SALE' },
					{ name: 'Transfer In', value: 'TRANSFER_IN' },
					{ name: 'Transfer Out', value: 'TRANSFER_OUT' },
					{ name: 'Unbuild Consume', value: 'UNBUILD_CONSUME' },
					{ name: 'Unbuild Produce', value: 'UNBUILD_PRODUCE' },
				],
				default: 'ADJUSTMENT',
				routing: {
					send: { type: 'query', property: 'type' },
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
				displayName: 'Variant ID',
				name: 'variantId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'query', property: 'variantId' },
				},
			},
			{
				displayName: 'Warehouse ID',
				name: 'warehouseId',
				type: 'string',
				default: '',
				routing: {
					send: { type: 'query', property: 'warehouseId' },
				},
			},
		],
	},
];
