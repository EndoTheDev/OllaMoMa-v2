<script setup lang="ts">
  import {
    LazyAppModelsActionsConfirmDelete,
    LazyAppModelsActionsConfirmCopy,
    LazyAppModelsActionsConfirmRename,
  } from "#components";

  const emit = defineEmits<{
    (e: "update:activePanel", value: "info" | "modelfile"): void;
  }>();

  const props = defineProps<{
    activePanel: "info" | "modelfile";
    modelName: string;
    isCloud: boolean;
  }>();

  const { modal, copyModel, deleteModel, renameModel } = useModelActions();

  const togglePanel = (panel: "info" | "modelfile") => {
    emit("update:activePanel", panel);
  };

  const openCopyModal = () => {
    modal.open(LazyAppModelsActionsConfirmCopy, {
      modelName: props.modelName,
      onConfirm: (newName: string) => copyModel(props.modelName, newName),
      onCancel: () => modal.close(),
    });
  };

  const openRenameModal = () => {
    modal.open(LazyAppModelsActionsConfirmRename, {
      modelName: props.modelName,
      onConfirm: (newName: string) => renameModel(props.modelName, newName),
      onCancel: () => modal.close(),
    });
  };

  const openDeleteModal = () => {
    modal.open(LazyAppModelsActionsConfirmDelete, {
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
        variant="ghost"
        :color="activePanel === 'info' ? 'primary' : 'neutral'"
        @click="togglePanel('info')">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-5 h-5" />
        <span class="hidden md:inline">INFO</span>
      </UButton>
      <UButton
        variant="ghost"
        :color="activePanel === 'modelfile' ? 'primary' : 'neutral'"
        @click="togglePanel('modelfile')">
        <UIcon
          name="i-heroicons-document"
          class="w-5 h-5" />
        <span class="hidden md:inline">MODELFILE</span>
      </UButton>
    </div>
    <div
      v-if="!props.isCloud"
      class="flex gap-1">
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
