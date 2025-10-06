<script setup lang="ts">
const { fadeTransition, radiusClasses } = useUIUtils();

interface Props {
	showLabels?: boolean;
	showTooltips?: boolean;
}

withDefaults(defineProps<Props>(), {
	showLabels: false,
	showTooltips: false,
});

// Tooltip configuration
const tooltipContent = {
	side: 'right',
	align: 'center',
	sideOffset: 8,
	alignOffset: 0,
} as const;

// Custom UI configuration for larger tooltips
const tooltipUI = {
	content:
		'flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-8 px-3 py-1 text-sm select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
	text: 'truncate font-medium',
} as const;

const navItems = [
	{
		to: '/',
		icon: 'i-heroicons-chat-bubble-left-right',
		label: 'Chat',
	},
	{
		to: '/models',
		icon: 'i-heroicons-circle-stack',
		label: 'Models',
	},
	{
		to: '/modelfile',
		icon: 'i-heroicons-document-text',
		label: 'Modelfile',
	},
];
</script>

<template>
	<template
		v-for="item in navItems"
		:key="item.to">
		<template v-if="showTooltips">
			<UTooltip
				:text="item.label"
				:content="tooltipContent"
				:ui="tooltipUI">
				<UButton
					:to="item.to"
					:class="['h-10 flex w-full justify-center', radiusClasses]">
					<UIcon
						:name="item.icon"
						class="fixed left-4 w-6 h-6" />
				</UButton>
			</UTooltip>
		</template>
		<template v-else>
			<UButton
				:to="item.to"
				:class="['h-10 flex w-full justify-center', radiusClasses]">
				<UIcon
					:name="item.icon"
					class="fixed left-4 w-6 h-6" />
				<Transition v-bind="fadeTransition">
					<span v-if="showLabels">{{ item.label }}</span>
				</Transition>
			</UButton>
		</template>
	</template>
</template>
