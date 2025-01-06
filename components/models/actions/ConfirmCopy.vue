<script setup lang="ts">
const ollama = useOllama();
const props = defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm', destination: string): void;
	(e: 'cancel'): void;
}>();

const {
	isOpen,
	inputValue: destination,
	error,
	handleCancel,
	handleConfirm: handleCopy,
} = useConfirmationModal({
	initialValue: props.modelName ? `${props.modelName}-copy` : '',
	validateInput: (value) => {
		if (!value) return 'Please enter a name for the new model';
		if (value === props.modelName) return 'New name must be different from the source model';
		if (ollama.getModelByName.value(value)) return 'A model with this name already exists';
	},
	onConfirm: (value) => emit('confirm', value!),
	onCancel: () => emit('cancel'),
});
</script>

<template>
	<UModal
		v-model:open="isOpen"
		:title="`Copy ${props.modelName || 'Model'}`"
		:description="' '"
		:ui="{ overlay: 'fixed inset-0 bg-[var(--ui-bg)]/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">
					This will create an exact copy of
					<span class="font-medium text-[var(--ui-text)]">{{ props.modelName }}</span> with all its parameters and
					settings.
				</p>

				<div class="space-y-4">
					<UInput
						v-model="destination"
						placeholder="New model name"
						:class="{ 'border-[var(--ui-error)]': error }"
						autofocus
						@keyup.enter="handleCopy" />
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
						color="primary"
						variant="ghost"
						@click="handleCopy">
						<UIcon
							name="i-heroicons-document-duplicate"
							class="w-5 h-5" />
						<span>COPY</span>
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
