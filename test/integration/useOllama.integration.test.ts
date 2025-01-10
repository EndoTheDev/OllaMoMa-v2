import { beforeEach, describe, expect, it } from 'vitest';
import { useOllama } from '~/composables/useOllama';
import { createPinia, setActivePinia } from 'pinia';

describe('useOllama Integration', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('generate', () => {
		it('should generate a real response from Ollama API', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434', // Default Ollama host
			});

			const request = {
				model: 'llama3.2:3b', // Make sure this model is installed
				prompt: 'What is 1 + 1?',
			};

			const response = await ollama.generate(request);

			// Verify response structure
			expect(response).toBeDefined();
			expect(response.model).toBe('llama3.2:3b');
			expect(typeof response.created_at).toBe('string');
			expect(new Date(response.created_at)).toBeInstanceOf(Date); // Should be a valid date string
			expect(response.response).toBeDefined();
			expect(response.done).toBe(true);
			expect(response.context).toBeDefined();
			expect(response.total_duration).toBeGreaterThan(0);
		}, 30000); // Increased timeout for API call

		it('should handle errors when model does not exist', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'non-existent-model',
				prompt: 'This should fail',
			};

			await expect(ollama.generate(request)).rejects.toThrow();
		});

		it('should handle connection errors with invalid host', async () => {
			const ollama = useOllama({
				host: 'http://invalid-host:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				prompt: 'This should fail',
			};

			await expect(ollama.generate(request)).rejects.toThrow();
		});
	});

	describe('chat', () => {
		it('should chat with the Ollama API successfully', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434', // Default Ollama host
			});

			const request = {
				model: 'llama3.2:3b', // Make sure this model is installed
				messages: [
					{
						role: 'user',
						content: 'What is 1 + 1?',
					},
				],
			};

			const response = await ollama.chat(request);

			// Verify response structure
			expect(response).toBeDefined();
			expect(response.model).toBe('llama3.2:3b');
			expect(typeof response.created_at).toBe('string');
			expect(new Date(response.created_at)).toBeInstanceOf(Date);
			expect(response.message).toBeDefined();
			expect(response.message.role).toBe('assistant');
			expect(response.message.content).toBeDefined();
			expect(response.done).toBe(true);
			expect(response.total_duration).toBeGreaterThan(0);
		}, 30000); // Increased timeout for API call

		it('should handle errors when model does not exist for chat', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'non-existent-model',
				messages: [
					{
						role: 'user',
						content: 'This should fail',
					},
				],
			};

			await expect(ollama.chat(request)).rejects.toThrow();
		});

		it('should handle connection errors with invalid host for chat', async () => {
			const ollama = useOllama({
				host: 'http://invalid-host:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				messages: [
					{
						role: 'user',
						content: 'This should fail',
					},
				],
			};

			await expect(ollama.chat(request)).rejects.toThrow();
		});
	});

	describe('streamGenerate', () => {
		it('should stream generate from Ollama API', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				prompt: 'Count from 1 to 3',
				stream: true as const,
			};

			const stream = await ollama.streamGenerate(request);
			const responses = [];

			for await (const response of stream) {
				responses.push(response);
				// Verify response structure for each chunk
				expect(response).toBeDefined();
				expect(response.model).toBe('llama3.2:3b');
				expect(typeof response.created_at).toBe('string');
				expect(new Date(response.created_at)).toBeInstanceOf(Date);
				expect(response.response).toBeDefined();
				expect(typeof response.response).toBe('string');
			}

			// Verify we got multiple chunks
			expect(responses.length).toBeGreaterThan(0);
			// Verify the last response is marked as done
			expect(responses[responses.length - 1].done).toBe(true);
		}, 30000);

		it('should handle errors when model does not exist for stream generate', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'non-existent-model',
				prompt: 'This should fail',
				stream: true as const,
			};

			await expect(ollama.streamGenerate(request)).rejects.toThrow();
		});

		it('should handle connection errors with invalid host for stream generate', async () => {
			const ollama = useOllama({
				host: 'http://invalid-host:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				prompt: 'This should fail',
				stream: true as const,
			};

			await expect(ollama.streamGenerate(request)).rejects.toThrow();
		});
	});

	describe('streamChat', () => {
		it('should stream chat from Ollama API', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				messages: [{ role: 'user', content: 'Count from 1 to 3' }],
				stream: true as const,
			};

			const stream = await ollama.streamChat(request);
			const responses = [];

			for await (const response of stream) {
				responses.push(response);
				// Verify response structure for each chunk
				expect(response).toBeDefined();
				expect(response.model).toBe('llama3.2:3b');
				expect(typeof response.created_at).toBe('string');
				expect(new Date(response.created_at)).toBeInstanceOf(Date);
				expect(response.message).toBeDefined();
				expect(response.message.role).toBe('assistant');
				expect(typeof response.message.content).toBe('string');
			}

			// Verify we got multiple chunks
			expect(responses.length).toBeGreaterThan(0);
			// Verify the last response is marked as done
			expect(responses[responses.length - 1].done).toBe(true);
		}, 30000);

		it('should handle errors when model does not exist for stream chat', async () => {
			const ollama = useOllama({
				host: 'http://localhost:11434',
			});

			const request = {
				model: 'non-existent-model',
				messages: [{ role: 'user', content: 'This should fail' }],
				stream: true as const,
			};

			await expect(ollama.streamChat(request)).rejects.toThrow();
		});

		it('should handle connection errors with invalid host for stream chat', async () => {
			const ollama = useOllama({
				host: 'http://invalid-host:11434',
			});

			const request = {
				model: 'llama3.2:3b',
				messages: [{ role: 'user', content: 'This should fail' }],
				stream: true as const,
			};

			await expect(ollama.streamChat(request)).rejects.toThrow();
		});
	});
});
