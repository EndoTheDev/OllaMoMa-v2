<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
const settingsStore = useSettingsStore();
const isSmallViewport = useMediaQuery('(min-width: 768px)');

const fadeTransition = {
	enterActiveClass: 'transition duration-300 ease-out',
	enterFromClass: 'opacity-0',
	enterToClass: 'opacity-100',
	leaveActiveClass: 'transition duration-200 ease-in',
	leaveFromClass: 'opacity-100',
	leaveToClass: 'opacity-0',
};
</script>

<template>
	<div
		:class="[
			'h-screen flex flex-col gap-1 p-1 bg-[var(--bg)] z-50 border-r border-[var(--ui-border)]',
			'transition-all duration-300',
			settingsStore.sidebarOpen ? 'w-56' : 'w-14',
		]">
		<UButton
			@click="settingsStore.toggleSidebar"
			class="h-10 flex w-full justify-center">
			<UIcon
				name="i-heroicons-bars-3"
				class="fixed left-4 w-6 h-6" />
			<Transition v-bind="fadeTransition">
				<span v-if="settingsStore.sidebarOpen">Sidebar</span>
			</Transition>
		</UButton>
		<div class="flex-1 flex flex-col gap-1 py-1 border-y border-[var(--ui-border-accented)]">
			<slot />
		</div>
		<div>
			<slot name="footer" />
		</div>
	</div>
	<!-- OVERLAY -->
	<Transition v-bind="fadeTransition">
		<div
			@click="settingsStore.toggleSidebar"
			v-show="settingsStore.sidebarOpen && !isSmallViewport"
			class="fixed w-full h-full bg-black/50 backdrop-blur-sm z-40" />
	</Transition>
</template>
