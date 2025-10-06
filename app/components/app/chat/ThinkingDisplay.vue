<script setup lang="ts">
  interface Props {
    thinking: string;
  }

  defineProps<Props>();

  const isOpen = ref(false);
</script>

<template>
  <div class="thinking-container mb-2">
    <UCollapsible
      v-model:open="isOpen"
      class="flex flex-col gap-2">
      <UButton
        class="group"
        color="neutral"
        variant="subtle"
        size="sm"
        trailing-icon="i-lucide-chevron-down"
        :ui="{
          trailingIcon:
            'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
        block>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-brain"
            class="h-4 w-4" />
          <span>Thinking Process</span>
        </div>
      </UButton>

      <template #content>
        <div
          class="p-2 bg-[var(--ui-bg-muted)] rounded-md border border-[var(--ui-border)]">
          <div
            class="text-sm text-[var(--ui-text)] whitespace-pre-wrap font-mono">
            {{ thinking }}
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
