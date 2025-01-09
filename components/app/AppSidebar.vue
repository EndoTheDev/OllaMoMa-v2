<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';
import type { VNode } from 'vue';

const settingsStore = useSettingsStore();
const isSmallViewport = useMediaQuery('(min-width: 768px)');
const { fadeTransition, radiusClasses } = useUIUtils();

defineSlots<{
	default?: () => VNode | VNode[];
	footer?: () => VNode | VNode[];
}>();

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
</script>

<template>
	<div
		:class="[
			'h-screen flex flex-col gap-1 p-1 bg-[var(--ui-bg)] z-50 border-r border-[var(--ui-border)]',
			'transition-[width] duration-300 drop-shadow-sm',
			settingsStore.sidebarOpen ? 'w-56' : 'w-14',
		]">
		<UTooltip
			:text="settingsStore.sidebarOpen ? '' : 'Toggle Sidebar'"
			:content="tooltipContent"
			:ui="tooltipUI">
			<UButton
				:class="['h-10 flex w-full justify-center', radiusClasses]"
				@click="settingsStore.toggleSidebar">
				<UIcon
					name="i-heroicons-bars-3"
					class="fixed left-4 w-6 h-6" />
				<Transition v-bind="fadeTransition">
					<span v-if="settingsStore.sidebarOpen">Sidebar</span>
				</Transition>
			</UButton>
		</UTooltip>
		<div class="flex-1 flex flex-col gap-1 py-1 border-y border-[var(--ui-border-accented)]">
			<slot
				v-if="settingsStore.sidebarOpen"
				name="default" />
			<template v-else>
				<UTooltip
					text="Chat"
					:content="tooltipContent"
					:ui="tooltipUI">
					<UButton
						:to="'/'"
						:class="['h-10 flex w-full justify-center', radiusClasses]">
						<UIcon
							name="i-heroicons-chat-bubble-left-right"
							class="fixed left-4 w-6 h-6" />
					</UButton>
				</UTooltip>
				<UTooltip
					text="Models"
					:content="tooltipContent"
					:ui="tooltipUI">
					<UButton
						:to="'/models'"
						:class="['h-10 flex w-full justify-center', radiusClasses]">
						<UIcon
							name="i-heroicons-circle-stack"
							class="fixed left-4 w-6 h-6" />
					</UButton>
				</UTooltip>
			</template>
		</div>
		<div>
			<slot
				v-if="settingsStore.sidebarOpen"
				name="footer" />
			<template v-else>
				<UTooltip
					text="Settings"
					:content="tooltipContent"
					:ui="tooltipUI">
					<UButton
						:to="'/settings'"
						:class="['h-10 flex w-full justify-center', radiusClasses]">
						<UIcon
							name="i-heroicons-cog-6-tooth"
							class="fixed left-4 w-6 h-6" />
					</UButton>
				</UTooltip>
			</template>
		</div>
	</div>
	<!-- OVERLAY -->
	<Transition v-bind="fadeTransition">
		<div
			v-show="settingsStore.sidebarOpen && !isSmallViewport"
			class="fixed w-full h-full bg-[var(--ui-bg)]/50 backdrop-blur-sm z-40"
			@click="settingsStore.toggleSidebar" />
	</Transition>
</template>
