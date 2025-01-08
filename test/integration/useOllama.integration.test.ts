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
});
