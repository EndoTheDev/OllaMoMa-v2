<script setup lang="ts">
import { useOllama } from '~/composables/useOllama';
import { useUtils } from '~/composables/useUtils';

const props = defineProps<{
	modelValue: string;
}>();

const { models, fetchModels, isLoading } = useOllama();
const { formatSize } = useUtils();

interface ModelOption {
	name: string;
	size: number;
	label: string;
}

// Transform models into options with formatted labels
const modelOptions = computed<ModelOption[]>(() =>
	models.value.map((model) => ({
		name: model.name,
		size: model.size,
		label: `${model.name} (${formatSize(model.size)})`,
	}))
);

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

// Use computed for two-way binding
const selectedModel = computed({
	get: () => props.modelValue,
	set: (value) => emit('update:modelValue', value),
});

const searchTerm = ref('');

// Fetch models when component is mounted
onMounted(async () => {
	await fetchModels();
});

// Handle menu open to refresh models
const handleOpen = async () => {
	if (!models.value.length) {
		await fetchModels();
	}
};
</script>

<template>
	<div class="w-full">
		<USelectMenu
			v-model="selectedModel"
			v-model:search-term="searchTerm"
			:items="modelOptions"
			:loading="isLoading"
			label-key="label"
			value-key="name"
			:search-input="{
				class: 'p-1',
				icon: 'i-lucide-search',
				placeholder: 'Search models...',
			}"
			class="w-full"
			placeholder="Select a model"
			color="primary"
			variant="ghost"
			size="lg"
			@update:open="handleOpen">
			<template #leading>
				<UIcon
					name="i-lucide-box"
					class="h-5 w-5 text-[var(--ui-text)]" />
			</template>

			<!-- Custom item template -->
			<template #item="{ item }">
				<div class="flex justify-between items-center w-full">
					<span class="text-[var(--ui-text)] font-medium">
						{{ item.name }}
					</span>
					<span class="text-sm text-[var(--ui-text-muted)]">
						{{ formatSize(item.size) }}
					</span>
				</div>
			</template>
		</USelectMenu>
	</div>
</template>
