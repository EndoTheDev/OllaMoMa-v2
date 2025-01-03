<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
const settingsStore = useSettingsStore();
</script>

<template>
	<div class="flex items-center justify-between p-4 border rounded-lg border-[var(--ui-border)]">
		<div>
			<h3 class="font-medium">Dark Mode</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
		</div>
		<USwitch
			:model-value="settingsStore.isDarkMode"
			@update:model-value="settingsStore.setColorMode($event ? 'dark' : 'light')" />
	</div>
</template>
