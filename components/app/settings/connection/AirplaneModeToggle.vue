<script setup lang="ts">
  const settingsStore = useSettingsStore();
  const { radiusClasses } = useUIUtils();
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between p-4 border border-[var(--ui-border)]',
      radiusClasses,
    ]">
    <div>
      <h3 class="font-medium">Airplane Mode</h3>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Hide cloud models when offline
      </p>
    </div>
    <USwitch
      :model-value="settingsStore.airplaneMode"
      @update:model-value="settingsStore.setAirplaneMode($event)" />
  </div>
</template>
