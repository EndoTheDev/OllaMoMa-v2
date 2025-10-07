<script setup lang="ts">
  import type { ChatMessage } from "~/stores/chat";
  import { parseThinking } from "~/composables/useThinkingParser";

  interface Props {
    messages: ChatMessage[];
  }

  defineProps<Props>();

  const { radiusClasses } = useUIUtils();

  const getRoleIcon = (role: ChatMessage["role"]) =>
    role === "assistant" ? "i-heroicons-sparkles" : "i-heroicons-user";

  const getMessageClasses = (role: ChatMessage["role"]) => ({
    container: [
      "gap-2",
      "items-start",
      role === "user" ? "sticky top-0 z-10 bg-[var(--ui-bg)] py-1.5" : "",
      role === "user" ? "flex-row-reverse" : "flex-row",
    ],
    avatar: [
      "mt-0.5",
      role === "assistant" ? "sticky top-16 z-10" : "",

      role === "user" ?
        "bg-[var(--ui-bg-accented)]"
      : "bg-transparent border border-[var(--ui-border)]",
      radiusClasses,
    ],
    message: [
      "max-w-[90%] py-3 px-3",
      role === "user" ?
        `${radiusClasses.value} rounded-tr-none`
      : `${radiusClasses.value} rounded-tl-none`,
      role === "user" ?
        "bg-[var(--ui-bg-accented)] text-[var(--ui-text-highlighted)]"
      : "bg-[var(--ui-bg-muted)] text-[var(--ui-text)]",
    ],
  });

  // Parse thinking content from message
  const getParsedMessage = (
    message: ChatMessage
  ): { thinking: string | null; content: string } => {
    if (message.role !== "assistant") {
      return { thinking: null, content: message.content };
    }

    // Priority: use structured thinking if available, otherwise parse from content
    if (message.thinking) {
      return { thinking: message.thinking, content: message.content };
    }

    const parsed = parseThinking(message.content);
    return { thinking: parsed.thinking, content: parsed.cleanContent };
  };
</script>

<template>
  <div class="flex flex-col px-1 pb-2">
    <article
      v-for="message in messages"
      :key="message.id"
      class="flex"
      :class="getMessageClasses(message.role).container">
      <UAvatar
        class="!rounded-full shrink-0"
        :icon="getRoleIcon(message.role)"
        :ui="{
          icon:
            message.role === 'user' ?
              'text-[var(--ui-text-highlighted)]'
            : 'text-[var(--ui-text-muted)]',
        }"
        :class="getMessageClasses(message.role).avatar" />
      <div :class="getMessageClasses(message.role).message">
        <AppChatThinkingDisplay
          v-if="
            message.role === 'assistant' && getParsedMessage(message).thinking
          "
          :thinking="getParsedMessage(message).thinking!" />
        <p class="px-1">{{ getParsedMessage(message).content }}</p>
      </div>
    </article>
  </div>
</template>
