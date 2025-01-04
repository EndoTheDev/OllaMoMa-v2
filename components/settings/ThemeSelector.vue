<script setup lang="ts">
const settingsStore = useSettingsStore();
</script>

<template>
	<div
		class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg border-[var(--ui-border)] gap-4">
		<div>
			<h3 class="font-medium">Theme Color</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Choose your preferred theme color</p>
		</div>
		<URadioGroup
			:model-value="settingsStore.currentTheme"
			orientation="horizontal"
			:items="[
				{ value: 'blue', class: 'bg-blue-500' },
				{ value: 'green', class: 'bg-green-500' },
				{ value: 'red', class: 'bg-red-500' },
				{ value: 'yellow', class: 'bg-yellow-500' },
				{ value: 'purple', class: 'bg-purple-500' },
				{ value: 'pink', class: 'bg-pink-500' },
				{ value: 'indigo', class: 'bg-indigo-500' },
				{ value: 'neutral', class: 'bg-neutral-500' },
			]"
			@update:model-value="
				(value: string) =>
					settingsStore.setTheme(
						value as 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'pink' | 'indigo' | 'neutral'
					)
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
