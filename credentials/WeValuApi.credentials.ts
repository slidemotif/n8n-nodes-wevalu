import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WeValuApi implements ICredentialType {
	name = 'weValuApi';
	displayName = 'WeValu API';
	documentationUrl = 'https://github.com/slidemotif/n8n-nodes-wevalu#credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your WeValu API Key',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.wevalu.io',
			description: 'WeValu API base URL',
		},
	];
}
