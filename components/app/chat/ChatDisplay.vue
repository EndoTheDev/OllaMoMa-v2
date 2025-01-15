<script setup lang="ts">
interface Message {
	role: 'user' | 'assistant';
	content: string;
}

interface Props {
	messages: Message[];
}

defineProps<Props>();

const { radiusClasses } = useUIUtils();

const getRoleIcon = (role: Message['role']) => (role === 'assistant' ? 'i-heroicons-sparkles' : 'i-heroicons-user');

const getMessageClasses = (role: Message['role']) => ({
	container: ['gap-2', 'items-end', role === 'user' ? 'flex-row-reverse' : 'flex-row'],
	avatar: [
		'mb-0.5',
		role === 'user' ? 'bg-[var(--ui-bg-accented)]' : 'bg-transparent border border-[var(--ui-border)]',
		radiusClasses,
	],
	message: [
		'max-w-[90%] py-2 px-3',
		role === 'user' ? `${radiusClasses.value} rounded-tr-none` : `${radiusClasses.value} rounded-tl-none`,
		role === 'user'
			? 'bg-[var(--ui-bg-accented)] text-[var(--ui-text-highlighted)]'
			: 'bg-[var(--ui-bg-muted)] text-[var(--ui-text)]',
	],
});
</script>

<template>
	<div class="flex flex-col gap-2 px-1 py-2">
		<article
			v-for="message in messages"
			:key="message.content"
			class="flex"
			:class="getMessageClasses(message.role).container">
			<UAvatar
				class="!rounded-full shrink-0"
				:icon="getRoleIcon(message.role)"
				:ui="{
					icon: message.role === 'user' ? 'text-[var(--ui-text-highlighted)]' : 'text-[var(--ui-text-muted)]',
				}"
				:class="getMessageClasses(message.role).avatar" />
			<div :class="getMessageClasses(message.role).message">
				<p>{{ message.content }}</p>
			</div>
		</article>
	</div>
</template>
