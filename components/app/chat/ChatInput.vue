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
		messageInput.value?.textarea?.focus();
	}
};

// Focus input on mount and after loading
onMounted(() => {
	focusInput();
	// Multiple focus attempts to ensure it works across different scenarios
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

	// Refocus after submission
	nextTick(focusInput);
};

// Expose focusInput method to parent components
defineExpose({
	focus: focusInput,
});
</script>

<template>
	<div class="flex w-full gap-1 px-2 bg-[var(--ui-bg)]">
		<div class="flex-1">
			<UTextarea
				ref="messageInput"
				v-model="message"
				size="lg"
				variant="ghost"
				:placeholder="chatStore.isModelSelected ? 'Ask a question...' : 'Please select a model first'"
				class="w-full min-h-12 py-1.5 [&_textarea]:resize-none"
				:disabled="isLoading || !chatStore.isModelSelected"
				:rows="1"
				:maxrows="12"
				autofocus
				autoresize
				@keydown.enter.exact.prevent="handleSubmit" />
		</div>
		<div class="flex items-end py-1.5">
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
	</div>
</template>
