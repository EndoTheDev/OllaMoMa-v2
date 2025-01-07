<script setup lang="ts">
const ollama = useOllama();

const sortOptions = [
	{
		label: 'Name',
		icon: 'i-lucide-arrow-up-a-z',
		key: 'name' as const,
	},
	{
		label: 'Size',
		icon: 'i-lucide-database',
		key: 'size' as const,
	},
	{
		label: 'Last Modified',
		icon: 'i-lucide-calendar-check-2',
		key: 'modified' as const,
	},
];

const items = computed(() => [
	sortOptions.map((option) => ({
		label: option.label,
		icon: option.icon,
		onSelect: () => ollama.setSortBy(option.key),
		active: ollama.sortBy.value === option.key,
		trailing:
			ollama.sortBy.value === option.key
				? {
						icon: ollama.sortDirection.value === 'desc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down',
						class: 'w-4 h-4',
					}
				: undefined,
	})),
]);

const buttonIcon = computed(() => {
	if (ollama.sortBy.value === 'name') {
		return ollama.sortDirection.value === 'desc' ? 'i-lucide-arrow-down-z-a' : 'i-lucide-arrow-down-a-z';
	}
	if (ollama.sortBy.value === 'size') {
		return ollama.sortDirection.value === 'desc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow';
	}
	return ollama.sortDirection.value === 'desc' ? 'i-lucide-calendar-arrow-down' : 'i-lucide-calendar-arrow-up';
});
</script>

<template>
	<div>
		<UDropdownMenu :items="items">
			<UButton
				color="neutral"
				variant="ghost"
				:icon="buttonIcon"
				label="Sort" />
		</UDropdownMenu>
	</div>
</template>
