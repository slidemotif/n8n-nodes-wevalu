import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import type {
	EvaluationItem,
	EvaluationOptions,
	EvaluationsEnvelope,
	ListApiResponse,
	SummaryApiResponse,
	SummaryData,
	WeValuCredentials,
} from './types';

const DEFAULT_BASE_URL = 'https://api.wevalu.io';
const BATCH_SIZE = 100;
const API_EVALUATIONS_PATH = '/api/integrations/evaluations';
const API_EVALUATIONS_SUMMARY_PATH = '/api/integrations/evaluations/summary';
const ERROR_PREFIX = 'WeValu API';
const DEFAULT_ERROR_MESSAGE = 'Unknown error occurred';

export class WeValu implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WeValu',
		name: 'weValu',
		icon: { light: 'file:wevalu.svg', dark: 'file:wevalu.svg' },
		group: ['transform'],
		version: 1,
		description: 'WeValu integrations',
		defaults: {
			name: 'WeValu',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'weValuApi',
				required: true,
			},
		],
		properties: [
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [{ name: 'Evaluation', value: 'evaluation' }],
				default: 'evaluation',
			},

			// Operation
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['evaluation'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get evaluation metrics',
						action: 'Get evaluation metrics',
					},
					{
						name: 'Get Summary',
						value: 'getSummary',
						description: 'Get evaluation summary statistics',
						action: 'Get evaluation summary',
					},
				],
				default: 'getAll',
			},

			// Options for getAll
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['evaluation'],
						operation: ['getAll'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['evaluation'],
						operation: ['getAll'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['evaluation'],
						operation: ['getAll'],
					},
				},
				options: [
					{
						displayName: 'Department ID',
						name: 'departmentId',
						type: 'string',
						default: '',
						description: 'Filter evaluations by department ID',
					},
					{
						displayName: 'Iteration',
						name: 'iteration',
						type: 'number',
						default: 0,
						description: 'Filter evaluations by iteration number',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of evaluations to skip',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = (await this.getCredentials('weValuApi')) as WeValuCredentials;
		const apiKey = credentials.apiKey;
		const baseUrl = (credentials.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');

		// Get selected resource and operation
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const createRequestOptions = (
			path: string,
			queryParams?: IDataObject,
		): IHttpRequestOptions => ({
			url: `${baseUrl}${path}`,
			method: 'GET',
			headers: {
				'X-API-Key': apiKey,
			},
			qs: queryParams,
			json: true,
		});

		const buildQueryParams = (
			options: EvaluationOptions,
			limit?: number,
			offset?: number,
		): IDataObject => {
			const params: IDataObject = {};

			if (limit !== undefined) {
				params.limit = limit;
			}

			if (offset !== undefined) {
				params.offset = offset;
			} else if (options.offset !== undefined) {
				params.offset = options.offset;
			}

			if (options.departmentId) {
				params.departmentId = options.departmentId;
			}

			if (options.iteration !== undefined && options.iteration !== 0) {
				params.iteration = options.iteration;
			}

			return params;
		};

		const fetchAllEvaluations = async (options: EvaluationOptions): Promise<EvaluationItem[]> => {
			const allItems: EvaluationItem[] = [];
			let offset = options.offset || 0;
			let hasMore = true;

			while (hasMore) {
				const queryParams = buildQueryParams(options, BATCH_SIZE, offset);
				const requestOptions = createRequestOptions(API_EVALUATIONS_PATH, queryParams);

				try {
					const response = (await this.helpers.request(requestOptions)) as ListApiResponse;
					const items: EvaluationItem[] = response.data?.evaluations || response.evaluations || [];

					allItems.push(...items);

					hasMore = items.length === BATCH_SIZE && items.length > 0;
					offset += BATCH_SIZE;
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: `${ERROR_PREFIX}: ${errorMessage}`,
					});
				}
			}

			return allItems;
		};

		const fetchEvaluations = async (
			options: EvaluationOptions,
			limit: number,
		): Promise<EvaluationsEnvelope | ListApiResponse> => {
			const queryParams = buildQueryParams(options, limit);
			const requestOptions = createRequestOptions(API_EVALUATIONS_PATH, queryParams);

			try {
				const response = (await this.helpers.request(requestOptions)) as ListApiResponse;
				return response.data || response;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
				throw new NodeApiError(this.getNode(), error as JsonObject, {
					message: `${ERROR_PREFIX}: ${errorMessage}`,
				});
			}
		};

		const fetchEvaluationSummary = async (): Promise<SummaryData | SummaryApiResponse> => {
			const requestOptions = createRequestOptions(API_EVALUATIONS_SUMMARY_PATH);

			try {
				const response = (await this.helpers.request(requestOptions)) as SummaryApiResponse;
				return response.data || response;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
				throw new NodeApiError(this.getNode(), error as JsonObject, {
					message: `${ERROR_PREFIX}: ${errorMessage}`,
				});
			}
		};

		const processResponseData = (responseData: unknown): INodeExecutionData[] => {
			if (Array.isArray(responseData)) {
				return responseData.map((item: EvaluationItem) => ({ json: item as IDataObject }));
			}

			if (responseData && typeof responseData === 'object') {
				const data = responseData as EvaluationsEnvelope | SummaryData;
				if ('evaluations' in data && Array.isArray((data as EvaluationsEnvelope).evaluations)) {
					return (data as EvaluationsEnvelope).evaluations!.map((item: EvaluationItem) => ({
						json: item as IDataObject,
					}));
				}
				return [{ json: data as IDataObject }];
			}

			return [];
		};

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: unknown;

				if (resource === 'evaluation') {
					switch (operation) {
						case 'getAll': {
							const returnAll = this.getNodeParameter('returnAll', i) as boolean;
							const options = this.getNodeParameter('options', i, {}) as EvaluationOptions;

							if (returnAll) {
								responseData = await fetchAllEvaluations(options);
							} else {
								const limit = this.getNodeParameter('limit', i) as number;
								responseData = await fetchEvaluations(options, limit);
							}
							break;
						}
						case 'getSummary': {
							responseData = await fetchEvaluationSummary();
							break;
						}
						default:
							throw new NodeOperationError(
								this.getNode(),
								`${ERROR_PREFIX}: Unknown operation '${operation}'`,
							);
					}
				}

				const processedData = processResponseData(responseData);
				returnData.push(...processedData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE;
					returnData.push({
						json: {
							error: errorMessage,
							itemIndex: i,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
