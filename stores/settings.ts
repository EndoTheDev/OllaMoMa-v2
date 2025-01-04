import { useLocalStorage } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useColorMode, useAppConfig } from '#imports';
import { defineStore } from 'pinia';

interface ThemeColors {
	primary: string;
	neutral: string;
	error: string;
	warning: string;
	success: string;
	info: string;
	secondary: string;
}

interface SettingsState {
	sidebarOpen: boolean;
	colorMode: 'light' | 'dark';
	theme: keyof typeof themeColorMap;
	neutral: keyof typeof neutralColorMap;
}

const themeColorMap = {
	red: 'red',
	blue: 'blue',
	green: 'green',
	yellow: 'yellow',
	purple: 'purple',
	pink: 'pink',
	indigo: 'indigo',
} as const;

const neutralColorMap = {
	slate: 'slate',
	gray: 'gray',
	zinc: 'zinc',
	neutral: 'neutral',
	stone: 'stone',
} as const;

export const useSettingsStore = defineStore('settings', () => {
	const colorMode = useColorMode();
	const appConfig = useAppConfig();

	const settings = useLocalStorage<SettingsState>('app:settings', {
		sidebarOpen: true,
		colorMode: colorMode.preference as SettingsState['colorMode'],
		theme: 'green',
		neutral: 'neutral'
	});

	const initializeSettings = () => {
		colorMode.preference = settings.value.colorMode;
		updateThemeColors(settings.value.theme);
	};

	const updateThemeColors = (theme: SettingsState['theme'], neutral: SettingsState['neutral'] = settings.value.neutral): void => {
		const colors: ThemeColors = {
			primary: themeColorMap[theme],
			neutral: neutralColorMap[neutral],
			error: 'red',
			warning: 'yellow',
			success: 'green',
			info: 'blue',
			secondary: 'gray'
		};
		appConfig.ui.colors = colors;
	};

	// Computed state
	const sidebarOpen = computed(() => settings.value.sidebarOpen);
	const isDarkMode = computed(() => settings.value.colorMode === 'dark');
	const currentTheme = computed(() => settings.value.theme);
	const currentNeutral = computed(() => settings.value.neutral);

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

	const setNeutral = (neutral: SettingsState['neutral']) => {
		settings.value.neutral = neutral;
		updateThemeColors(settings.value.theme, neutral);
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
		setTheme,
		currentNeutral,
		setNeutral
	};
});

