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

	describe('streamGenerate', () => {
		it('should stream generate responses successfully', async () => {
			const ollama = useOllama();
			const mockResponses = [
				{ response: 'First', done: false },
				{ response: 'Second', done: false },
				{ response: 'Third', done: true },
			];

			// Mock the async iterator
			const mockStream = {
				async *[Symbol.asyncIterator]() {
					for (const response of mockResponses) {
						yield response;
					}
				},
			};

			mockGenerate.mockResolvedValueOnce(mockStream);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
				stream: true as const,
			};

			const stream = await ollama.streamGenerate(request);
			const responses = [];

			for await (const response of stream) {
				responses.push(response);
			}

			expect(responses).toEqual(mockResponses);
			expect(mockGenerate).toHaveBeenCalledWith(request);
			expect(mockGenerate).toHaveBeenCalledTimes(1);
		});

		it('should handle errors when streaming generate', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to stream';

			mockGenerate.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
				stream: true as const,
			};

			await expect(ollama.streamGenerate(request)).rejects.toThrow();
			expect(mockGenerate).toHaveBeenCalledWith(request);
			expect(mockGenerate).toHaveBeenCalledTimes(1);
		});

		it('should handle null response for stream', async () => {
			const ollama = useOllama();
			mockGenerate.mockResolvedValueOnce(null);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
				stream: true as const,
			};

			await expect(ollama.streamGenerate(request)).rejects.toThrow(
				'Failed to generate streaming response with model llama2'
			);
			expect(mockGenerate).toHaveBeenCalledWith(request);
		});

		it('should handle API errors for stream', async () => {
			const ollama = useOllama();
			mockGenerate.mockRejectedValueOnce(new Error('Stream error'));

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
				stream: true as const,
			};

			await expect(ollama.streamGenerate(request)).rejects.toThrow(
				'Failed to generate streaming response with model llama2'
			);
			expect(mockGenerate).toHaveBeenCalledWith(request);
		});

		it('should update loading state correctly for stream', async () => {
			const ollama = useOllama();
			const mockStream = (async function* () {
				yield { response: 'chunk1' };
				yield { response: 'chunk2' };
			})();
			mockGenerate.mockResolvedValueOnce(mockStream);

			const request = {
				model: 'llama2',
				prompt: 'Test prompt',
				stream: true as const,
			};

			expect(ollama.isLoading.value).toBe(false);
			const streamPromise = ollama.streamGenerate(request);
			expect(ollama.isLoading.value).toBe(true);
			await streamPromise;
			expect(ollama.isLoading.value).toBe(false);
		});
	});

	describe('streamChat', () => {
		it('should stream chat responses successfully', async () => {
			const ollama = useOllama();
			const mockResponses = [
				{ message: { role: 'assistant', content: 'First' }, done: false },
				{ message: { role: 'assistant', content: 'Second' }, done: false },
				{ message: { role: 'assistant', content: 'Third' }, done: true },
			];

			// Mock the async iterator
			const mockStream = {
				async *[Symbol.asyncIterator]() {
					for (const response of mockResponses) {
						yield response;
					}
				},
			};

			mockChat.mockResolvedValueOnce(mockStream);

			const request = {
				model: 'llama2',
				messages: [{ role: 'user', content: 'Test message' }],
				stream: true as const,
			};

			const stream = await ollama.streamChat(request);
			const responses = [];

			for await (const response of stream) {
				responses.push(response);
			}

			expect(responses).toEqual(mockResponses);
			expect(mockChat).toHaveBeenCalledWith(request);
			expect(mockChat).toHaveBeenCalledTimes(1);
		});

		it('should handle errors when streaming chat', async () => {
			const ollama = useOllama();
			const errorMessage = 'Failed to stream';

			mockChat.mockRejectedValueOnce(new Error(errorMessage));

			const request = {
				model: 'llama2',
				messages: [{ role: 'user', content: 'Test message' }],
				stream: true as const,
			};

			await expect(ollama.streamChat(request)).rejects.toThrow();
			expect(mockChat).toHaveBeenCalledWith(request);
			expect(mockChat).toHaveBeenCalledTimes(1);
		});

		it('should handle null response for stream', async () => {
			const ollama = useOllama();
			mockChat.mockResolvedValueOnce(null);

			const request = {
				model: 'llama2',
				messages: [{ role: 'user', content: 'Test message' }],
				stream: true as const,
			};

			await expect(ollama.streamChat(request)).rejects.toThrow('Failed to chat stream with model llama2');
			expect(mockChat).toHaveBeenCalledWith(request);
		});

		it('should handle API errors for stream', async () => {
			const ollama = useOllama();
			mockChat.mockRejectedValueOnce(new Error('Stream error'));

			const request = {
				model: 'llama2',
				messages: [{ role: 'user', content: 'Test message' }],
				stream: true as const,
			};

			await expect(ollama.streamChat(request)).rejects.toThrow('Failed to chat stream with model llama2');
			expect(mockChat).toHaveBeenCalledWith(request);
		});

		it('should update loading state correctly for stream', async () => {
			const ollama = useOllama();
			const mockStream = (async function* () {
				yield { message: { role: 'assistant', content: 'chunk1' } };
				yield { message: { role: 'assistant', content: 'chunk2' } };
			})();
			mockChat.mockResolvedValueOnce(mockStream);

			const request = {
				model: 'llama2',
				messages: [{ role: 'user', content: 'Test message' }],
				stream: true as const,
			};

			expect(ollama.isLoading.value).toBe(false);
			const streamPromise = ollama.streamChat(request);
			expect(ollama.isLoading.value).toBe(true);
			await streamPromise;
			expect(ollama.isLoading.value).toBe(false);
		});
	});

	describe('fetchModels', () => {
		it('should fetch models successfully', async () => {
			const ollama = useOllama();
			const mockModels = [
				{ name: 'model1', modified_at: new Date() },
				{ name: 'model2', modified_at: new Date() },
			];

			mockList.mockResolvedValueOnce({ models: mockModels });

			await ollama.fetchModels();

			expect(mockList).toHaveBeenCalledTimes(1);
			expect(ollama.models.value.length).toBe(2);
			expect(ollama.models.value[0].name).toBe('model1');
			expect(ollama.models.value[1].name).toBe('model2');
		});

		it('should handle null response', async () => {
			const ollama = useOllama();
			mockList.mockResolvedValueOnce(null);

			await expect(ollama.fetchModels()).rejects.toThrow('Failed to fetch models');
			expect(mockList).toHaveBeenCalledTimes(1);
		});

		it('should handle API errors', async () => {
			const ollama = useOllama();
			mockList.mockRejectedValueOnce(new Error('API Error'));

			await expect(ollama.fetchModels()).rejects.toThrow('Failed to fetch models');
			expect(mockList).toHaveBeenCalledTimes(1);
		});

		it('should update loading state correctly', async () => {
			const ollama = useOllama();
			const mockModels = [{ name: 'model1', modified_at: new Date() }];
			mockList.mockResolvedValueOnce({ models: mockModels });

			expect(ollama.isLoading.value).toBe(false);
			const fetchPromise = ollama.fetchModels();
			expect(ollama.isLoading.value).toBe(true);
			await fetchPromise;
			expect(ollama.isLoading.value).toBe(false);
		});
	});

	describe('showModel', () => {
		it('should show model details successfully', async () => {
			const ollama = useOllama();
			const mockDetails = {
				license: 'MIT',
				modelfile: 'FROM llama2',
				parameters: { temp: 0.7 },
				template: 'template',
				system: 'system prompt',
				details: {
					parent_model: 'llama2',
					format: 'gguf',
					family: 'llama',
					families: ['llama'],
					parameter_size: '3B',
					quantization_level: 'Q4_K_M',
				},
			};

			mockShow.mockResolvedValueOnce(mockDetails);

			const details = await ollama.showModel('model1');

			expect(mockShow).toHaveBeenCalledWith({ model: 'model1' });
			expect(details.license).toBe('MIT');
			expect(details.modelfile).toBe('FROM llama2');
			expect(details.parameter_size).toBe('3B');
		});

		it('should handle null response', async () => {
			const ollama = useOllama();
			mockShow.mockResolvedValueOnce(null);

			await expect(ollama.showModel('model1')).rejects.toThrow('Failed to fetch details for model model1');
			expect(mockShow).toHaveBeenCalledWith({ model: 'model1' });
		});

		it('should handle API errors', async () => {
			const ollama = useOllama();
			mockShow.mockRejectedValueOnce(new Error('API Error'));

			await expect(ollama.showModel('model1')).rejects.toThrow('Failed to fetch details for model model1');
			expect(mockShow).toHaveBeenCalledWith({ model: 'model1' });
		});
	});

	describe('copyModel', () => {
		it('should copy model successfully', async () => {
			const ollama = useOllama();
			mockCopy.mockResolvedValueOnce({});
			mockList.mockResolvedValueOnce({ models: [] });

			await ollama.copyModel('source', 'destination');

			expect(mockCopy).toHaveBeenCalledWith({ source: 'source', destination: 'destination' });
			expect(mockList).toHaveBeenCalledTimes(1);
		});

		it('should handle API errors', async () => {
			const ollama = useOllama();
			mockCopy.mockRejectedValueOnce(new Error('API Error'));

			await expect(ollama.copyModel('source', 'destination')).rejects.toThrow(
				'Failed to copy model from source to destination'
			);
			expect(mockCopy).toHaveBeenCalledWith({ source: 'source', destination: 'destination' });
		});
	});

	describe('deleteModel', () => {
		it('should delete model successfully', async () => {
			const ollama = useOllama();
			mockDelete.mockResolvedValueOnce({});
			mockList.mockResolvedValueOnce({ models: [] });

			await ollama.deleteModel('model1');

			expect(mockDelete).toHaveBeenCalledWith({ model: 'model1' });
			expect(mockList).toHaveBeenCalledTimes(1);
		});

		it('should handle API errors', async () => {
			const ollama = useOllama();
			mockDelete.mockRejectedValueOnce(new Error('API Error'));

			await expect(ollama.deleteModel('model1')).rejects.toThrow('Failed to delete model model1');
			expect(mockDelete).toHaveBeenCalledWith({ model: 'model1' });
		});
	});

	describe('computed properties', () => {
		it('should compute hasModels correctly', async () => {
			const ollama = useOllama();
			expect(ollama.hasModels.value).toBe(false);

			mockList.mockResolvedValueOnce({ models: [{ name: 'model1', modified_at: new Date() }] });
			await ollama.fetchModels();
			expect(ollama.hasModels.value).toBe(true);
		});

		it('should find model by name', async () => {
			const ollama = useOllama();
			const mockModels = [
				{ name: 'model1', modified_at: new Date() },
				{ name: 'model2', modified_at: new Date() },
			];

			mockList.mockResolvedValueOnce({ models: mockModels });
			await ollama.fetchModels();

			const model1 = ollama.getModelByName.value('model1');
			const model2 = ollama.getModelByName.value('model2');
			const nonExistent = ollama.getModelByName.value('non-existent');

			expect(model1?.name).toBe('model1');
			expect(model2?.name).toBe('model2');
			expect(nonExistent).toBeUndefined();
		});
	});
});
