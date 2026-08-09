# @foundry-ims/n8n-nodes-foundry-ims

Official [Foundry IMS](https://foundryims.com) community node for [n8n](https://n8n.io). Manage your catalog, stock, and orders from workflows, and trigger workflows the moment something happens in Foundry — an order arriving, availability changing, an import finishing.

Foundry IMS is an inventory management system for e-commerce operators: one catalog feeding your sales channels, with stock, purchasing, and fulfillment behind it.

## Installation

Follow the [n8n community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/). The package name is:

```
@foundry-ims/n8n-nodes-foundry-ims
```

## Credentials

Create an API key in Foundry under **Settings → API Keys → Create API Key**, then add a **Foundry IMS API** credential in n8n and paste the key. The key is bound to one organization and only grants the permissions you tick when creating it — a read-only key makes every operation read-only, and the trigger node needs `webhooks.manage`.

## Nodes

### Foundry IMS

| Resource | Operations |
| --- | --- |
| Product | Get, Get Many, Create, Update, Delete (to trash), Restore |
| Variant | Get, Get Many, Create, Update |
| Stock | Adjust, Get Breakdown, Get Many Movements, Transfer |
| Order | Get, Get Many, Update Status, Fulfill |
| Custom Field Value | Get, Set |

### Foundry IMS Trigger

Starts a workflow from Foundry's signed webhooks. Pick any combination of events — the list is loaded live from your Foundry account and includes `order.created`, `order.shipped`, `inventory.availability_changed`, `product.created`, `import.completed`, and more. The node manages the webhook subscription for you (created on activation, removed on deactivation) and verifies every delivery's HMAC signature before your workflow runs.

## Example workflows

- **Order → Slack**: Foundry IMS Trigger (`order.created`) → Slack. Post the order number and channel to your ops channel as orders land.
- **Import guard**: Foundry IMS Trigger (`import.completed`) → IF (`skippedCount > 0`) → email. Only hear about supplier feeds when rows were skipped.
- **Margin watch**: Foundry IMS Trigger (`variant.cost_changed`) → Foundry IMS (Variant → Get) → IF → notify when a cost change pushes margin below target.
- **Catalog audit**: Schedule → Foundry IMS (Variant → Get Many) → Filter (missing UPC) → email a consolidated gap report.

## Resources

- [Foundry IMS + n8n integration page](https://foundryims.com/integrations/automation/n8n/)
- [Partner API reference](https://foundryims.com/docs/partner-api/)
- [Webhook events reference](https://foundryims.com/docs/webhooks/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
