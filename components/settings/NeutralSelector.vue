<script setup lang="ts">
const settingsStore = useSettingsStore();
</script>

<template>
	<div
		class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg border-[var(--ui-border)] gap-4">
		<div>
			<h3 class="font-medium">Neutral</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Choose your preferred neutral color</p>
		</div>
		<URadioGroup
			:model-value="settingsStore.currentNeutral"
			orientation="horizontal"
			:items="[
				{ value: 'slate', class: 'bg-slate-500' },
				{ value: 'gray', class: 'bg-gray-500' },
				{ value: 'zinc', class: 'bg-zinc-500' },
				{ value: 'neutral', class: 'bg-neutral-500' },
				{ value: 'stone', class: 'bg-stone-500' },
			]"
			@update:model-value="
				(value: string) => settingsStore.setNeutral(value as 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone')
			"
			:ui="{
				wrapper: 'inline-flex flex-wrap gap-4',
				container: 'hidden',
				base: 'flex',
			}">
			<template #label="{ item, modelValue }">
				<div
					class="w-6 h-6 rounded-full transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-900 hover:scale-110"
					:class="[
						item.class,
						modelValue === item.value ? 'ring-gray-400 dark:ring-gray-500' : 'ring-transparent',
					]" />
			</template>
		</URadioGroup>
	</div>
</template>
