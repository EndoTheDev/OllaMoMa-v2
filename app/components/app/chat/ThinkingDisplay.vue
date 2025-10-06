<script setup lang="ts">
  interface Props {
    thinking: string;
  }

  defineProps<Props>();

  const isOpen = ref(false);
</script>

<template>
  <div class="mb-2">
    <UCollapsible
      v-model:open="isOpen"
      class="flex flex-col border-t border-x border-[var(--ui-border-muted)] rounded-md"
      :class="{ 'border-b': !isOpen }">
      <UButton
        class="group"
        color="neutral"
        variant="soft"
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
          class="px-2 py-1 bg-[var(--ui-bg-muted)] rounded-b-md border-b border-[var(--ui-border-muted)]">
          <div
            class="text-sm text-[var(--ui-text)] whitespace-pre-wrap font-mono">
            {{ thinking }}
          </div>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>
