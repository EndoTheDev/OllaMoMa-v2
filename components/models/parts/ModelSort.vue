<script setup lang="ts">
const ollama = useOllama();

const sortOptions = [
	{
		label: 'Sort by Name',
		icon: 'i-lucide-text',
		key: 'name' as const,
	},
	{
		label: 'Sort by Size',
		icon: 'i-lucide-database',
		key: 'size' as const,
	},
	{
		label: 'Sort by Last Modified',
		icon: 'i-lucide-clock',
		key: 'modified' as const,
	},
];

const items = computed(() => [
	sortOptions.map((option) => ({
		label: option.label,
		icon: option.icon,
		onSelect: () => ollama.setSortBy(option.key),
		active: ollama.sortBy.value === option.key,
	})),
]);
</script>

<template>
	<div>
		<UDropdownMenu :items="items">
			<UButton
				color="neutral"
				variant="ghost"
				icon="i-lucide-sort-desc"
				label="Sort" />
		</UDropdownMenu>
	</div>
</template>
