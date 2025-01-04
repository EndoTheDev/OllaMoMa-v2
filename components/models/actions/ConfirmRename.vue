<script setup lang="ts">
const ollama = useOllamaStore();
const props = defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm', newName: string): void;
	(e: 'cancel'): void;
}>();

const {
	isOpen,
	inputValue: newName,
	error,
	handleCancel,
	handleConfirm: handleRename,
} = useConfirmationModal({
	initialValue: props.modelName,
	validateInput: (value) => {
		if (!value) return 'Please enter a new name for the model';
		if (value === props.modelName) return 'New name must be different from the current name';
		if (ollama.getModelByName(value)) return 'A model with this name already exists';
	},
	onConfirm: (value) => emit('confirm', value!),
	onCancel: () => emit('cancel'),
});
</script>

<template>
	<UModal
		v-model:open="isOpen"
		:title="`Rename ${props.modelName || 'Model'}`"
		:ui="{ overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">
					Enter a new name for
					<span class="font-medium text-[var(--ui-text)]">{{ props.modelName }}</span
					>.
				</p>

				<div class="space-y-4">
					<UInput
						v-model="newName"
						placeholder="New model name"
						:class="{ 'border-[var(--ui-error)]': error }"
						autofocus
						@keyup.enter="handleRename" />
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
						@click="handleRename">
						<UIcon
							name="i-heroicons-pencil-square"
							class="w-5 h-5" />
						<span>RENAME</span>
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
