<script setup lang="ts">
  import { ref, watch } from "vue";
  import { useSettingsStore } from "~/stores/settings";
  import type { VNode } from "vue";

  const settingsStore = useSettingsStore();
  const isSmallViewport = useMediaQuery("(min-width: 768px)");
  const { fadeTransition, radiusClasses } = useUIUtils();

  // New refs for sequencing
  const showText = ref(settingsStore.sidebarOpen);
  const showLabels = ref(settingsStore.sidebarOpen);
  const isOpen = ref(settingsStore.sidebarOpen);
  const sidebarWidth = ref(settingsStore.sidebarOpen ? "w-56" : "w-14");

  // Watcher to sequence animations
  watch(
    () => settingsStore.sidebarOpen,
    (newVal) => {
      if (newVal) {
        // Opening: expand width and show content first, then fade in text
        sidebarWidth.value = "w-56";
        isOpen.value = true;
        setTimeout(() => {
          showText.value = true;
          showLabels.value = true;
        }, 300); // Delay matches width transition duration
      } else {
        // Closing: fade out text first, then hide content and shrink width
        showText.value = false;
        showLabels.value = false;
        setTimeout(() => {
          isOpen.value = false;
          sidebarWidth.value = "w-14";
        }, 300); // Delay matches text fade duration
      }
    }
  );

  defineSlots<{
    default?: () => VNode | VNode[];
    footer?: () => VNode | VNode[];
  }>();

  // Tooltip configuration
  const tooltipContent = {
    side: "right",
    align: "center",
    sideOffset: 8,
    alignOffset: 0,
  } as const;

  // Custom UI configuration for larger tooltips
  const tooltipUI = {
    content:
      "flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-8 px-3 py-1 text-sm select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]",
    text: "truncate font-medium",
  } as const;
</script>

<template>
  <div
    :class="[
      'h-screen flex flex-col gap-1 p-1 bg-[var(--ui-bg)] z-50 border-r border-[var(--ui-border)]',
      'transition-[width] duration-300 drop-shadow-sm',
      sidebarWidth,
    ]">
    <UTooltip
      :text="settingsStore.sidebarOpen ? '' : 'Toggle Sidebar'"
      :content="tooltipContent"
      :ui="tooltipUI">
      <UButton
        :class="['h-10 flex w-full justify-center', radiusClasses]"
        @click="settingsStore.toggleSidebar">
        <UIcon
          name="i-heroicons-bars-3"
          class="fixed left-4 w-6 h-6" />
        <Transition v-bind="fadeTransition">
          <span v-if="showText">Sidebar</span>
        </Transition>
      </UButton>
    </UTooltip>
    <div
      class="flex-1 flex flex-col gap-1 py-1 border-y border-[var(--ui-border-accented)]">
      <AppSidebarNav
        :show-tooltips="!isOpen"
        :show-labels="showLabels" />
    </div>
    <div>
      <UTooltip
        v-if="!isOpen"
        text="Settings"
        :content="tooltipContent"
        :ui="tooltipUI">
        <UButton
          :to="'/settings'"
          :class="['h-10 flex w-full justify-center', radiusClasses]">
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="fixed left-4 w-6 h-6" />
          <Transition v-bind="fadeTransition">
            <span v-if="showLabels">Settings</span>
          </Transition>
        </UButton>
      </UTooltip>
      <UButton
        v-else
        :to="'/settings'"
        :class="['h-10 flex w-full justify-center', radiusClasses]">
        <UIcon
          name="i-heroicons-cog-6-tooth"
          class="fixed left-4 w-6 h-6" />
        <Transition v-bind="fadeTransition">
          <span v-if="showLabels">Settings</span>
        </Transition>
      </UButton>
    </div>
  </div>
  <!-- OVERLAY -->
  <Transition v-bind="fadeTransition">
    <div
      v-show="settingsStore.sidebarOpen && !isSmallViewport"
      class="fixed w-full h-full bg-[var(--ui-bg)]/50 backdrop-blur-sm z-40"
      @click="settingsStore.toggleSidebar" />
  </Transition>
</template>
