<script setup lang="ts">
const modal = useModal();

defineProps<{
	modelName?: string;
}>();

const emit = defineEmits<{
	(e: 'confirm'): void;
	(e: 'cancel'): void;
}>();
</script>

<template>
	<UModal
		:title="`Delete ${modelName || 'Model'}?`"
		:ui="{ overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">Confirm if you want to permanently delete this model</p>

				<div class="flex justify-end gap-1">
					<UButton
						color="neutral"
						variant="ghost"
						@click="
							emit('cancel');
							modal.close();
						">
						<UIcon
							name="i-heroicons-x-mark"
							class="w-5 h-5" />
						<span>CANCEL</span>
					</UButton>
					<UButton
						color="error"
						variant="ghost"
						@click="
							emit('confirm');
							modal.close();
						">
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
