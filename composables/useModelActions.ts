import { useModal } from '#imports';
import { useToast } from '#imports';
import { useOllamaStore } from '~/stores/ollama';

export function useModelActions() {
	const modal = useModal();
	const toast = useToast();
	const ollamaStore = useOllamaStore();

	const copyModel = async (modelName: string, newName: string, silent = false) => {
		try {
			await ollamaStore.copyModel(modelName, newName);
			if (!silent) {
				toast.add({
					title: 'Model copied',
					description: `Successfully copied ${modelName} to ${newName}`,
					icon: 'i-heroicons-document-duplicate',
					color: 'primary',
				});
			}
		} catch (error) {
			if (!silent) {
				toast.add({
					title: 'Error',
					description: `Failed to copy ${modelName}`,
					icon: 'i-heroicons-exclamation-triangle',
					color: 'error',
				});
			}
			throw error;
		}
	};

	const deleteModel = async (modelName: string, silent = false) => {
		try {
			await ollamaStore.deleteModel(modelName);
			if (!silent) {
				toast.add({
					title: 'Model deleted',
					description: `Successfully deleted ${modelName}`,
					icon: 'i-heroicons-trash',
					color: 'primary',
				});
			}
		} catch (error) {
			if (!silent) {
				toast.add({
					title: 'Error',
					description: `Failed to delete ${modelName}`,
					icon: 'i-heroicons-exclamation-triangle',
					color: 'error',
				});
			}
			throw error;
		}
	};

	const renameModel = async (oldName: string, newName: string) => {
		try {
			await copyModel(oldName, newName, true);
			try {
				await deleteModel(oldName, true);
			} catch (deleteError) {
				await deleteModel(newName, true);
				throw deleteError;
			}
			
			toast.add({
				title: 'Model renamed',
				description: `Successfully renamed ${oldName} to ${newName}`,
				icon: 'i-heroicons-pencil-square',
				color: 'primary',
			});
		} catch (error) {
			toast.add({
				title: 'Error',
				description: `Failed to rename ${oldName}`,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
		}
	};

	return {
		modal,
		copyModel,
		deleteModel,
		renameModel
	};
} 