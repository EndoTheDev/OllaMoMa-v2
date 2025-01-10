import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useModelActions } from '~/composables/useModelActions';
import type { OllamaError } from '~/types/ollama';

// Mock the imports
const mockToastAdd = vi.fn();
vi.mock('#imports', () => ({
	useModal: () => ({
		open: vi.fn(),
		close: vi.fn(),
	}),
	useToast: () => ({
		add: mockToastAdd,
	}),
}));

// Create mock functions
const mockCopyModel = vi.fn();
const mockDeleteModel = vi.fn();

// Mock useOllama
vi.mock('~/composables/useOllama', () => ({
	useOllama: () => ({
		copyModel: mockCopyModel,
		deleteModel: mockDeleteModel,
	}),
}));

describe('useModelActions', () => {
	let modelActions: ReturnType<typeof useModelActions>;

	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Get fresh instances
		modelActions = useModelActions();
	});

	describe('copyModel', () => {
		it('should copy a model and show success toast', async () => {
			await modelActions.copyModel('source', 'destination');

			expect(mockCopyModel).toHaveBeenCalledWith('source', 'destination');
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Model copied',
				description: 'Successfully copied source to destination',
				icon: 'i-heroicons-check-circle',
				color: 'primary',
			});
		});

		it('should handle errors when copying a model', async () => {
			const error = new Error('Copy failed') as OllamaError;
			mockCopyModel.mockRejectedValueOnce(error);

			await expect(modelActions.copyModel('source', 'destination')).rejects.toThrow(error);
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Error',
				description: 'Copy failed',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
		});

		it('should not show toast when silent option is true', async () => {
			await modelActions.copyModel('source', 'destination', { silent: true });

			expect(mockCopyModel).toHaveBeenCalledWith('source', 'destination');
			expect(mockToastAdd).not.toHaveBeenCalled();
		});
	});

	describe('deleteModel', () => {
		it('should delete a model and show success toast', async () => {
			await modelActions.deleteModel('model1');

			expect(mockDeleteModel).toHaveBeenCalledWith('model1');
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Model deleted',
				description: 'Successfully deleted model1',
				icon: 'i-heroicons-check-circle',
				color: 'primary',
			});
		});

		it('should handle errors when deleting a model', async () => {
			const error = new Error('Delete failed') as OllamaError;
			mockDeleteModel.mockRejectedValueOnce(error);

			await expect(modelActions.deleteModel('model1')).rejects.toThrow(error);
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Error',
				description: 'Delete failed',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
		});

		it('should not show toast when silent option is true', async () => {
			await modelActions.deleteModel('model1', { silent: true });

			expect(mockDeleteModel).toHaveBeenCalledWith('model1');
			expect(mockToastAdd).not.toHaveBeenCalled();
		});
	});

	describe('renameModel', () => {
		it('should rename a model and show success toast', async () => {
			await modelActions.renameModel('oldName', 'newName');

			expect(mockCopyModel).toHaveBeenCalledWith('oldName', 'newName');
			expect(mockDeleteModel).toHaveBeenCalledWith('oldName');
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Model renamed',
				description: 'Successfully renamed oldName to newName',
				icon: 'i-heroicons-check-circle',
				color: 'primary',
			});
		});

		it('should handle errors when copying fails during rename', async () => {
			const error = new Error('Copy failed') as OllamaError;
			mockCopyModel.mockRejectedValueOnce(error);

			await expect(modelActions.renameModel('oldName', 'newName')).rejects.toThrow(error);
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Error',
				description: 'Copy failed',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
			expect(mockDeleteModel).not.toHaveBeenCalled();
		});

		it('should handle errors when deleting old model fails during rename', async () => {
			const error = new Error('Delete failed') as OllamaError;
			mockDeleteModel.mockRejectedValueOnce(error);

			await expect(modelActions.renameModel('oldName', 'newName')).rejects.toThrow(error);
			expect(mockCopyModel).toHaveBeenCalledWith('oldName', 'newName');
			expect(mockDeleteModel).toHaveBeenCalledWith('oldName');
			expect(mockDeleteModel).toHaveBeenCalledWith('newName');
			expect(mockToastAdd).toHaveBeenCalledWith({
				title: 'Error',
				description: 'Delete failed',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
		});

		it('should not show toast when silent option is true', async () => {
			await modelActions.renameModel('oldName', 'newName', { silent: true });

			expect(mockCopyModel).toHaveBeenCalledWith('oldName', 'newName');
			expect(mockDeleteModel).toHaveBeenCalledWith('oldName');
			expect(mockToastAdd).not.toHaveBeenCalled();
		});
	});
});
