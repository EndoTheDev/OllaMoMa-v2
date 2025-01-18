<script setup lang="ts">
import { useOllama } from '~/composables/useOllama';
import { useChatStore } from '~/stores/chat';

const isLoading = ref(false);
const currentResponse = ref('');
const chatInput = ref();

const chatStore = useChatStore();
const { streamChat } = useOllama();

// Computed property for two-way binding
const selectedModel = computed({
	get: () => chatStore.selectedModel,
	set: (value: string) => chatStore.setSelectedModel(value),
});

// Focus management
const focusInput = () => nextTick(() => chatInput.value?.focus());

const handleClear = () => {
	chatStore.clearMessages();
	focusInput();
};

const handleSubmit = async (userInput: string) => {
	if (!userInput.trim() || isLoading.value) return;

	try {
		isLoading.value = true;
		currentResponse.value = '';

		// Add user message
		chatStore.addMessage({ role: 'user' as const, content: userInput });

		// Create placeholder for assistant's response
		chatStore.addMessage({ role: 'assistant' as const, content: '' });

		// Get streaming response
		const stream = await streamChat({
			model: chatStore.selectedModel,
			messages: chatStore.messages,
			stream: true,
		});

		// Process the stream
		for await (const part of stream) {
			if (part.message?.content) {
				currentResponse.value += part.message.content;
				chatStore.updateLastMessage(currentResponse.value);
			}
		}
	} catch (error) {
		console.error('Chat error:', error);
		chatStore.updateLastMessage('Sorry, I encountered an error while processing your request.');
	} finally {
		isLoading.value = false;
		currentResponse.value = '';
		focusInput();
	}
};
</script>

<template>
	<BaseLayout auto-scroll>
		<template #header>
			<div class="flex items-center gap-1 justify-between py-1.5 p-2 h-full">
				<AppChatModelDropdown v-model="selectedModel" />
				<UButton
					variant="ghost"
					color="primary"
					size="lg"
					:disabled="!chatStore.hasMessages"
					@click="handleClear">
					<UIcon
						name="i-heroicons-trash"
						class="h-5 w-5 text-[var(--ui-pimary)]" />
				</UButton>
			</div>
		</template>

		<template #default>
			<AppChatDisplay :messages="chatStore.messages" />
		</template>

		<template #footer>
			<AppChatInput
				ref="chatInput"
				:is-loading="isLoading"
				@submit="handleSubmit" />
		</template>
	</BaseLayout>
</template>
