<script setup lang="ts">
  const emit = defineEmits<{
    (e: "update:activePanel", value: "info" | "modelfile"): void;
  }>();

  const props = defineProps<{
    activePanel: "info" | "modelfile";
    modelName: string;
    isCloud: boolean;
  }>();

  const { copyModel, deleteModel, renameModel } = useModelActions();

  const showCopyModal = ref(false);
  const showRenameModal = ref(false);
  const showDeleteModal = ref(false);

  const togglePanel = (panel: "info" | "modelfile") => {
    emit("update:activePanel", panel);
  };

  const openCopyModal = () => {
    showCopyModal.value = true;
  };

  const openRenameModal = () => {
    showRenameModal.value = true;
  };

  const openDeleteModal = () => {
    showDeleteModal.value = true;
  };

  const handleCopyConfirm = (newName: string) => {
    copyModel(props.modelName, newName);
    showCopyModal.value = false;
  };

  const handleRenameConfirm = (newName: string) => {
    renameModel(props.modelName, newName);
    showRenameModal.value = false;
  };

  const handleDeleteConfirm = () => {
    deleteModel(props.modelName);
    showDeleteModal.value = false;
  };
</script>

<template>
  <div>
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

    <!-- Modals -->
    <AppModelsActionsConfirmCopy
      v-if="showCopyModal"
      :model-name="props.modelName"
      @confirm="handleCopyConfirm"
      @cancel="showCopyModal = false" />
    <AppModelsActionsConfirmRename
      v-if="showRenameModal"
      :model-name="props.modelName"
      @confirm="handleRenameConfirm"
      @cancel="showRenameModal = false" />
    <AppModelsActionsConfirmDelete
      v-if="showDeleteModal"
      :model-name="props.modelName"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteModal = false" />
  </div>
</template>
