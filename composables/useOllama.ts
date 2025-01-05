import type { OllamaModel, OllamaState } from '~/types/ollama'
import { OllamaError } from '~/types/ollama'

export const useOllama = () => {
  const client = useOllamaClient()

  // State
  const state = useState<OllamaState>('ollama-state', () => ({
    models: [],
    isLoading: false,
    error: null
  }))

  // Getters
  const models = computed(() => state.value.models)
  const isLoading = computed(() => state.value.isLoading)
  const error = computed(() => state.value.error)

  const getModelByName = computed(() => {
    return (name: string) => state.value.models.find(model => model.name === name)
  })

  const hasModels = computed(() => state.value.models.length > 0)

  const sortedModels = computed(() => {
    return [...state.value.models].sort((a, b) => {
      return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
    })
  })

  // Actions
  async function fetchModels(): Promise<void> {
    state.value.isLoading = true
    state.value.error = null
    
    try {
      const response = await client.list()
      
      if (!response?.models) {
        throw new Error('No models returned from API')
      }
      
      state.value.models = response.models.map((model): OllamaModel => ({
        ...model,
        modified_at: model.modified_at.toLocaleString()
      }))
    } catch (err) {
      const error = new OllamaError('Failed to fetch models', err)
      state.value.error = error.message
      console.error('Failed to fetch models:', error)
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  async function copyModel(source: string, destination: string): Promise<void> {
    state.value.isLoading = true
    state.value.error = null
    
    try {
      await client.copy({ source, destination })
      await fetchModels()
    } catch (err) {
      const error = new OllamaError(`Failed to copy model from ${source} to ${destination}`, err)
      state.value.error = error.message
      console.error(error)
      throw error
    } finally {
      state.value.isLoading = false
    }
  }

  async function deleteModel(name: string): Promise<void> {
    state.value.isLoading = true
    state.value.error = null
    
    try {
      await client.delete({ model: name })
      await fetchModels()
    } catch (err) {
      const error = new OllamaError(`Failed to delete model ${name}`, err)
      state.value.error = error.message
      console.error(error)
      throw error
    } finally {
      state.value.isLoading = false
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
    sortedModels,

    // Action exports
    fetchModels,
    copyModel,
    deleteModel
  }
} 