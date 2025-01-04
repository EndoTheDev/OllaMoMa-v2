<script setup lang="ts">
const ollamaStore = useOllamaStore();
const activePanels = ref<Record<string, 'info' | 'modelfile'>>({});

const getActivePanel = (modelName: string) => {
	return activePanels.value[modelName] || 'info';
};

const setActivePanel = (modelName: string, panel: 'info' | 'modelfile') => {
	activePanels.value[modelName] = panel;
};

onMounted(() => {
	ollamaStore.fetchModels();
});
</script>

<template>
	<BaseLayout>
		<template #header>
			<h1>Models</h1>
		</template>
		<template #default>
			<div
				v-if="ollamaStore.isLoading"
				class="text-[var(--ui-text-dimmed)]">
				Loading models...
			</div>
			<div
				v-else-if="ollamaStore.error"
				class="text-[var(--ui-error)]">
				{{ ollamaStore.error }}
			</div>
			<div v-else>
				<ul
					v-if="ollamaStore.hasModels"
					class="space-y-1">
					<li
						v-for="model in ollamaStore.models"
						:key="model.name"
						class="border border-[var(--ui-border)] p-3 py-2 rounded-lg">
						<UAccordion
							:items="[
								{
									label: model.name,
									icon: 'i-lucide-box',
									content: '',
									slot: 'model-details',
								},
							]"
							:ui="{
								trigger: 'text-base font-bold py-2 cursor-pointer',
							}">
							<template #model-details>
								<ModelsActionMenu
									:active-panel="getActivePanel(model.name)"
									@update:active-panel="(panel) => setActivePanel(model.name, panel)" />
								<div class="relative">
									<Transition
										mode="out-in"
										:enter-active-class="'transition duration-200 ease-out'"
										:enter-from-class="
											getActivePanel(model.name) === 'info'
												? 'opacity-0 -translate-x-4'
												: 'opacity-0 translate-x-4'
										"
										:enter-to-class="'opacity-100 translate-x-0'"
										:leave-active-class="'transition duration-150 ease-in'"
										:leave-from-class="'opacity-100 translate-x-0'"
										:leave-to-class="
											getActivePanel(model.name) === 'info'
												? 'opacity-0 translate-x-4'
												: 'opacity-0 -translate-x-4'
										">
										<ModelsInfoPanel
											v-if="getActivePanel(model.name) === 'info'"
											:key="'info-' + model.name"
											:model="model" />
										<ModelsModelFile
											v-else
											:key="'modelfile-' + model.name" />
									</Transition>
								</div>
							</template>
						</UAccordion>
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
