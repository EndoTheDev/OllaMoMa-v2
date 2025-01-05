<script setup lang="ts">
import { Ollama } from 'ollama/browser';
import type { OllamaModelDetails } from '~/types/ollama';

const props = defineProps<{
	modelName?: string;
}>();

const client = new Ollama({
	host: `http://${useSettingsStore().ollamaHost}:${useSettingsStore().ollamaPort}`,
});

const modelDetails = ref<OllamaModelDetails | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

async function fetchModelDetails(name?: string) {
	const modelName = name || props.modelName;

	if (!modelName) {
		error.value = 'Model name is required';
		isLoading.value = false;
		return;
	}

	isLoading.value = true;
	error.value = null;

	try {
		console.log('Fetching model details for:', modelName);
		const response = await client.show({ model: modelName });

		if (!response) {
			throw new Error('No model details returned from API');
		}

		modelDetails.value = {
			license: response.license,
			modelfile: response.modelfile,
			parameters: response.parameters,
			template: response.template,
			system: response.system,
			parent_model: response.details?.parent_model || '',
			format: response.details?.format || '',
			family: response.details?.family || '',
			families: response.details?.families || [],
			parameter_size: response.details?.parameter_size || '',
			quantization_level: response.details?.quantization_level || '',
		};
		console.log('Received model details:', modelDetails.value);
	} catch (err) {
		console.error('Error fetching model details:', err);
		error.value = err instanceof Error ? err.message : 'Failed to fetch model details';
	} finally {
		isLoading.value = false;
	}
}

// Watch for changes in modelName prop
watch(
	() => props.modelName,
	(newName) => {
		if (newName) {
			fetchModelDetails(newName);
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="">
		<!-- <div class="flex items-center justify-between mt-2">
			<h1 class="text-lg font-semibold">Modelfile</h1>
			<UButton
				v-if="modelDetails"
				color="neutral"
				variant="ghost"
				icon="i-heroicons-arrow-path"
				:loading="isLoading"
				@click="() => fetchModelDetails(props.modelName)" />
		</div> -->

		<div
			v-if="isLoading"
			class="flex justify-center py-8">
			<UProgress animation="carousel" />
		</div>

		<div
			v-else-if="error"
			class="py-4">
			<UAlert
				:title="error"
				color="error"
				variant="soft"
				icon="i-heroicons-exclamation-triangle" />
		</div>

		<ScrollArea
			v-else-if="modelDetails"
			max-height="400px"
			class="bg-[var(--ui-code)] [&>div]:bg-[var(--ui-code-darker)] pb-2">
			<pre class="text-sm p-2 whitespace-pre-wrap break-words font-mono">{{ modelDetails.modelfile }}</pre>
		</ScrollArea>
	</div>
</template>
