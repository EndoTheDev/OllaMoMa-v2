<script setup lang="ts">
const settingsStore = useSettingsStore();
const isSmallViewport = useMediaQuery('(min-width: 768px)');
const { fadeTransition, radiusClasses } = useUIUtils();
</script>

<template>
	<div
		:class="[
			'h-screen flex flex-col gap-1 p-1 bg-[var(--ui-bg)] z-50 border-r border-[var(--ui-border)]',
			'transition-[width] duration-300',
			settingsStore.sidebarOpen ? 'w-56' : 'w-14',
		]">
		<UButton
			@click="settingsStore.toggleSidebar"
			:class="['h-10 flex w-full justify-center', radiusClasses]">
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
