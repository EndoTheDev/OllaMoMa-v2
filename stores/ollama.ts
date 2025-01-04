import { defineStore } from 'pinia'
import { Ollama } from 'ollama/browser'

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

// Create an Ollama instance with your server configuration
const ollama = new Ollama({
  host: 'http://localhost:11434' // or your Ollama server URL
})

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
    },

    async copyModel(source: string, destination: string) {
      this.isLoading = true
      this.error = null
      
      try {
        await ollama.copy({ source, destination })
        await this.fetchModels()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to copy model'
        console.error('Error copying Ollama model:', err)
      } finally {
        this.isLoading = false
      }
    },

    async deleteModel(name: string) {
      this.isLoading = true
      this.error = null
      
      try {
        await ollama.delete({ model: name })
        await this.fetchModels()
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to delete model'
        console.error('Error deleting Ollama model:', err)
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
