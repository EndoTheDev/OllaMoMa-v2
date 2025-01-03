import { useLocalStorage } from '@vueuse/core';
import { computed } from 'vue';

interface SettingsState {
	sidebarOpen: boolean;
}

const STORAGE_KEY = 'app:settings';

export const useSettingsStore = defineStore('settings', () => {
	const settings = useLocalStorage<SettingsState>(STORAGE_KEY, {
		sidebarOpen: true,
	}, {
		writeDefaults: false
	});

	const sidebarOpen = computed(() => settings.value.sidebarOpen);

	function toggleSidebar() {
		settings.value.sidebarOpen = !settings.value.sidebarOpen;
	}

	return {
		sidebarOpen,
		toggleSidebar,
	};
});

