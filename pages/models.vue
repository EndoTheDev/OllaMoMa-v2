<script setup lang="ts">
const ollama = useOllama();
const { radiusClasses } = useUIUtils();
const activePanels = ref<Record<string, 'info' | 'modelfile'>>({});
const searchQuery = ref('');

interface SortOption {
	label: string;
	value: 'name' | 'size' | 'modified';
	icon?: string;
}

const sortOptions: SortOption[] = [
	{ label: 'Name', value: 'name', icon: 'i-lucide-sort-asc' },
	{ label: 'Size', value: 'size', icon: 'i-lucide-database' },
	{ label: 'Last Modified', value: 'modified', icon: 'i-lucide-clock' },
];

const selectedSort = ref<SortOption>(sortOptions[2]); // Default to 'Last Modified'

const getActivePanel = (modelName: string) => {
	return activePanels.value[modelName] || 'info';
};

const setActivePanel = (modelName: string, panel: 'info' | 'modelfile') => {
	activePanels.value[modelName] = panel;
};

const filteredModels = computed(() => {
	let models = [...ollama.models.value];

	// Apply search filter
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		models = models.filter((model) => model.name.toLowerCase().includes(query));
	}

	// Apply sorting
	return models.sort((a, b) => {
		switch (selectedSort.value.value) {
			case 'name':
				return a.name.localeCompare(b.name);
			case 'size':
				return (b.size || 0) - (a.size || 0);
			case 'modified':
				return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime();
			default:
				return 0;
		}
	});
});

const searchPlaceholder = computed(() => {
	const count = filteredModels.value.length;
	return `Search ${count} model${count !== 1 ? 's' : ''}...`;
});

onMounted(async () => {
	try {
		await ollama.fetchModels();
	} catch (error) {
		console.error('Failed to fetch models:', error);
	}
});
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="flex gap-1 items-center h-full p-2">
				<UInput
					v-model="searchQuery"
					variant="ghost"
					:placeholder="searchPlaceholder"
					class="w-full"
					icon="i-lucide-search"
					size="lg"
					autofocus />
				<USelectMenu
					v-model="selectedSort"
					:items="sortOptions"
					size="lg"
					variant="ghost"
					class="min-w-36"
					:leading-icon="selectedSort.icon"
					:search-input="false" />
			</div>
		</template>
		<template #default>
			<div
				v-if="ollama.isLoading.value"
				class="text-[var(--ui-text-dimmed)]">
				Loading models...
			</div>
			<div
				v-else-if="ollama.error.value"
				class="text-[var(--ui-error)]">
				{{ ollama.error.value }}
			</div>
			<div v-else>
				<ul
					v-if="ollama.hasModels.value"
					class="flex flex-col gap-1 py-1">
					<li
						v-for="model in filteredModels"
						:key="model.name"
						:class="[
							'p-3 py-2 border border-[var(--ui-border)] hover:bg-[var(--ui-bg-muted)]/50 hover:drop-shadow-sm transition-colors duration-500 ease-out',
							radiusClasses,
						]">
						<ModelsModelCard
							:model="model"
							:active-panel="getActivePanel(model.name)"
							@update:active-panel="(panel) => setActivePanel(model.name, panel)" />
					</li>
				</ul>
				<p
					v-else
					class="text-[var(--ui-text-muted)]">
					No models available
				</p>
			</div>
		</template>
		<template #footer>
			<div class="h-12" />
		</template>
	</BaseLayout>
</template>
