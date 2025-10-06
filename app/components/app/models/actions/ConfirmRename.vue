<script setup lang="ts">
const ollama = useOllama();
const props = defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm', newName: string): void;
	(e: 'cancel'): void;
}>();

const validateInput = (value: string) => {
	if (!value) return 'Please enter a new name for the model';
	if (value === props.modelName) return 'New name must be different from the current name';
	if (ollama.getModelByName.value(value)) return 'A model with this name already exists';
};
</script>

<template>
	<BaseConfirmationModal
		:title="`Rename ${props.modelName || 'Model'}`"
		description="Enter a new name for"
		:model-name="modelName"
		show-input
		:initial-value="modelName"
		input-placeholder="New model name"
		:validate-input="validateInput"
		confirm-text="RENAME"
		confirm-icon="i-heroicons-pencil-square"
		@confirm="emit('confirm', $event!)"
		@cancel="emit('cancel')" />
</template>
