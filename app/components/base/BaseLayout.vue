<script setup lang="ts">
  import { maxWidthMap } from "~/types/settings";
  import { useSettingsStore } from "~/stores/settings";

  interface Props {
    /**
     * Whether to auto scroll to bottom when content changes
     */
    autoScroll?: boolean;
  }

  withDefaults(defineProps<Props>(), {
    autoScroll: false,
  });

  const settingsStore = useSettingsStore();
</script>

<template>
  <div
    :class="[
      'flex flex-col h-screen w-full md:border-x md:border-[var(--ui-border)] shadow-sm',
      maxWidthMap[settingsStore.currentMaxWidth],
    ]">
    <header class="flex-none">
      <slot name="header" />
    </header>
    <main
      class="flex-1 min-h-0 border-y border-[var(--ui-border)] overflow-hidden">
      <div class="flex flex-col h-full">
        <UiScrollArea
          class="flex-1"
          :auto-scroll="autoScroll">
          <div class="pl-1 pr-3">
            <slot />
          </div>
        </UiScrollArea>
      </div>
    </main>
    <footer class="flex-none">
      <slot name="footer" />
    </footer>
  </div>
</template>
