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
						class="border border-[var(--ui-border)] p-4 rounded-lg">
						<h3 class="font-bold">{{ model.name }}</h3>
						<p class="text-sm text-[var(--ui-text-muted)]">
							Size: {{ (model.size / 1024 / 1024 / 1024).toFixed(2) }} GB
						</p>
						<p class="text-sm text-[var(--ui-text-muted)]">
							Modified: {{ new Date(model.modified_at).toLocaleString() }}
						</p>
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
