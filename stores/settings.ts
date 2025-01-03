import { useLocalStorage } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useColorMode } from '#imports';

interface SettingsState {
	sidebarOpen: boolean;
	colorMode: 'light' | 'dark';
}

const STORAGE_KEY = 'app:settings';

export const useSettingsStore = defineStore('settings', () => {
	const colorMode = useColorMode();
	
	const settings = useLocalStorage<SettingsState>(STORAGE_KEY, {
		sidebarOpen: true,
		colorMode: colorMode.value as 'light' | 'dark',
	});

	onMounted(() => {
		colorMode.preference = settings.value.colorMode;
	});

	watch(() => colorMode.value, (newMode) => {
		if (newMode === 'light' || newMode === 'dark') {
			settings.value.colorMode = newMode;
		}
	});

	const sidebarOpen = computed(() => settings.value.sidebarOpen);
	const isDarkMode = computed(() => settings.value.colorMode === 'dark');

	function toggleSidebar() {
		settings.value.sidebarOpen = !settings.value.sidebarOpen;
	}

	function setColorMode(mode: 'light' | 'dark') {
		settings.value.colorMode = mode;
		colorMode.preference = mode;
	}

	return {
		sidebarOpen,
		isDarkMode,
		toggleSidebar,
		setColorMode,
	};
});

