import { useLocalStorage } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useColorMode, useAppConfig } from '#imports';
import { defineStore } from 'pinia';

interface ThemeColors {
	primary: string;
	neutral: string;
}

interface SettingsState {
	sidebarOpen: boolean;
	colorMode: 'light' | 'dark';
	theme: keyof typeof themeColorMap;
}

const themeColorMap = {
	red: 'rose',
	blue: 'blue',
	green: 'green',
	yellow: 'yellow',
	purple: 'purple',
	pink: 'pink',
	indigo: 'indigo',
	neutral: 'gray'
} as const;

export const useSettingsStore = defineStore('settings', () => {
	const colorMode = useColorMode();
	const appConfig = useAppConfig();

	const settings = useLocalStorage<SettingsState>('app:settings', {
		sidebarOpen: true,
		colorMode: colorMode.preference as SettingsState['colorMode'],
		theme: 'red'
	});

	const initializeSettings = () => {
		colorMode.preference = settings.value.colorMode;
		updateThemeColors(settings.value.theme);
	};

	const updateThemeColors = (theme: SettingsState['theme']): void => {
		const colors: ThemeColors = {
			primary: themeColorMap[theme],
			neutral: 'gray'
		};
		appConfig.ui.colors = colors;
	};

	// Computed state
	const sidebarOpen = computed(() => settings.value.sidebarOpen);
	const isDarkMode = computed(() => settings.value.colorMode === 'dark');
	const currentTheme = computed(() => settings.value.theme);

	// Actions
	const toggleSidebar = () => {
		settings.value.sidebarOpen = !settings.value.sidebarOpen;
	};

	const setColorMode = (mode: SettingsState['colorMode']) => {
		settings.value.colorMode = mode;
		colorMode.preference = mode;
	};

	const setTheme = (theme: SettingsState['theme']) => {
		settings.value.theme = theme;
		updateThemeColors(theme);
	};

	// Initialize settings
	initializeSettings();

	// Watch system color mode changes
	watch(
		() => colorMode.value,
		(newMode) => {
			if (newMode === 'light' || newMode === 'dark') {
				settings.value.colorMode = newMode;
			}
		}
	);

	return {
		sidebarOpen,
		isDarkMode,
		currentTheme,
		toggleSidebar,
		setColorMode,
		setTheme
	};
});

