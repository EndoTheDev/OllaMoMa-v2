<script setup lang="ts">
  import type { MaxWidthOption } from "~/types/settings";

  const settingsStore = useSettingsStore();
  const { radiusClasses } = useUIUtils();

  const maxWidthOptions: MaxWidthOption[] = [
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
    "7xl",
    "max",
  ];

  const sliderValue = computed({
    get: () => maxWidthOptions.indexOf(settingsStore.currentMaxWidth),
    set: (value: number) => {
      const option = maxWidthOptions[value];
      if (option) {
        settingsStore.setMaxWidth(option);
      }
    },
  });

  const currentLabel = computed(() => {
    const option = settingsStore.currentMaxWidth;
    return option === "max" ? "Max" : option.toUpperCase();
  });
</script>

<template>
  <div
    :class="[
      'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[var(--ui-border)] gap-4',
      radiusClasses,
    ]">
    <div>
      <h3 class="font-medium">Max Width</h3>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Choose your preferred content width
      </p>
    </div>
    <div class="flex flex-col gap-2 min-w-48">
      <USlider
        v-model="sliderValue"
        :min="0"
        :max="6"
        :step="1"
        :tooltip="true"
        class="w-full" />
      <div class="flex justify-between text-xs text-[var(--ui-text-muted)]">
        <span>2XL</span>
        <span>MAX</span>
      </div>
    </div>
  </div>
</template>
