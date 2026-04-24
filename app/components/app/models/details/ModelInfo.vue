<script setup lang="ts">
  import { Ollama } from "ollama/browser";
  import type { OllamaModel } from "~/types/ollama";
  const { radiusClasses } = useUIUtils();
  const { formatSize } = useUtils();

  const props = defineProps<{
    model: OllamaModel;
    isCloud: boolean;
  }>();

  // Icon mapping for known capabilities
  const CAPABILITY_ICONS: Record<string, string> = {
    completion: "i-lucide-message-square",
    vision: "i-lucide-eye",
    tools: "i-lucide-wrench",
    thinking: "i-lucide-brain",
    embedding: "i-lucide-layers",
  };

  const getCapabilityIcon = (capability: string): string =>
    CAPABILITY_ICONS[capability] ?? "i-lucide-sparkles";

  const client = new Ollama({
    host: `http://${useSettingsStore().ollamaHost}:${useSettingsStore().ollamaPort}`,
  });

  const capabilities = ref<string[]>([]);
  const isLoadingCapabilities = ref(true);

  async function fetchCapabilities(name: string) {
    isLoadingCapabilities.value = true;
    try {
      const response = await client.show({ model: name });
      capabilities.value =
        (response as Record<string, unknown>).capabilities as string[] || [];
    } catch {
      capabilities.value = [];
    } finally {
      isLoadingCapabilities.value = false;
    }
  }

  watch(
    () => props.model.name,
    (name) => {
      if (name) fetchCapabilities(name);
    },
    { immediate: true }
  );
</script>

<template>
  <div class="space-y-2 px-2">
    <div class="flex flex-wrap items-center gap-2">
      <span class="text-base w-36">Model Family:</span>
      <UBadge
        v-for="family in model.details?.families"
        :key="family"
        :label="family"
        :class="[radiusClasses]"
        class="capitalize text-sm"
        variant="soft"
        color="primary" />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="text-base w-36">Capabilities:</span>
      <template v-if="isLoadingCapabilities">
        <span class="text-[var(--ui-text-muted)] text-sm">Loading...</span>
      </template>
      <template v-else-if="capabilities.length > 0">
        <UBadge
          v-for="cap in capabilities"
          :key="cap"
          :class="[radiusClasses]"
          class="capitalize text-sm"
          variant="subtle"
          color="primary">
          <UIcon
            :name="getCapabilityIcon(cap)"
            class="w-3.5 h-3.5" />
          {{ cap }}
        </UBadge>
      </template>
      <template v-else>
        <span class="text-[var(--ui-text-muted)] text-sm">None reported</span>
      </template>
    </div>

    <div class="grid lg:grid-cols-2 gap-y-2 gap-x-12">
      <div
        v-if="!isCloud"
        class="flex flex-wrap items-center gap-3">
        <span class="text-base w-36">Size:</span>
        <span class="text-[var(--ui-text-muted)] text-base">
          {{ formatSize(model.size) }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span class="text-base w-36">Parameters:</span>
        <span class="text-[var(--ui-text-muted)] text-base">
          {{ model.details?.parameter_size }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span class="text-base w-36">Format:</span>
        <span class="text-[var(--ui-text-muted)] text-base uppercase">
          {{ model.details?.format }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <span class="text-base w-36">Quantization:</span>
        <span class="text-[var(--ui-text-muted)] text-base">
          {{ model.details?.quantization_level }}
        </span>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <span class="text-base w-36">Modified:</span>
      <span
        class="text-[var(--ui-text-muted)] text-base flex items-center gap-2">
        {{ new Date(model.modified_at).toLocaleDateString() }}
        <UBadge
          :label="`${useTimeAgo(model.modified_at).value}`"
          :class="[radiusClasses]"
          class="text-xs"
          variant="soft"
          color="neutral" />
      </span>
    </div>

    <div class="flex flex-wrap items-start gap-3">
      <span class="text-base w-36">Digest:</span>
      <span
        class="text-[var(--ui-text-muted)] break-all text-sm flex-1 font-mono line-clamp-2">
        {{ model.digest }}
      </span>
    </div>
  </div>
</template>
