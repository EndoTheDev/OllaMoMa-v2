import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useChatStore } from '~/stores/chat';

describe('useChatStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		localStorage.clear();
	});

	describe('initial state', () => {
		it('should have empty messages array', () => {
			const store = useChatStore();
			expect(store.messages).toEqual([]);
		});

		it('should have empty selectedModel', () => {
			const store = useChatStore();
			expect(store.selectedModel).toBe('');
		});

		it('should have hasMessages as false', () => {
			const store = useChatStore();
			expect(store.hasMessages).toBe(false);
		});

		it('should have isModelSelected as false', () => {
			const store = useChatStore();
			expect(store.isModelSelected).toBe(false);
		});
	});

	describe('actions', () => {
		describe('addMessage', () => {
			it('should add a user message with generated id', () => {
				const store = useChatStore();
				const message = { role: 'user' as const, content: 'Hello' };

				store.addMessage(message);

				expect(store.messages).toHaveLength(1);
				expect(store.messages[0]).toEqual({
					...message,
					id: expect.any(String),
				});
				expect(store.hasMessages).toBe(true);
			});

			it('should add an assistant message with generated id', () => {
				const store = useChatStore();
				const message = { role: 'assistant' as const, content: 'Hi there!' };

				store.addMessage(message);

				expect(store.messages).toHaveLength(1);
				expect(store.messages[0]).toEqual({
					...message,
					id: expect.any(String),
				});
				expect(store.hasMessages).toBe(true);
			});

			it('should add multiple messages with unique ids', () => {
				const store = useChatStore();
				const message1 = { role: 'user' as const, content: 'Hello' };
				const message2 = { role: 'assistant' as const, content: 'Hi!' };

				store.addMessage(message1);
				store.addMessage(message2);

				expect(store.messages).toHaveLength(2);
				expect(store.messages[0].id).not.toBe(store.messages[1].id);
				expect(store.messages).toEqual([
					{ ...message1, id: expect.any(String) },
					{ ...message2, id: expect.any(String) },
				]);
			});
		});

		describe('updateLastMessage', () => {
			it('should update the content of the last message', () => {
				const store = useChatStore();
				const message = { role: 'assistant' as const, content: 'Initial' };
				store.addMessage(message);

				store.updateLastMessage('Updated');

				expect(store.messages[0].content).toBe('Updated');
			});

			it('should not throw error when updating empty messages', () => {
				const store = useChatStore();

				expect(() => store.updateLastMessage('New content')).not.toThrow();
				expect(store.messages).toEqual([]);
			});
		});

		describe('clearMessages', () => {
			it('should remove all messages', () => {
				const store = useChatStore();
				store.addMessage({ role: 'user', content: 'Hello' });
				store.addMessage({ role: 'assistant', content: 'Hi!' });

				store.clearMessages();

				expect(store.messages).toEqual([]);
				expect(store.hasMessages).toBe(false);
			});
		});

		describe('setSelectedModel', () => {
			it('should set the selected model', () => {
				const store = useChatStore();

				store.setSelectedModel('llama2');

				expect(store.selectedModel).toBe('llama2');
				expect(store.isModelSelected).toBe(true);
			});

			it('should update the selected model', () => {
				const store = useChatStore();
				store.setSelectedModel('llama2');

				store.setSelectedModel('codellama');

				expect(store.selectedModel).toBe('codellama');
			});

			it('should handle empty model name', () => {
				const store = useChatStore();
				store.setSelectedModel('llama2');

				store.setSelectedModel('');

				expect(store.selectedModel).toBe('');
				expect(store.isModelSelected).toBe(false);
			});
		});
	});

	describe('persistence', () => {
		it('should persist state to localStorage', () => {
			const store = useChatStore();
			const message = { role: 'user' as const, content: 'Hello' };
			store.addMessage(message);
			store.setSelectedModel('llama2');

			// Create a new store instance to test persistence
			const newStore = useChatStore();
			expect(newStore.messages).toHaveLength(1);
			expect(newStore.messages[0]).toEqual({
				...message,
				id: expect.any(String),
			});
			expect(newStore.selectedModel).toBe('llama2');
		});
	});
});
