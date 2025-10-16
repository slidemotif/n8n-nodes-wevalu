export interface WeValuCredentials {
	baseUrl?: string;
	apiKey: string;
}

export interface EvaluationOptions {
	departmentId?: string;
	iteration?: number;
	offset?: number;
}

export interface EvaluationItem {
	id?: string;
	evaluatorName?: string;
	evaluatedName?: string;
	year?: number;
	iteration?: number;
	evaluationResponse?: {
		// Personality & Interaction
		actWithCredibility?: number;
		beingResilient?: number;
		actReliable?: number;
		takingResponsibility?: number;
		showEngagement?: number;
		beingOpen?: number;
		leadAuthentically?: number;
		communicateSkillfully?: number;
		teamContribution?: number;
		solveConflicts?: number;
		presentConvincingly?: number;
		debateConfidently?: number;
		// Leadership & Organization
		enforceSuccessfully?: number;
		leadAppreciatively?: number;
		organizeIndependently?: number;
		planningWithSenseOfConfidence?: number;
		solvingProblems?: number;
		proceedAnalytically?: number;
		// Strategy & Implementation
		actEntrepreneurially?: number;
		designNew?: number;
		goalOrientedLeader?: number;
		followThroughWithProjects?: number;
		implementEfficiently?: number;
		solutionOrientedConsulting?: number;
		makingDecisions?: number;
		actGoalOriented?: number;
		proceedStrategically?: number;
		leadResponsibly?: number;
		// Overall ratings
		performance?: number;
		potential?: number;
		comment?: {
			personality?: string;
			interaction?: string;
			skill?: string;
			implementation?: string;
		};
		mboRating?: Array<{
			mboId?: string;
			name?: string;
			rating?: number;
		}>;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface EvaluationsEnvelope {
	evaluations?: EvaluationItem[];
}

export interface ListApiResponse {
	data?: EvaluationsEnvelope;
	evaluations?: EvaluationItem[];
}

export interface SummaryData {
	summary: {
		totalEvaluations: number;
		avgPerformance: string;
		avgPotential: string;
		iterations: Array<{
			iteration: number;
			count: number;
			avgPerformance: number;
			avgPotential: number;
		}>;
	};
}

export interface SummaryApiResponse {
	data?: SummaryData;
}
