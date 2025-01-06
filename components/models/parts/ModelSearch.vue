<script setup lang="ts">
defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const handleInput = (value: string | number) => {
	emit('update:modelValue', String(value));
};
</script>

<template>
	<div class="w-full">
		<UInput
			:model-value="modelValue"
			placeholder="Search models..."
			variant="none"
			class="w-full"
			:ui="{
				base: 'h-10 ',
				trailing: 'pe-1',
			}"
			@update:model-value="handleInput">
			<template #trailing>
				<UIcon
					name="i-lucide-search"
					class="text-[var(--ui-text-dimmed)]" />
			</template>
		</UInput>
	</div>
</template>
