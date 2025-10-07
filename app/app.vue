<script setup lang="ts">
  import { ref, watch } from "vue";

  const appConfig = useAppConfig();
  const settingsStore = useSettingsStore();
  const isSmallViewport = useMediaQuery("(min-width: 768px)");

  // Ref for sequencing text fade
  const showLabels = ref(settingsStore.sidebarOpen);

  // Ref for content padding
  const contentOpen = ref(settingsStore.sidebarOpen);

  // Watcher to sequence animations
  watch(
    () => settingsStore.sidebarOpen,
    (newVal) => {
      if (newVal) {
        // Opening: show content and text after delay
        contentOpen.value = true;
        setTimeout(() => {
          showLabels.value = true;
        }, 300);
      } else {
        // Closing: hide text immediately, then hide content
        showLabels.value = false;
        setTimeout(() => {
          contentOpen.value = false;
        }, 300);
      }
    }
  );
</script>

<template>
  <ClientOnly>
    <UApp :toaster="appConfig.toaster">
      <div class="flex">
        <AppSidebar>
          <template #default>
            <AppSidebarNav :show-labels="showLabels" />
          </template>
        </AppSidebar>

        <!-- CONTENT -->
        <div
          class="fixed w-full flex justify-center transition-all duration-300 pl-14"
          :class="[isSmallViewport && contentOpen ? 'md:pl-56' : 'md:pl-14']">
          <NuxtPage />
        </div>
      </div>
    </UApp>
  </ClientOnly>
</template>
