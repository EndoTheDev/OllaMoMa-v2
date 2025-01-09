<script setup lang="ts">
import { useOllama } from '~/composables/useOllama';
import { useChatStore } from '~/stores/chat';

const isLoading = ref(false);
const currentResponse = ref<string>('');
const chatInput = ref();

const chatStore = useChatStore();
const { streamChat } = useOllama();

// Computed property for two-way binding
const selectedModel = computed({
	get: () => chatStore.selectedModel,
	set: (value: string) => chatStore.setSelectedModel(value),
});

const handleClear = () => {
	chatStore.clearMessages();
	nextTick(() => chatInput.value?.focus());
};

const handleSubmit = async (userInput: string) => {
	const userMessage = {
		role: 'user' as const,
		content: userInput,
	};

	// Add user message to chat
	chatStore.addMessage(userMessage);

	// Set loading state
	isLoading.value = true;
	currentResponse.value = '';

	try {
		// Prepare chat request
		const request = {
			model: chatStore.selectedModel,
			messages: chatStore.messages,
			stream: true as const,
		};

		// Get streaming response from API
		const stream = await streamChat(request);

		// Create placeholder for assistant's response
		chatStore.addMessage({
			role: 'assistant',
			content: '',
		});

		// Process the stream
		for await (const part of stream) {
			if (part.message?.content) {
				// Update the current response
				currentResponse.value += part.message.content;
				// Update the last message in the chat
				chatStore.updateLastMessage(currentResponse.value);
			}
		}
	} catch (err) {
		console.error('Chat error:', err);
		// Show error message
		chatStore.addMessage({
			role: 'assistant',
			content: 'Sorry, I encountered an error while processing your request.',
		});
	} finally {
		isLoading.value = false;
		currentResponse.value = '';
		nextTick(() => chatInput.value?.focus());
	}
};
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center p-2 h-full">
				<ChatModelDropdown v-model="selectedModel" />
				<UButton
					variant="ghost"
					color="primary"
					size="lg"
					:disabled="!chatStore.hasMessages"
					@click="handleClear">
					Clear
				</UButton>
			</div>
		</template>
		<template #default>
			<UiScrollArea class="h-[calc(100vh-100px)] pt-1 pl-1 pr-3">
				<ChatDisplay :messages="chatStore.messages" />
			</UiScrollArea>
		</template>
		<template #footer>
			<ChatInput
				ref="chatInput"
				:is-loading="isLoading"
				@submit="handleSubmit" />
		</template>
	</BaseLayout>
</template>
