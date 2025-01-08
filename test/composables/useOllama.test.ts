import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useOllama } from '~/composables/useOllama';
import { createPinia, setActivePinia } from 'pinia';
import type { GenerateResponse, ChatResponse } from 'ollama/browser';

// Mock the Ollama class
const mockGenerate = vi.fn();
const mockChat = vi.fn();
const mockList = vi.fn();
const mockShow = vi.fn();
const mockCopy = vi.fn();
const mockDelete = vi.fn();

vi.mock('ollama/browser', () => ({
	Ollama: vi.fn().mockImplementation(() => ({
		generate: mockGenerate,
		chat: mockChat,
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

	describe('chat', () => {
		it('should chat successfully', async () => {
			const ollama = useOllama();
			const mockResponse: Partial<ChatResponse> = {
				model: 'llama2',
				created_at: new Date(),
				message: {
					role: 'assistant',
					content: 'This is a test response',
				},
				done: true,
				total_duration: 100,
				load_duration: 50,
				prompt_eval_duration: 25,
				eval_duration: 25,
				eval_count: 1,
			};

			mockChat.mockResolvedValueOnce(mockResponse);

			const request = {
				model: 'llama2',
				messages: [
					{
						role: 'user',
						content: 'Test message',
					},
				],
			};

			const response = await ollama.chat(request);

			expect(response).toEqual(mockResponse);
			expect(mockChat).toHaveBeenCalledWith(request);
			expect(mockChat).toHaveBeenCalledTimes(1);
		});

		it('should handle errors when chatting', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to chat';

			mockChat.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				messages: [
					{
						role: 'user',
						content: 'Test message',
					},
				],
			};

			await expect(ollama.chat(request)).rejects.toThrow();
			expect(mockChat).toHaveBeenCalledWith(request);
			expect(mockChat).toHaveBeenCalledTimes(1);
		});

		it('should handle null response', async () => {
			const ollama = useOllama();

			mockChat.mockResolvedValueOnce(null);

			const request = {
				model: 'llama2',
				messages: [
					{
						role: 'user',
						content: 'Test message',
					},
				],
			};

			await expect(ollama.chat(request)).rejects.toThrow('Failed to chat with model llama2');
			expect(mockChat).toHaveBeenCalledWith(request);
			expect(mockChat).toHaveBeenCalledTimes(1);
		});

		it('should update loading state correctly', async () => {
			const ollama = useOllama();
			const mockResponse: Partial<ChatResponse> = {
				model: 'llama2',
				created_at: new Date(),
				message: {
					role: 'assistant',
					content: 'This is a test response',
				},
				done: true,
				total_duration: 100,
				load_duration: 50,
				prompt_eval_duration: 25,
				eval_duration: 25,
				eval_count: 1,
			};

			mockChat.mockResolvedValueOnce(mockResponse);

			const request = {
				model: 'llama2',
				messages: [
					{
						role: 'user',
						content: 'Test message',
					},
				],
			};

			expect(ollama.isLoading.value).toBe(false);

			const chatPromise = ollama.chat(request);
			expect(ollama.isLoading.value).toBe(true);

			await chatPromise;
			expect(ollama.isLoading.value).toBe(false);
		});

		it('should update error state on failure', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to chat';

			mockChat.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				messages: [
					{
						role: 'user',
						content: 'Test message',
					},
				],
			};

			expect(ollama.error.value).toBe(null);

			try {
				await ollama.chat(request);
			} catch {
				expect(ollama.error.value).toContain('Failed to chat with model llama2');
			}
		});
	});
});
