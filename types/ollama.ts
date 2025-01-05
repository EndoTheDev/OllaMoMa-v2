export interface ModelDetails {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
}

export interface OllamaModelDetails extends ModelDetails {
	license: string;
	modelfile: string;
	parameters: string;
	template: string;
	system: string;
}

export interface OllamaModel {
	name: string;
	modified_at: string;
	size: number;
	digest: string;
	details?: ModelDetails;
}

export interface OllamaState {
	models: OllamaModel[];
	isLoading: boolean;
	error: string | null;
}

export class OllamaError extends Error {
	constructor(message: string, public override readonly cause?: unknown) {
		super(message);
		this.name = 'OllamaError';
	}
} 