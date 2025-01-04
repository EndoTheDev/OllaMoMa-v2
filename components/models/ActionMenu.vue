<script setup lang="ts">
import { LazyModelsActionsConfirmDelete } from '#components';

const emit = defineEmits<{
	(e: 'update:activePanel', value: 'info' | 'modelfile'): void;
}>();

const props = defineProps<{
	activePanel: 'info' | 'modelfile';
	modelName: string;
}>();

const modal = useModal();
const toast = useToast();
const ollamaStore = useOllamaStore();

const togglePanel = (panel: 'info' | 'modelfile') => {
	emit('update:activePanel', panel);
};

const openDeleteModal = () => {
	modal.open(LazyModelsActionsConfirmDelete, {
		modelName: props.modelName,
		onConfirm: async () => {
			try {
				await ollamaStore.deleteModel(props.modelName);
				toast.add({
					title: 'Model deleted',
					description: `Successfully deleted ${props.modelName}`,
					icon: 'i-heroicons-trash',
					color: 'success',
				});
			} catch (error) {
				toast.add({
					title: 'Error',
					description: `Failed to delete ${props.modelName}`,
					icon: 'i-heroicons-exclamation-triangle',
					color: 'error',
				});
			}
		},
		onCancel: () => {
			modal.close();
		},
	});
};
</script>

<template>
	<div class="flex justify-between">
		<div class="flex gap-1">
			<UButton
				variant="link"
				:color="activePanel === 'info' ? 'primary' : 'neutral'"
				@click="togglePanel('info')">
				<UIcon
					name="i-heroicons-information-circle"
					class="w-5 h-5" />
				<span class="hidden md:inline">INFO</span>
			</UButton>
			<UButton
				variant="link"
				:color="activePanel === 'modelfile' ? 'primary' : 'neutral'"
				@click="togglePanel('modelfile')">
				<UIcon
					name="i-heroicons-document"
					class="w-5 h-5" />
				<span class="hidden md:inline">MODELFILE</span>
			</UButton>
		</div>
		<div class="flex gap-1">
			<!-- RENAME MODAL -->
			<UButton variant="ghost">
				<UIcon
					name="i-heroicons-pencil-square"
					class="w-5 h-5" />
				<span class="hidden md:inline">RENAME</span>
			</UButton>
			<!-- COPY MODAL -->
			<UButton variant="ghost">
				<UIcon
					name="i-heroicons-document-duplicate"
					class="w-5 h-5" />
				<span class="hidden md:inline">COPY</span>
			</UButton>
			<!-- DELETE MODAL -->
			<UButton
				variant="ghost"
				@click="openDeleteModal">
				<UIcon
					name="i-heroicons-trash"
					class="w-5 h-5" />
				<span class="hidden md:inline">DELETE</span>
			</UButton>
		</div>
	</div>
</template>
