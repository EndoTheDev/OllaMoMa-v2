<script setup lang="ts">
defineProps<{ modelName?: string }>();
const emit = defineEmits<{
	(e: 'confirm' | 'cancel'): void;
}>();

const { isOpen, handleCancel, handleConfirm } = useConfirmationModal({
	onConfirm: () => emit('confirm'),
	onCancel: () => emit('cancel'),
});

// Only add the event listener when the modal is open
watch(isOpen, (newValue) => {
	if (newValue) {
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
		:title="`Delete ${modelName || 'Model'}?`"
		:description="' '"
		:ui="{ overlay: 'fixed inset-0 bg-[var(--ui-bg)]/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">Confirm if you want to permanently delete this model</p>

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
						color="error"
						variant="ghost"
						@click="handleConfirm">
						<UIcon
							name="i-heroicons-trash"
							class="w-5 h-5" />
						<span>DELETE</span>
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
