<script setup lang="ts">
import { useOllama } from '~/composables/useOllama';
import { useChatStore } from '~/stores/chat';

const selectedModel = ref<string>('');
const message = ref<string>('');
const isLoading = ref(false);
const currentResponse = ref<string>('');

const chatStore = useChatStore();
const { streamChat } = useOllama();

// Computed properties for validation
const isModelSelected = computed(() => Boolean(selectedModel.value));
const isMessageValid = computed(() => Boolean(message.value.trim()));
const canSubmit = computed(() => isModelSelected.value && isMessageValid.value && !isLoading.value);

const handleModelSelect = (model: string) => {
	console.log('Selected model:', model);
	selectedModel.value = model;
};

const handleClear = () => {
	chatStore.clearMessages();
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
			model: selectedModel.value,
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
				<ChatModelDropdown
					v-model="selectedModel"
					@update:model-value="handleModelSelect" />
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
						v-model="message"
						variant="ghost"
						:placeholder="isModelSelected ? 'Ask a question...' : 'Please select a model first'"
						class="w-full"
						autofocus
						:disabled="isLoading || !isModelSelected"
						@keyup.enter="handleSubmit" />
					<UTooltip
						:text="!isModelSelected ? 'Please select a model first' : !isMessageValid ? 'Please enter a message' : ''"
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
