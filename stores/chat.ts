import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

interface ChatState {
	messages: ChatMessage[];
}

export const useChatStore = defineStore('chat', () => {
	// State
	const state = useLocalStorage<ChatState>('app:chat', {
		messages: [],
	});

	// Getters
	const messages = computed(() => state.value.messages);
	const hasMessages = computed(() => state.value.messages.length > 0);

	// Actions
	function addMessage(message: ChatMessage) {
		state.value.messages.push(message);
	}

	function updateLastMessage(content: string) {
		if (state.value.messages.length > 0) {
			state.value.messages[state.value.messages.length - 1].content = content;
		}
	}

	function clearMessages() {
		state.value.messages = [];
	}

	return {
		// State exports
		messages,
		hasMessages,

		// Action exports
		addMessage,
		updateLastMessage,
		clearMessages,
	};
});
