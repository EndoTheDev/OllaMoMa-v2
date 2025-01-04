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
		description="Confirm if you want to permanently delete this model">
		<template #footer>
			<div class="w-full flex justify-end gap-1">
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
		</template>
	</UModal>
</template>
