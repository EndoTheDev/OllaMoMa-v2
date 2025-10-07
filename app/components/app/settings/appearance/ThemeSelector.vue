<script setup lang="ts">
  import { themeColorMap } from "~/types/settings";

  const settingsStore = useSettingsStore();
  const { radiusClasses } = useUIUtils();

  // Tooltip configuration
  const tooltipContent = {
    side: "bottom",
    align: "center",
    sideOffset: 4,
  } as const;

  const tooltipUI = {
    content:
      "flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-7 px-2 py-1 text-xs select-none capitalize",
    text: "truncate font-medium",
  } as const;

  // Custom color picker
  const customColor = ref("#00C16A");

  const currentPrimary = computed(() => {
    if (settingsStore.currentTheme === "custom") {
      return settingsStore.customPrimaryColor || "#22C55E";
    }
    // For predefined themes, return hex equivalent
    const hexMap = {
      red: "#EF4444",
      blue: "#3B82F6",
      green: "#22C55E",
      yellow: "#EAB308",
      purple: "#9333EA",
      pink: "#EC4899",
      indigo: "#6366F1",
    };
    return hexMap[settingsStore.currentTheme as keyof typeof hexMap];
  });

  const isCustomSelected = computed(
    () =>
      settingsStore.currentTheme === "custom" &&
      !!settingsStore.customPrimaryColor
  );

  function openColorPicker() {
    customColor.value = currentPrimary.value;
  }

  watch(customColor, (newColor) => {
    if (newColor) {
      settingsStore.setCustomPrimaryColor(newColor);
    }
  });
</script>

<template>
  <div
    :class="[
      'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[var(--ui-border)] gap-4',
      radiusClasses,
    ]">
    <div>
      <h3 class="font-medium">Primary</h3>
      <p class="text-sm text-[var(--ui-text-muted)]">
        Choose your preferred primary color
      </p>
    </div>
    <div class="flex flex-wrap gap-4">
      <URadioGroup
        orientation="horizontal"
        :model-value="settingsStore.currentTheme"
        :items="[
          { value: 'blue', class: 'bg-blue-500' },
          { value: 'green', class: 'bg-green-500' },
          { value: 'red', class: 'bg-red-500' },
          { value: 'yellow', class: 'bg-yellow-500' },
          { value: 'purple', class: 'bg-purple-500' },
          { value: 'pink', class: 'bg-pink-500' },
          { value: 'indigo', class: 'bg-indigo-500' },
        ]"
        :ui="{
          wrapper: 'inline-flex',
          container: '!hidden',
          base: '!hidden',
          item: '!p-0 !m-0 !bg-transparent !border-0 !shadow-none',
          label:
            '!cursor-pointer !p-0 !m-0 !bg-transparent !border-0 !shadow-none',
        }"
        @update:model-value="
          (value: string) =>
            settingsStore.setTheme(
              value as
                | 'blue'
                | 'green'
                | 'red'
                | 'yellow'
                | 'purple'
                | 'pink'
                | 'indigo'
            )
        ">
        <template #label="{ item, modelValue }">
          <UTooltip
            :text="item.value"
            :content="tooltipContent"
            :ui="tooltipUI">
            <div
              class="w-6 h-6 rounded-full transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-900 hover:scale-110"
              :class="[
                item.class,
                modelValue === item.value ?
                  'ring-gray-400 dark:ring-gray-500'
                : 'ring-transparent',
              ]" />
          </UTooltip>
        </template>
      </URadioGroup>

      <!-- Custom Color Picker -->
      <UPopover>
        <UTooltip
          :text="'Custom'"
          :content="tooltipContent"
          :ui="tooltipUI">
          <div
            class="w-6 h-6 rounded-full transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-900 hover:scale-110 cursor-pointer"
            :class="[
              isCustomSelected ?
                'ring-gray-400 dark:ring-gray-500'
              : 'ring-transparent',
            ]"
            :style="{
              background:
                'conic-gradient(red, yellow, green, cyan, blue, magenta, red)',
            }"
            @click="openColorPicker" />
        </UTooltip>

        <template #content>
          <UColorPicker
            v-model="customColor"
            format="hex"
            class="p-2" />
        </template>
      </UPopover>
    </div>
  </div>
</template>
