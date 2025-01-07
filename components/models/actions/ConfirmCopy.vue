<script setup lang="ts">
const ollama = useOllama();
const props = defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm', destination: string): void;
	(e: 'cancel'): void;
}>();

const validateInput = (value: string) => {
	if (!value) return 'Please enter a name for the new model';
	if (value === props.modelName) return 'New name must be different from the source model';
	if (ollama.getModelByName.value(value)) return 'A model with this name already exists';
};
</script>

<template>
	<BaseConfirmationModal
		:title="`Copy ${props.modelName || 'Model'}`"
		description="This will create an exact copy of"
		:model-name="modelName"
		show-input
		:initial-value="modelName ? `${modelName}-copy` : ''"
		input-placeholder="New model name"
		:validate-input="validateInput"
		confirm-text="COPY"
		confirm-icon="i-heroicons-document-duplicate"
		@confirm="emit('confirm', $event!)"
		@cancel="emit('cancel')" />
</template>
