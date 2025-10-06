<script setup lang="ts">
defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm' | 'cancel'): void;
}>();
</script>

<template>
	<BaseConfirmationModal
		:title="`Delete ${modelName || 'Model'}?`"
		description="Confirm if you want to permanently delete this model"
		:model-name="modelName"
		confirm-text="DELETE"
		confirm-icon="i-heroicons-trash"
		confirm-color="error"
		@confirm="emit('confirm')"
		@cancel="emit('cancel')" />
</template>
