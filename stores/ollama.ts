import { defineStore } from 'pinia'
import ollama from 'ollama'

interface ModelDetails {
  parent_model: string
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}

interface OllamaModel {
  name: string
  modified_at: string
  size: number
  digest: string
  details?: ModelDetails
}

interface OllamaState {
  models: OllamaModel[]
  isLoading: boolean
  error: string | null
}

export const useOllamaStore = defineStore('ollama', {
  state: (): OllamaState => ({
    models: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchModels() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await ollama.list()
        this.models = response.models.map(model => ({
          ...model,
          modified_at: model.modified_at.toLocaleString()
        }))
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to fetch models'
        console.error('Error fetching Ollama models:', err)
      } finally {
        this.isLoading = false
      }
    }
  },

  getters: {
    getModelByName: (state) => {
      return (name: string) => state.models.find(model => model.name === name)
    },
    hasModels: (state) => state.models.length > 0
  }
})
