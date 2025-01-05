<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';
import { ref, watch } from 'vue';
const settingsStore = useSettingsStore();
const { radiusClasses } = useUIUtils();

const currentPort = ref(settingsStore.ollamaPort);
const isDirty = ref(false);

watch(
	() => settingsStore.ollamaPort,
	(newValue) => {
		currentPort.value = newValue;
		isDirty.value = false;
	}
);

const updatePort = (value: string | number) => {
	const port = typeof value === 'string' ? parseInt(value, 10) : value;
	if (!isNaN(port)) {
		currentPort.value = port;
		isDirty.value = currentPort.value !== settingsStore.ollamaPort;
	}
};

const applyChanges = () => {
	settingsStore.setOllamaPort(currentPort.value);
	isDirty.value = false;
};

const revertChanges = () => {
	currentPort.value = settingsStore.ollamaPort;
	isDirty.value = false;
};
</script>

<template>
	<div
		:class="[
			'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[var(--ui-border)] gap-4',
			radiusClasses,
		]">
		<div>
			<h3 class="font-medium">Ollama Port</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Set your Ollama port number (default: 11434)</p>
		</div>
		<div class="flex items-center gap-2">
			<UInput
				type="number"
				:model-value="currentPort"
				placeholder="11434"
				@update:model-value="updatePort"
				:ui="{
					base: 'w-full sm:w-64',
				}" />
			<UButton
				color="neutral"
				variant="ghost"
				icon="i-heroicons-arrow-path"
				size="sm"
				:disabled="!isDirty"
				@click="revertChanges" />
			<UButton
				color="primary"
				variant="solid"
				icon="i-heroicons-check"
				size="sm"
				:disabled="!isDirty"
				@click="applyChanges" />
		</div>
	</div>
</template>
