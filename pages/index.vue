<script setup lang="ts">
import { useOllama } from '~/composables/useOllama';
import { useChatStore } from '~/stores/chat';

const message = ref<string>('');
const isLoading = ref(false);
const currentResponse = ref<string>('');
const messageInput = ref();

const chatStore = useChatStore();
const { streamChat } = useOllama();

// Computed properties for validation
const isMessageValid = computed(() => Boolean(message.value.trim()));
const canSubmit = computed(() => chatStore.isModelSelected && isMessageValid.value && !isLoading.value);

// Add this computed property for two-way binding
const selectedModel = computed({
	get: () => chatStore.selectedModel,
	set: (value: string) => chatStore.setSelectedModel(value),
});

// Focus helper function
const focusInput = () => {
	// Try multiple focus strategies
	if (messageInput.value) {
		// Try the exposed focus method
		if (typeof messageInput.value.focus === 'function') {
			messageInput.value.focus();
		}
		// Try accessing the input element
		else if (messageInput.value.input) {
			messageInput.value.input.focus();
		}
		// Try finding the input element
		else {
			const inputEl = messageInput.value.$el?.querySelector('input');
			if (inputEl) inputEl.focus();
		}
	}
};

// Focus input on mount with multiple attempts
onMounted(() => {
	// Immediate attempt
	focusInput();

	// Attempt after a short delay
	setTimeout(focusInput, 100);

	// Attempt after nextTick
	nextTick(focusInput);

	// Final attempt after a longer delay
	setTimeout(focusInput, 500);
});

const handleClear = () => {
	chatStore.clearMessages();
	// Re-focus input after clearing
	nextTick(focusInput);
};

const handleSubmit = async () => {
	if (!canSubmit.value) return;

	const userMessage = {
		role: 'user' as const,
		content: message.value.trim(),
	};

	// Add user message to chat
	chatStore.addMessage(userMessage);

	// Clear input
	message.value = '';

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
			<ChatDisplay :messages="chatStore.messages" />
		</template>
		<template #footer>
			<div class="text-xl flex items-center p-2 h-full">
				<div class="flex w-full gap-1">
					<UInput
						ref="messageInput"
						v-model="message"
						size="lg"
						variant="ghost"
						:placeholder="chatStore.isModelSelected ? 'Ask a question...' : 'Please select a model first'"
						class="w-full"
						:disabled="isLoading || !chatStore.isModelSelected"
						autofocus
						@keyup.enter="handleSubmit" />
					<UTooltip
						:text="
							!chatStore.isModelSelected
								? 'Please select a model first'
								: !isMessageValid
									? 'Please enter a message'
									: ''
						"
						:disabled="canSubmit">
						<UButton
							variant="ghost"
							color="primary"
							size="lg"
							:loading="isLoading"
							:disabled="!canSubmit"
							@click="handleSubmit">
							{{ isLoading ? 'Thinking...' : 'Send' }}
						</UButton>
					</UTooltip>
				</div>
			</div>
		</template>
	</BaseLayout>
</template>
