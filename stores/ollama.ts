import { defineStore } from 'pinia'
import { useOllamaClient } from '~/composables/useOllamaClient'

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

export class OllamaError extends Error {
	constructor(message: string, public override readonly cause?: unknown) {
		super(message)
		this.name = 'OllamaError'
	}
}

export const useOllamaStore = defineStore('ollama', {
	state: (): OllamaState => ({
		models: [],
		isLoading: false,
		error: null
	}),

	actions: {
		async fetchModels() {
			const client = useOllamaClient()
			this.isLoading = true
			this.error = null
			
			try {
				const response = await client.list()
				this.models = response.models.map(model => ({
					...model,
					modified_at: model.modified_at.toLocaleString()
				}))
			} catch (err) {
				const error = new OllamaError('Failed to fetch models', err)
				this.error = error.message
				console.error(error)
				throw error
			} finally {
				this.isLoading = false
			}
		},

		async copyModel(source: string, destination: string) {
			const client = useOllamaClient()
			this.isLoading = true
			this.error = null
			
			try {
				await client.copy({ source, destination })
				await this.fetchModels()
			} catch (err) {
				const error = new OllamaError(`Failed to copy model from ${source} to ${destination}`, err)
				this.error = error.message
				console.error(error)
				throw error
			} finally {
				this.isLoading = false
			}
		},

		async deleteModel(name: string) {
			const client = useOllamaClient()
			this.isLoading = true
			this.error = null
			
			try {
				await client.delete({ model: name })
				await this.fetchModels()
			} catch (err) {
				const error = new OllamaError(`Failed to delete model ${name}`, err)
				this.error = error.message
				console.error(error)
				throw error
			} finally {
				this.isLoading = false
			}
		}
	},

	getters: {
		getModelByName: (state) => {
			return (name: string) => state.models.find(model => model.name === name)
		},
		hasModels: (state) => state.models.length > 0,
		sortedModels: (state) => {
			return [...state.models].sort((a, b) => {
				return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
			})
		}
	}
})
