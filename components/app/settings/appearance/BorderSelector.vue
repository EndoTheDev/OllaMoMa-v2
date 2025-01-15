<script setup lang="ts">
const settingsStore = useSettingsStore();
const { radiusClasses } = useUIUtils();

// Tooltip configuration
const tooltipContent = {
	side: 'bottom',
	align: 'center',
	sideOffset: 4,
} as const;

const tooltipUI = {
	content:
		'flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-7 px-2 py-1 text-xs select-none',
	text: 'truncate font-medium',
} as const;
</script>

<template>
	<div
		:class="[
			'flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-[var(--ui-border)] gap-4',
			radiusClasses,
		]">
		<div>
			<h3 class="font-medium">Border</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Choose your preferred border radius</p>
		</div>
		<URadioGroup
			:model-value="settingsStore.currentRadius"
			:items="[
				{ value: 'none', label: '0' },
				{ value: 'xs', label: '0.125' },
				{ value: 'sm', label: '0.25' },
				{ value: 'md', label: '0.375' },
				{ value: 'lg', label: '0.5' },
			]"
			:ui="{
				wrapper: 'inline-flex flex-wrap gap-4',
				container: 'hidden',
				base: 'flex',
			}"
			orientation="horizontal"
			@update:model-value="(value: string) => settingsStore.setRadius(value as 'none' | 'xs' | 'sm' | 'md' | 'lg')">
			<template #label="{ item, modelValue }">
				<UTooltip
					:text="`${item.label}rem`"
					:content="tooltipContent"
					:ui="tooltipUI">
					<div
						class="w-6 h-6 bg-[var(--ui-primary)] transition-all duration-200 ring-2 ring-offset-2 dark:ring-offset-gray-900 hover:scale-110"
						:class="[
							modelValue === item.value ? 'ring-gray-400 dark:ring-gray-500' : 'ring-transparent',
							item.value === 'none'
								? 'rounded-none'
								: item.value === 'xs'
									? 'rounded'
									: item.value === 'sm'
										? 'rounded-md'
										: item.value === 'md'
											? 'rounded-lg'
											: 'rounded-xl',
						]" />
				</UTooltip>
			</template>
		</URadioGroup>
	</div>
</template>
