<script setup lang="ts">
const ollama = useOllama();
const { radiusClasses } = useUIUtils();
const activePanels = ref<Record<string, 'info' | 'modelfile'>>({});

const getActivePanel = (modelName: string) => {
	return activePanels.value[modelName] || 'info';
};

const setActivePanel = (modelName: string, panel: 'info' | 'modelfile') => {
	activePanels.value[modelName] = panel;
};

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
			<h1>Models</h1>
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
					class="space-y-1">
					<li
						v-for="model in ollama.models.value"
						:key="model.name"
						:class="[
							'p-3 py-2 border border-[var(--ui-border)] hover:bg-[var(--ui-bg-muted)]/50 hover:drop-shadow-sm transition-colors duration-500 ease-out',
							radiusClasses,
						]">
						<ModelsModelAccordion
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
			<h1>FOOTER</h1>
		</template>
	</BaseLayout>
</template>
