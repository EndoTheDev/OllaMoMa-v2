<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';
import { ref, watch } from 'vue';
const settingsStore = useSettingsStore();
const { radiusClasses } = useUIUtils();

const currentHost = ref(settingsStore.ollamaHost);
const isDirty = ref(false);

watch(
	() => settingsStore.ollamaHost,
	(newValue) => {
		currentHost.value = newValue;
		isDirty.value = false;
	}
);

const updateHost = (value: string | number) => {
	if (typeof value === 'string') {
		currentHost.value = value;
		isDirty.value = currentHost.value !== settingsStore.ollamaHost;
	}
};

const applyChanges = () => {
	settingsStore.setOllamaHost(currentHost.value);
	isDirty.value = false;
};

const revertChanges = () => {
	currentHost.value = settingsStore.ollamaHost;
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
			<h3 class="font-medium">Ollama Host</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Set your Ollama host URL (default: 127.0.0.1)</p>
		</div>
		<div class="flex items-center gap-2">
			<UInput
				:model-value="currentHost"
				placeholder="127.0.0.1"
				@update:model-value="updateHost"
				:ui="{
					base: 'w-full sm:w-64',
				}" />
			<UButton
				color="primary"
				variant="solid"
				icon="i-heroicons-check"
				size="sm"
				:disabled="!isDirty"
				@click="applyChanges" />
			<UButton
				color="neutral"
				variant="ghost"
				icon="i-heroicons-arrow-path"
				size="sm"
				:disabled="!isDirty"
				@click="revertChanges" />
		</div>
	</div>
</template>
