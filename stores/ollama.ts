import { defineStore } from 'pinia'
import { useOllamaClient } from '~/composables/useOllamaClient'
import type { OllamaState, OllamaModel } from '~/types/ollama'
import { OllamaError } from '~/types/ollama'

export const useOllamaStore = defineStore('ollama', () => {
	const client = useOllamaClient()

	// State
	const state = reactive<OllamaState>({
		models: [],
		isLoading: false,
		error: null
	})

	// Getters
	const getModelByName = computed(() => {
		return (name: string) => state.models.find(model => model.name === name)
	})

	const hasModels = computed(() => state.models.length > 0)

	const sortedModels = computed(() => {
		return [...state.models].sort((a, b) => {
			return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime()
		})
	})

	// Actions
	async function fetchModels(): Promise<void> {
		state.isLoading = true
		state.error = null
		
		try {
			const response = await client.list()
			state.models = response.models.map((model): OllamaModel => ({
				...model,
				modified_at: model.modified_at.toLocaleString()
			}))
		} catch (err) {
			const error = new OllamaError('Failed to fetch models', err)
			state.error = error.message
			console.error(error)
			throw error
		} finally {
			state.isLoading = false
		}
	}

	async function copyModel(source: string, destination: string): Promise<void> {
		state.isLoading = true
		state.error = null
		
		try {
			await client.copy({ source, destination })
			await fetchModels()
		} catch (err) {
			const error = new OllamaError(`Failed to copy model from ${source} to ${destination}`, err)
			state.error = error.message
			console.error(error)
			throw error
		} finally {
			state.isLoading = false
		}
	}

	async function deleteModel(name: string): Promise<void> {
		state.isLoading = true
		state.error = null
		
		try {
			await client.delete({ model: name })
			await fetchModels()
		} catch (err) {
			const error = new OllamaError(`Failed to delete model ${name}`, err)
			state.error = error.message
			console.error(error)
			throw error
		} finally {
			state.isLoading = false
		}
	}

	return {
		// State exports
		models: computed(() => state.models),
		isLoading: computed(() => state.isLoading),
		error: computed(() => state.error),

		// Getter exports
		getModelByName,
		hasModels,
		sortedModels,

		// Action exports
		fetchModels,
		copyModel,
		deleteModel
	}
})
