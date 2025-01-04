<script setup lang="ts">
const ollamaStore = useOllamaStore();

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
								<ModelsActionPanel />
								<ModelsInfoPanel :model="model" />
								<ModelsModelFile />
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
