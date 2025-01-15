import { useModal, useToast } from '#imports';
import type { OllamaError } from '~/types/ollama';
import { useOllama } from './useOllama';

interface ModelActionOptions {
	silent?: boolean;
}

export function useModelActions() {
	const modal = useModal();
	const toast = useToast();
	const ollama = useOllama();

	const normalizeModelName = (name: string) => {
		// If the name doesn't include a tag (no colon), append :latest
		return name.includes(':') ? name : `${name}:latest`;
	};

	const handleSuccess = (title: string, description: string, options?: ModelActionOptions) => {
		if (options?.silent) return;

		toast.add({
			title,
			description,
			icon: 'i-heroicons-check-circle',
			color: 'primary',
		});
	};

	const handleError = (error: OllamaError, fallbackMessage: string, options?: ModelActionOptions) => {
		if (options?.silent) return;

		toast.add({
			title: 'Error',
			description: error.message || fallbackMessage,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'error',
		});

		throw error;
	};

	const copyModel = async (modelName: string, newName: string, options?: ModelActionOptions) => {
		try {
			await ollama.copyModel(modelName, newName);
			handleSuccess('Model copied', `Successfully copied ${modelName} to ${newName}`, options);
		} catch (err) {
			const error = err as OllamaError;
			handleError(error, `Failed to copy ${modelName}`, options);
			throw error;
		}
	};

	const deleteModel = async (modelName: string, options?: ModelActionOptions) => {
		try {
			await ollama.deleteModel(modelName);
			handleSuccess('Model deleted', `Successfully deleted ${modelName}`, options);
		} catch (err) {
			const error = err as OllamaError;
			handleError(error, `Failed to delete ${modelName}`, options);
			throw error;
		}
	};

	const renameModel = async (oldName: string, newName: string, options?: ModelActionOptions) => {
		// Prevent renaming if the normalized names would be the same
		if (normalizeModelName(oldName) === normalizeModelName(newName)) {
			const error = new Error(
				'Cannot rename: source and destination would resolve to the same model name'
			) as OllamaError;
			handleError(error, `Failed to rename ${oldName}`, options);
			throw error;
		}

		try {
			await copyModel(oldName, newName, { silent: true });
			try {
				await deleteModel(oldName, { silent: true });
				handleSuccess('Model renamed', `Successfully renamed ${oldName} to ${newName}`, options);
			} catch (deleteError) {
				// If deleting the old model fails, try to clean up the new model
				try {
					await deleteModel(newName, { silent: true });
				} catch {
					// Ignore cleanup errors
				}
				const error = deleteError as OllamaError;
				handleError(error, `Failed to rename ${oldName}`, options);
				throw error;
			}
		} catch (err) {
			const error = err as OllamaError;
			handleError(error, `Failed to rename ${oldName}`, options);
			throw error;
		}
	};

	return {
		modal,
		copyModel,
		deleteModel,
		renameModel,
	};
}
