import type { INodeProperties } from 'n8n-workflow';

const orderStatusOptions = [
	{ name: 'Awaiting Fulfillment', value: 'AWAITING_FULFILLMENT' },
	{ name: 'Awaiting Shipment', value: 'AWAITING_SHIPMENT' },
	{ name: 'Cancelled', value: 'CANCELLED' },
	{ name: 'Completed', value: 'COMPLETED' },
	{ name: 'On Hold', value: 'ON_HOLD' },
	{ name: 'Partially Refunded', value: 'PARTIALLY_REFUNDED' },
	{ name: 'Partially Shipped', value: 'PARTIALLY_SHIPPED' },
	{ name: 'Pending', value: 'PENDING' },
	{ name: 'Processing', value: 'PROCESSING' },
	{ name: 'Refunded', value: 'REFUNDED' },
	{ name: 'Shipped', value: 'SHIPPED' },
];

export const orderOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
		options: [
			{
				name: 'Fulfill',
				value: 'fulfill',
				action: 'Fulfill an order',
				description: 'Decrement stock for the order and (by default) mark it shipped',
				routing: {
					request: {
						method: 'POST',
						url: '=/orders/{{$parameter.orderId}}/fulfill',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an order',
				routing: {
					request: {
						method: 'GET',
						url: '=/orders/{{$parameter.orderId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many orders',
				routing: {
					request: {
						method: 'GET',
						url: '/orders',
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
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update the status of an order',
				description:
					'Change the order status. Note: setting SHIPPED does not decrement stock — use Fulfill for that.',
				routing: {
					request: {
						method: 'PUT',
						url: '=/orders/{{$parameter.orderId}}/status',
					},
				},
			},
		],
		default: 'getAll',
	},
];

export const orderFields: INodeProperties[] = [
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		description: 'The UUID of the order (not the channel order number)',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get', 'updateStatus', 'fulfill'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		options: orderStatusOptions,
		default: 'PROCESSING',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateStatus'],
			},
		},
		routing: {
			send: { type: 'body', property: 'status' },
		},
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		default: '',
		description: 'Recorded in the order status history (max 1000 characters)',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['updateStatus'],
			},
		},
		routing: {
			send: { type: 'body', property: 'note' },
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
				resource: ['order'],
				operation: ['fulfill'],
			},
		},
		options: [
			{
				displayName: 'Mark Shipped',
				name: 'markShipped',
				type: 'boolean',
				default: true,
				description:
					'Whether to move the order to SHIPPED after fulfilling. Turn off to decrement stock without changing the status.',
				routing: {
					send: { type: 'body', property: 'markShipped' },
				},
			},
			{
				displayName: 'Warehouse ID',
				name: 'warehouseId',
				type: 'string',
				default: '',
				description:
					'Fulfill from this warehouse. Leave the option off to let Foundry pick the warehouse that can cover the order.',
				routing: {
					send: { type: 'body', property: 'warehouseId' },
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
				resource: ['order'],
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
				resource: ['order'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				description: 'Only orders from this sales channel',
				routing: {
					send: { type: 'query', property: 'channelId' },
				},
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Only orders placed before this date',
				routing: {
					send: { type: 'query', property: 'endDate' },
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
				description: 'Matches order number, customer name, and email',
				routing: {
					send: { type: 'query', property: 'search' },
				},
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Only orders placed after this date',
				routing: {
					send: { type: 'query', property: 'startDate' },
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: orderStatusOptions,
				default: 'PENDING',
				routing: {
					send: { type: 'query', property: 'status' },
				},
			},
		],
	},
];
