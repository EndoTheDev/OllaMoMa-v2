<script setup lang="ts">
import { useChatStore } from '~/stores/chat';

const props = defineProps<{
	isLoading: boolean;
}>();

const message = ref<string>('');
const messageInput = ref();
const chatStore = useChatStore();

// Computed properties for validation
const isMessageValid = computed(() => Boolean(message.value.trim()));
const canSubmit = computed(() => chatStore.isModelSelected && isMessageValid.value && !props.isLoading);

// Focus helper function
const focusInput = () => {
	if (messageInput.value) {
		if (typeof messageInput.value.focus === 'function') {
			messageInput.value.focus();
		} else if (messageInput.value.input) {
			messageInput.value.input.focus();
		} else {
			const inputEl = messageInput.value.$el?.querySelector('input');
			if (inputEl) inputEl.focus();
		}
	}
};

// Focus input on mount with multiple attempts
onMounted(() => {
	focusInput();
	setTimeout(focusInput, 100);
	nextTick(focusInput);
	setTimeout(focusInput, 500);
});

const emit = defineEmits<{
	submit: [message: string];
}>();

const handleSubmit = () => {
	if (!canSubmit.value) return;

	const userMessage = message.value.trim();
	emit('submit', userMessage);
	message.value = '';
};

// Expose focusInput method to parent components
defineExpose({
	focus: focusInput,
});
</script>

<template>
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
				!chatStore.isModelSelected ? 'Please select a model first' : !isMessageValid ? 'Please enter a message' : ''
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
</template>
