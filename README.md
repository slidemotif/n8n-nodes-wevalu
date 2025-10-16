# @wevalu/n8n-nodes-wevalu

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
3. Enter `@wevalu/n8n-nodes-wevalu` in **Enter npm package name**
4. Agree to the risks and install

### Manual Installation

```bash
npm install @wevalu/n8n-nodes-wevalu
```

## Operations

### WeValu node (Resources & Operations)

- Resource: Evaluation
  - Operation: Get Many — filter by department ID, iteration; limit/offset or return all
  - Operation: Get Summary — total count, average performance/potential, per-iteration statistics

## Credentials

To use this node, you need a WeValu API Key:

1. Log in to your WeValu account
2. Navigate to **Settings** > **Security** > **API Keys**
3. Click **Create New API Key**
4. Give it a name and select the `evaluations:read` scope
5. Copy the generated API key (you'll only see it once!)

### Setting up credentials in n8n

1. Add the **WeValu** node to the canvas and open it.
2. In **Parameters**, open the **Credential to connect with** dropdown.
3. Click **Create new credential**.
4. Enter your **API Key**; optionally set **Base URL** if you use a custom WeValu instance.
5. Save the credential and select it from the dropdown.
6. The warning will disappear, and you can run the operation.

## Compatibility

- Minimum n8n version: 1.0.0
- Tested with n8n version: 1.x
- Node.js version: >=20.15

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)

## License

[MIT](LICENSE.md)
