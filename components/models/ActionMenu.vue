<script setup lang="ts">
import {
	LazyModelsActionsConfirmDelete,
	LazyModelsActionsConfirmCopy,
	LazyModelsActionsConfirmRename,
} from '#components';

const emit = defineEmits<{
	(e: 'update:activePanel', value: 'info' | 'modelfile'): void;
}>();

const props = defineProps<{
	activePanel: 'info' | 'modelfile';
	modelName: string;
}>();

const { modal, copyModel, deleteModel, renameModel } = useModelActions();

const togglePanel = (panel: 'info' | 'modelfile') => {
	emit('update:activePanel', panel);
};

const openCopyModal = () => {
	modal.open(LazyModelsActionsConfirmCopy, {
		modelName: props.modelName,
		onConfirm: (newName: string) => copyModel(props.modelName, newName),
		onCancel: () => modal.close(),
	});
};

const openRenameModal = () => {
	modal.open(LazyModelsActionsConfirmRename, {
		modelName: props.modelName,
		onConfirm: (newName: string) => renameModel(props.modelName, newName),
		onCancel: () => modal.close(),
	});
};

const openDeleteModal = () => {
	modal.open(LazyModelsActionsConfirmDelete, {
		modelName: props.modelName,
		onConfirm: () => deleteModel(props.modelName),
		onCancel: () => modal.close(),
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
			<UButton
				variant="ghost"
				@click="openRenameModal">
				<UIcon
					name="i-heroicons-pencil-square"
					class="w-5 h-5" />
				<span class="hidden md:inline">RENAME</span>
			</UButton>
			<!-- COPY MODAL -->
			<UButton
				variant="ghost"
				@click="openCopyModal">
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
