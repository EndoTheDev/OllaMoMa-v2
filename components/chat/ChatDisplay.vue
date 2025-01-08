<script setup lang="ts">
interface Props {
	messages: {
		role: 'user' | 'assistant';
		content: string;
	}[];
}

defineProps<Props>();

const { radiusClasses } = useUIUtils();

const getRoleIcon = (role: 'user' | 'assistant') => {
	switch (role) {
		case 'assistant':
			return 'i-heroicons-sparkles';
		case 'user':
			return 'i-heroicons-user';
	}
};
</script>

<template>
	<div class="flex flex-col gap-2 px-1 py-2">
		<div
			v-for="message in messages"
			:key="message.content"
			class="flex items-center"
			:class="['gap-2', message.role === 'user' ? 'flex-row-reverse' : 'flex-row']">
			<UAvatar
				class="!rounded-full"
				:icon="getRoleIcon(message.role)"
				:ui="{
					root: 'shrink-0',
					icon: message.role === 'user' ? 'text-[var(--ui-text-highlighted)]' : 'text-[var(--ui-text-muted)]',
				}"
				:class="[
					message.role === 'user' ? 'bg-[var(--ui-bg-accented)]' : 'bg-transparent border border-[var(--ui-border)]',
					radiusClasses,
				]" />
			<div
				:class="[
					'max-w-[90%] py-2 px-3',
					radiusClasses,
					message.role === 'user'
						? 'bg-[var(--ui-bg-accented)] text-[var(--ui-text-highlighted)]'
						: 'bg-[var(--ui-bg-muted)] text-[var(--ui-text)]',
				]">
				<p>{{ message.content }}</p>
			</div>
		</div>
	</div>
</template>
