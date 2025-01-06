<script setup lang="ts">
defineProps<{
	search: string;
}>();

const emit = defineEmits<{
	'update:search': [value: string];
}>();
</script>

<template>
	<div class="flex items-center h-full gap-2 p-2">
		<ModelsPartsModelSearch
			:model-value="search"
			@update:model-value="(value: string) => emit('update:search', value)" />
		<ModelsPartsModelSort />
	</div>
</template>
