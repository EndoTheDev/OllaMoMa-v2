import { Ollama } from "ollama/browser";
import type {
  GenerateRequest,
  GenerateResponse,
  ChatRequest,
  ChatResponse,
} from "ollama/browser";
import { useSettingsStore } from "~/stores/settings";
import type { OllamaModel, OllamaModelDetails } from "~/types/ollama";
import { OllamaError } from "~/types/ollama";
import { useState } from "#imports";
import { computed } from "vue";

// Types
interface OllamaConfig {
  host: string;
}

interface OllamaState {
  models: OllamaModel[];
  isLoading: boolean;
  error: string | null;
}

// Composable
export const useOllama = (config: Partial<OllamaConfig> = {}) => {
  const settingsStore = useSettingsStore();

  // Initialize Ollama client
  const client = new Ollama({
    host: `http://${settingsStore.ollamaHost}:${settingsStore.ollamaPort}`,
    ...config,
  });

  // State management
  const state = useState<OllamaState>("ollama-state", () => ({
    models: [],
    isLoading: false,
    error: null,
  }));

  // Computed properties
  const models = computed(() => {
    const allModels = state.value.models;
    const settingsStore = useSettingsStore();
    if (settingsStore.airplaneMode) {
      // Hide cloud models when airplane mode is ON
      return allModels.filter((model) => !("remote_host" in model));
    }
    return allModels;
  });
  const isLoading = computed(() => state.value.isLoading);
  const error = computed(() => state.value.error);
  const hasModels = computed(() => state.value.models.length > 0);
  const getModelByName = computed(
    () => (name: string) =>
      state.value.models.find((model) => model.name === name)
  );

  // Error handling utility
  const handleError = (message: string, err: unknown): never => {
    const error = new OllamaError(message, err);
    state.value.error = error.message;
    console.error(message, error);
    throw error;
  };

  // API actions
  async function fetchModels(): Promise<void> {
    state.value.isLoading = true;
    state.value.error = null;

    try {
      const response = await client.list();
      if (!response?.models) {
        throw new Error("No models returned from API");
      }

      state.value.models = response.models.map(
        (model): OllamaModel => ({
          ...model,
          modified_at: model.modified_at.toLocaleString(),
        })
      );
    } catch (err) {
      handleError("Failed to fetch models", err);
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
        throw new Error("No model details returned from API");
      }

      const details: OllamaModelDetails = {
        license: response.license,
        modelfile: response.modelfile,
        parameters: response.parameters,
        template: response.template,
        system: response.system,
        parent_model: response.details?.parent_model || "",
        format: response.details?.format || "",
        family: response.details?.family || "",
        families: response.details?.families || [],
        parameter_size: response.details?.parameter_size || "",
        quantization_level: response.details?.quantization_level || "",
      };

      return details;
    } catch (err) {
      return handleError(`Failed to fetch details for model ${name}`, err);
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
      handleError(`Failed to copy model from ${source} to ${destination}`, err);
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
      handleError(`Failed to delete model ${name}`, err);
    } finally {
      state.value.isLoading = false;
    }
  }

  async function generate(
    request: GenerateRequest & { stream?: false }
  ): Promise<GenerateResponse> {
    state.value.isLoading = true;
    state.value.error = null;

    try {
      const response = await client.generate(request);
      if (!response) {
        throw new Error("No response returned from API");
      }

      return response;
    } catch (err) {
      return handleError(
        `Failed to generate response with model ${request.model}`,
        err
      );
    } finally {
      state.value.isLoading = false;
    }
  }

  async function streamGenerate(
    request: GenerateRequest & { stream: true }
  ): Promise<AsyncIterable<GenerateResponse>> {
    state.value.isLoading = true;
    state.value.error = null;

    try {
      const stream = await client.generate(request);
      if (!stream) {
        throw new Error("No stream returned from API");
      }

      return stream;
    } catch (err) {
      return handleError(
        `Failed to generate streaming response with model ${request.model}`,
        err
      );
    } finally {
      state.value.isLoading = false;
    }
  }

  async function chat(
    request: ChatRequest & { stream?: false }
  ): Promise<ChatResponse> {
    state.value.isLoading = true;
    state.value.error = null;

    try {
      const response = await client.chat(request);
      if (!response) {
        throw new Error("No response returned from API");
      }

      return response;
    } catch (err) {
      return handleError(`Failed to chat with model ${request.model}`, err);
    } finally {
      state.value.isLoading = false;
    }
  }

  async function streamChat(
    request: ChatRequest & { stream: true }
  ): Promise<AsyncIterable<ChatResponse>> {
    state.value.isLoading = true;
    state.value.error = null;

    try {
      const stream = await client.chat(request);
      if (!stream) {
        throw new Error("No stream returned from API");
      }

      return stream;
    } catch (err) {
      return handleError(
        `Failed to chat stream with model ${request.model}`,
        err
      );
    } finally {
      state.value.isLoading = false;
    }
  }

  return {
    // State
    models,
    isLoading,
    error,

    // Computed
    getModelByName,
    hasModels,

    // Actions
    fetchModels,
    showModel,
    copyModel,
    deleteModel,
    generate,
    streamGenerate,
    chat,
    streamChat,
  };
};
