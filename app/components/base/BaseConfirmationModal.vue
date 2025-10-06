<script setup lang="ts">
interface Props {
	title: string;
	description?: string;
	modelName?: string;
	showInput?: boolean;
	inputPlaceholder?: string;
	initialValue?: string;
	validateInput?: (value: string) => string | undefined;
	confirmText?: string;
	confirmIcon?: string;
	confirmColor?: 'primary' | 'error';
}

const props = withDefaults(defineProps<Props>(), {
	description: '',
	modelName: '',
	showInput: false,
	inputPlaceholder: '',
	initialValue: '',
	validateInput: () => undefined,
	confirmText: 'CONFIRM',
	confirmIcon: 'i-heroicons-check',
	confirmColor: 'primary',
});

const emit = defineEmits<{
	(e: 'confirm', value?: string): void;
	(e: 'cancel'): void;
}>();

const { isOpen, inputValue, error, handleCancel, handleConfirm } = useConfirmationModal({
	initialValue: props.initialValue,
	validateInput: props.validateInput,
	onConfirm: (value) => emit('confirm', value),
	onCancel: () => emit('cancel'),
});

// Only add the event listener when the modal is open and there's no input field
watch(isOpen, (newValue) => {
	if (newValue && !props.showInput) {
		document.addEventListener('keyup', onKeyUp);
	} else {
		document.removeEventListener('keyup', onKeyUp);
	}
});

const onKeyUp = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		handleConfirm();
	}
};

// Cleanup on component unmount
onUnmounted(() => {
	document.removeEventListener('keyup', onKeyUp);
});
</script>

<template>
	<UModal
		v-model:open="isOpen"
		:title="title"
		:description="' '"
		:ui="{ overlay: 'fixed inset-0 bg-[var(--ui-bg)]/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">
					{{ description }}
					<span
						v-if="modelName"
						class="font-medium text-[var(--ui-text)]"
						>{{ modelName }}</span
					>
				</p>

				<div
					v-if="showInput"
					class="space-y-4">
					<UInput
						v-model="inputValue"
						:placeholder="inputPlaceholder"
						:class="{ 'border-[var(--ui-error)]': error }"
						autofocus
						@keyup.enter="handleConfirm" />
					<p
						v-if="error"
						class="text-sm text-[var(--ui-error)]">
						{{ error }}
					</p>
				</div>

				<div class="flex justify-end gap-1">
					<UButton
						color="neutral"
						variant="ghost"
						@click="handleCancel">
						<UIcon
							name="i-heroicons-x-mark"
							class="w-5 h-5" />
						<span>CANCEL</span>
					</UButton>
					<UButton
						:color="confirmColor"
						variant="ghost"
						@click="handleConfirm">
						<UIcon
							:name="confirmIcon"
							class="w-5 h-5" />
						<span>{{ confirmText }}</span>
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
