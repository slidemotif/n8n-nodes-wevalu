# n8n-nodes-wevalu

This is an n8n community node. It lets you use WeValu in your n8n workflows.

WeValu is a comprehensive HR and evaluation platform for managing employee performance reviews, talent assessments, and organizational development.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-wevalu` in **Enter npm package name**
4. Agree to the risks and install

### Manual Installation

```bash
npm install n8n-nodes-wevalu
```

## Operations

### Evaluation Resource

- **Get Many**: Retrieve multiple employee evaluations with filtering and pagination
  - Filter by department ID
  - Filter by iteration number
  - Support for pagination (limit/offset)
  - Option to return all results

- **Get Summary**: Get aggregated statistics across all evaluations
  - Total evaluations count
  - Average performance and potential scores
  - Statistics grouped by iteration

## Credentials

To use this node, you need a WeValu API Key:

1. Log in to your WeValu account
2. Navigate to **Settings** > **API Keys**
3. Click **Create New API Key**
4. Give it a name and select the `evaluations:read` scope
5. Copy the generated API key (you'll only see it once!)

### Setting up credentials in n8n

1. In n8n, go to **Credentials** > **New**
2. Search for "WeValu API"
3. Enter your API Key
4. (Optional) Change the Base URL if using a custom WeValu instance
5. Save

## Compatibility

- Minimum n8n version: 1.0.0
- Tested with n8n version: 1.x
- Node.js version: >=20.15

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [WeValu Documentation](https://docs.wevalu.io/)
* [WeValu API Documentation](https://docs.wevalu.io/integrations/api-key)

## License

[MIT](LICENSE.md)
