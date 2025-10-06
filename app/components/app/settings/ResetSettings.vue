<script setup lang="ts">
  const settings = useSettingsStore();
  const { radiusClasses } = useUIUtils();

  const showModal = ref(false);

  const showResetConfirmation = () => {
    showModal.value = true;
  };

  const handleConfirm = () => {
    settings.resetSettings();
    showModal.value = false;
  };
</script>

<template>
  <div>
    <div
      :class="[
        'flex items-center justify-between p-4 border border-[var(--ui-border)]',
        radiusClasses,
      ]">
      <div>
        <h3 class="font-medium">Reset Settings</h3>
        <p class="text-sm text-[var(--ui-text-muted)]">
          Reset all settings to their default values
        </p>
      </div>
      <UButton
        color="error"
        variant="ghost"
        icon="i-heroicons-arrow-path"
        @click="showResetConfirmation">
        Reset
      </UButton>
    </div>

    <AppSettingsActionsConfirmReset
      v-if="showModal"
      @confirm="handleConfirm"
      @cancel="showModal = false" />
  </div>
</template>
