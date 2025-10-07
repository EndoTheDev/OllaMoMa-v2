<script setup lang="ts">
  import { ref } from "vue";

  const settingsStore = useSettingsStore();
  const { radiusClasses } = useUIUtils();

  const switchRef = ref<HTMLElement | null>(null);

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

  const handleSwitchClick = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;
    settingsStore.setTransitionCoordinates(x, y);
  };
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
      <div ref="switchRef">
        <USwitch
          :model-value="
            settingsStore.followSystem ?
              settingsStore.currentColorMode === 'dark'
            : settingsStore.isDarkMode
          "
          :disabled="settingsStore.followSystem"
          @click="handleSwitchClick"
          @update:model-value="
            settingsStore.setColorMode($event ? 'dark' : 'light')
          " />
      </div>
    </div>
  </div>
</template>

<style>
  /* View Transitions API styles for dark mode animation */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }

  ::view-transition-new(root) {
    z-index: 9999;
  }

  ::view-transition-old(root) {
    z-index: 1;
  }

  /* Disable animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none !important;
    }
  }
</style>
