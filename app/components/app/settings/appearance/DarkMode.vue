<script setup lang="ts">
  const settingsStore = useSettingsStore();
  const { radiusClasses } = useUIUtils();

  const tooltipContent = {
    side: "bottom",
    align: "center",
    sideOffset: 4,
  } as const;

  const tooltipUI = {
    content:
      "flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-7 px-2 py-1 text-xs select-none",
    text: "truncate font-medium",
  } as const;
</script>

<template>
  <div
    :class="[
      'flex items-center justify-between p-4 border border-[var(--ui-border)]',
      radiusClasses,
    ]">
    <div>
      <h3 class="font-medium">Dark Mode</h3>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Toggle between light and dark theme
      </p>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <UTooltip
          text="Follow system"
          :content="tooltipContent"
          :ui="tooltipUI">
          <UCheckbox
            id="follow-system"
            :model-value="settingsStore.followSystem"
            @update:model-value="settingsStore.setFollowSystem(!!$event)" />
        </UTooltip>
      </div>
      <USwitch
        :model-value="
          settingsStore.followSystem ?
            settingsStore.currentColorMode === 'dark'
          : settingsStore.isDarkMode
        "
        :disabled="settingsStore.followSystem"
        @update:model-value="
          settingsStore.setColorMode($event ? 'dark' : 'light')
        " />
    </div>
  </div>
</template>
