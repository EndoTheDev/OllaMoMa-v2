<script setup lang="ts">
const emit = defineEmits<{
	(e: 'update:activePanel', value: 'info' | 'modelfile'): void;
}>();

const props = defineProps<{
	activePanel: 'info' | 'modelfile';
}>();

const togglePanel = (panel: 'info' | 'modelfile') => {
	emit('update:activePanel', panel);
};
</script>

<template>
	<div class="flex justify-between">
		<div class="flex gap-1">
			<UButton
				variant="ghost"
				:color="activePanel === 'info' ? 'primary' : 'neutral'"
				@click="togglePanel('info')">
				<UIcon
					name="i-heroicons-information-circle"
					class="w-5 h-5" />
				<span class="hidden md:inline">INFO</span>
			</UButton>
			<UButton
				variant="ghost"
				:color="activePanel === 'modelfile' ? 'primary' : 'neutral'"
				@click="togglePanel('modelfile')">
				<UIcon
					name="i-heroicons-document"
					class="w-5 h-5" />
				<span class="hidden md:inline">MODELFILE</span>
			</UButton>
		</div>
		<div class="flex gap-1">
			<UButton variant="ghost">
				<UIcon
					name="i-heroicons-pencil-square"
					class="w-5 h-5" />
				<span class="hidden md:inline">RENAME</span>
			</UButton>
			<UButton variant="ghost">
				<UIcon
					name="i-heroicons-document-duplicate"
					class="w-5 h-5" />
				<span class="hidden md:inline">COPY</span>
			</UButton>
			<UButton variant="ghost">
				<UIcon
					name="i-heroicons-trash"
					class="w-5 h-5" />
				<span class="hidden md:inline">DELETE</span>
			</UButton>
		</div>
	</div>
</template>
