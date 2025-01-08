import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOllama } from '~/composables/useOllama';
import { createPinia, setActivePinia } from 'pinia';
import type { GenerateResponse } from 'ollama/browser';

// Mock the Ollama class
const mockGenerate = vi.fn();
const mockList = vi.fn();
const mockShow = vi.fn();
const mockCopy = vi.fn();
const mockDelete = vi.fn();

vi.mock('ollama/browser', () => ({
	Ollama: vi.fn().mockImplementation(() => ({
		generate: mockGenerate,
		list: mockList,
		show: mockShow,
		copy: mockCopy,
		delete: mockDelete,
	})),
}));

describe('useOllama', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe('generate', () => {
		it('should generate a response successfully', async () => {
			const ollama = useOllama();
			const mockResponse: Partial<GenerateResponse> = {
				model: 'llama2',
				created_at: new Date(),
				response: 'This is a test response',
				done: true,
				done_reason: 'stop',
				context: [],
				total_duration: 100,
				load_duration: 50,
				prompt_eval_duration: 25,
				eval_duration: 25,
				eval_count: 1,
			};

			mockGenerate.mockResolvedValueOnce(mockResponse);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
			};

			const response = await ollama.generate(request);

			expect(response).toEqual(mockResponse);
			expect(mockGenerate).toHaveBeenCalledWith(request);
			expect(mockGenerate).toHaveBeenCalledTimes(1);
		});

		it('should handle errors when generating', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to generate';

			mockGenerate.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
			};

			await expect(ollama.generate(request)).rejects.toThrow();
			expect(mockGenerate).toHaveBeenCalledWith(request);
			expect(mockGenerate).toHaveBeenCalledTimes(1);
		});

		it('should handle null response', async () => {
			const ollama = useOllama();

			mockGenerate.mockResolvedValueOnce(null);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
			};

			await expect(ollama.generate(request)).rejects.toThrow('Failed to generate response with model llama2');
			expect(mockGenerate).toHaveBeenCalledWith(request);
			expect(mockGenerate).toHaveBeenCalledTimes(1);
		});

		it('should update loading state correctly', async () => {
			const ollama = useOllama();
			const mockResponse: Partial<GenerateResponse> = {
				model: 'llama2',
				created_at: new Date(),
				response: 'This is a test response',
				done: true,
				done_reason: 'stop',
				context: [],
				total_duration: 100,
				load_duration: 50,
				prompt_eval_duration: 25,
				eval_duration: 25,
				eval_count: 1,
			};

			mockGenerate.mockResolvedValueOnce(mockResponse);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
			};

			expect(ollama.isLoading.value).toBe(false);

			const generatePromise = ollama.generate(request);
			expect(ollama.isLoading.value).toBe(true);

			await generatePromise;
			expect(ollama.isLoading.value).toBe(false);
		});

		it('should update error state on failure', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to generate';

			mockGenerate.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
			};

			expect(ollama.error.value).toBe(null);

			try {
				await ollama.generate(request);
			} catch {
				expect(ollama.error.value).toContain('Failed to generate response with model llama2');
			}
		});
	});
});
