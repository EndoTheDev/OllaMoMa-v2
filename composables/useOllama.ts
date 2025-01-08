import { Ollama } from 'ollama/browser';
import type { GenerateRequest, GenerateResponse } from 'ollama/browser';
import { useSettingsStore } from '~/stores/settings';
import type { OllamaModel, OllamaModelDetails } from '~/types/ollama';
import { OllamaError } from '~/types/ollama';
import { useState } from '#imports';
import { computed } from 'vue';

interface OllamaConfig {
	host: string;
}

interface OllamaState {
	models: OllamaModel[];
	isLoading: boolean;
	error: string | null;
}

export const useOllama = (config: Partial<OllamaConfig> = {}) => {
	const settingsStore = useSettingsStore();

	const defaultConfig: OllamaConfig = {
		host: `http://${settingsStore.ollamaHost}:${settingsStore.ollamaPort}`,
	};

	const client = new Ollama({
		...defaultConfig,
		...config,
	});

	// State
	const state = useState<OllamaState>('ollama-state', () => ({
		models: [],
		isLoading: false,
		error: null,
	}));

	// Getters
	const models = computed(() => state.value.models);
	const isLoading = computed(() => state.value.isLoading);
	const error = computed(() => state.value.error);

	const getModelByName = computed(() => {
		return (name: string) => state.value.models.find((model) => model.name === name);
	});

	const hasModels = computed(() => state.value.models.length > 0);

	// Actions
	async function fetchModels(): Promise<void> {
		state.value.isLoading = true;
		state.value.error = null;

		try {
			const response = await client.list();

			if (!response?.models) {
				throw new Error('No models returned from API');
			}

			state.value.models = response.models.map(
				(model): OllamaModel => ({
					...model,
					modified_at: model.modified_at.toLocaleString(),
				})
			);
		} catch (err) {
			const error = new OllamaError('Failed to fetch models', err);
			state.value.error = error.message;
			console.error('Failed to fetch models:', error);
			throw error;
		} finally {
			state.value.isLoading = false;
		}
	}

	async function showModel(name: string): Promise<OllamaModelDetails> {
		state.value.isLoading = true;
		state.value.error = null;

		try {
			const response = await client.show({ model: name });

			if (!response) {
				throw new Error('No model details returned from API');
			}

			return {
				license: response.license,
				modelfile: response.modelfile,
				parameters: response.parameters,
				template: response.template,
				system: response.system,
				parent_model: response.details?.parent_model || '',
				format: response.details?.format || '',
				family: response.details?.family || '',
				families: response.details?.families || [],
				parameter_size: response.details?.parameter_size || '',
				quantization_level: response.details?.quantization_level || '',
			};
		} catch (err) {
			const error = new OllamaError(`Failed to fetch details for model ${name}`, err);
			state.value.error = error.message;
			console.error(`Failed to fetch details for model ${name}:`, error);
			throw error;
		} finally {
			state.value.isLoading = false;
		}
	}

	async function copyModel(source: string, destination: string): Promise<void> {
		state.value.isLoading = true;
		state.value.error = null;

		try {
			await client.copy({ source, destination });
			await fetchModels();
		} catch (err) {
			const error = new OllamaError(`Failed to copy model from ${source} to ${destination}`, err);
			state.value.error = error.message;
			console.error(error);
			throw error;
		} finally {
			state.value.isLoading = false;
		}
	}

	async function deleteModel(name: string): Promise<void> {
		state.value.isLoading = true;
		state.value.error = null;

		try {
			await client.delete({ model: name });
			await fetchModels();
		} catch (err) {
			const error = new OllamaError(`Failed to delete model ${name}`, err);
			state.value.error = error.message;
			console.error(error);
			throw error;
		} finally {
			state.value.isLoading = false;
		}
	}

	async function generate(request: GenerateRequest & { stream?: false }): Promise<GenerateResponse> {
		state.value.isLoading = true;
		state.value.error = null;

		try {
			const response = await client.generate(request);

			if (!response) {
				throw new Error('No response returned from API');
			}

			return response;
		} catch (err) {
			const error = new OllamaError(`Failed to generate response with model ${request.model}`, err);
			state.value.error = error.message;
			console.error(error);
			throw error;
		} finally {
			state.value.isLoading = false;
		}
	}

	return {
		// State exports
		models,
		isLoading,
		error,

		// Getter exports
		getModelByName,
		hasModels,

		// Action exports
		fetchModels,
		showModel,
		copyModel,
		deleteModel,
		generate,
	};
};
