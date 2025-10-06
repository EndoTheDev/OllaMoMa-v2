<script setup lang="ts">
const settingsStore = useSettingsStore();
const { radiusClasses } = useUIUtils();
</script>

<template>
	<div :class="['flex items-center justify-between p-4 border border-[var(--ui-border)]', radiusClasses]">
		<div>
			<h3 class="font-medium">Dark Mode</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Toggle between light and dark theme</p>
		</div>
		<USwitch
			:model-value="settingsStore.isDarkMode"
			@update:model-value="settingsStore.setColorMode($event ? 'dark' : 'light')" />
	</div>
</template>
