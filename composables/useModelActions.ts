import { useModal, useToast } from '#imports';
import { useOllamaStore } from '~/stores/ollama';
import type { OllamaError } from '~/types/ollama';

interface ModelActionOptions {
	silent?: boolean;
}

export function useModelActions() {
	const modal = useModal();
	const toast = useToast();
	const ollamaStore = useOllamaStore();

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
			await ollamaStore.copyModel(modelName, newName);
			handleSuccess(
				'Model copied',
				`Successfully copied ${modelName} to ${newName}`,
				options
			);
		} catch (err) {
			handleError(
				err as OllamaError,
				`Failed to copy ${modelName}`,
				options
			);
		}
	};

	const deleteModel = async (modelName: string, options?: ModelActionOptions) => {
		try {
			await ollamaStore.deleteModel(modelName);
			handleSuccess(
				'Model deleted',
				`Successfully deleted ${modelName}`,
				options
			);
		} catch (err) {
			handleError(
				err as OllamaError,
				`Failed to delete ${modelName}`,
				options
			);
		}
	};

	const renameModel = async (oldName: string, newName: string, options?: ModelActionOptions) => {
		try {
			await copyModel(oldName, newName, { silent: true });
			try {
				await deleteModel(oldName, { silent: true });
				handleSuccess(
					'Model renamed',
					`Successfully renamed ${oldName} to ${newName}`,
					options
				);
			} catch (deleteError) {
				await deleteModel(newName, { silent: true });
				throw deleteError;
			}
		} catch (err) {
			handleError(
				err as OllamaError,
				`Failed to rename ${oldName}`,
				options
			);
		}
	};

	return {
		modal,
		copyModel,
		deleteModel,
		renameModel
	};
} 