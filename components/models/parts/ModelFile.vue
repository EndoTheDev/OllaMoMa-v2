<script setup lang="ts">
import { Ollama } from 'ollama/browser';
import type { OllamaModelDetails } from '~/types/ollama';
const { radiusClasses } = useUIUtils();

const props = defineProps<{
	modelName?: string;
}>();

const client = new Ollama({
	host: `http://${useSettingsStore().ollamaHost}:${useSettingsStore().ollamaPort}`,
});

const modelDetails = ref<OllamaModelDetails | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const isCopied = ref(false);

const toast = useToast();

const copyToClipboard = async () => {
	if (modelDetails.value?.modelfile) {
		try {
			await navigator.clipboard.writeText(modelDetails.value.modelfile);
			isCopied.value = true;

			// Add toast notification
			toast.add({
				title: 'Copied to clipboard',
				description: 'Modelfile content has been copied',
				icon: 'i-heroicons-clipboard-document-check',
				color: 'primary',
			});

			setTimeout(() => {
				isCopied.value = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);

			// Add error toast
			toast.add({
				title: 'Copy failed',
				description: 'Failed to copy modelfile content',
				icon: 'i-heroicons-exclamation-triangle',
				color: 'error',
			});
		}
	}
};

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
	<div class="pb-2">
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

		<div
			v-else-if="modelDetails"
			class="relative">
			<ScrollArea
				max-height="400px"
				class="bg-[var(--ui-bg-muted)] border border-[var(--ui-border)]"
				:class="radiusClasses">
				<pre class="text-sm p-2 whitespace-pre-wrap break-words font-mono">{{ modelDetails.modelfile }}</pre>
			</ScrollArea>
			<UButton
				size="xl"
				color="primary"
				variant="solid"
				square
				:icon="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
				class="absolute bottom-2 right-3 z-10 rounded-full opacity-80"
				@click="copyToClipboard" />
		</div>
	</div>
</template>
