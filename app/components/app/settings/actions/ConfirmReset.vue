<script setup lang="ts">
const emit = defineEmits<{
	(e: 'confirm' | 'cancel'): void;
}>();
</script>

<template>
	<BaseConfirmationModal
		title="Reset Settings?"
		description="This will reset all settings to their default values. This action cannot be undone."
		confirm-text="RESET"
		confirm-icon="i-heroicons-arrow-path"
		confirm-color="error"
		@confirm="emit('confirm')"
		@cancel="emit('cancel')" />
</template>
