import { useLocalStorage } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useColorMode, useAppConfig } from '#imports';
import { defineStore } from 'pinia';
import type { SettingsState, ThemeColors, ThemeOption, NeutralOption, RadiusOption } from '~/types/settings';
import { themeColorMap, neutralColorMap } from '~/types/settings';

export const useSettingsStore = defineStore('settings', () => {
	const colorMode = useColorMode();
	const appConfig = useAppConfig();

	// Default settings
	const defaultSettings: SettingsState = {
		sidebarOpen: true,
		colorMode: 'dark',
		theme: 'green',
		neutral: 'neutral',
		radius: 'md',
		ollamaHost: '127.0.0.1',
		ollamaPort: 11434,
	};

	// State
	const settings = useLocalStorage<SettingsState>('app:settings', defaultSettings);

	// Computed
	const sidebarOpen = computed(() => settings.value.sidebarOpen);
	const isDarkMode = computed(() => settings.value.colorMode === 'dark');
	const currentTheme = computed(() => settings.value.theme);
	const currentNeutral = computed(() => settings.value.neutral);
	const currentRadius = computed(() => settings.value.radius);
	const ollamaHost = computed(() => settings.value.ollamaHost);
	const ollamaPort = computed(() => settings.value.ollamaPort);

	// Actions
	function updateThemeColors(
		theme: ThemeOption = settings.value.theme,
		neutral: NeutralOption = settings.value.neutral
	): void {
		const colors: ThemeColors = {
			primary: themeColorMap[theme],
			neutral: neutralColorMap[neutral],
			error: 'red',
			warning: 'yellow',
			success: 'green',
			info: 'blue',
			secondary: 'gray',
		};
		appConfig.ui.colors = colors;
	}

	function toggleSidebar(): void {
		settings.value.sidebarOpen = !settings.value.sidebarOpen;
	}

	function setColorMode(mode: SettingsState['colorMode']): void {
		settings.value.colorMode = mode;
		colorMode.preference = mode;
	}

	function setTheme(theme: ThemeOption): void {
		settings.value.theme = theme;
		updateThemeColors(theme);
	}

	function setNeutral(neutral: NeutralOption): void {
		settings.value.neutral = neutral;
		updateThemeColors(settings.value.theme, neutral);
	}

	function setRadius(radius: RadiusOption): void {
		settings.value.radius = radius;
	}

	function setOllamaHost(host: string): void {
		settings.value.ollamaHost = host;
	}

	function setOllamaPort(port: number): void {
		settings.value.ollamaPort = port;
	}

	function resetSettings(): void {
		settings.value = { ...defaultSettings };
		colorMode.preference = defaultSettings.colorMode;
		updateThemeColors(defaultSettings.theme, defaultSettings.neutral);
	}

	// Initialize settings
	function initializeSettings(): void {
		colorMode.preference = settings.value.colorMode;
		updateThemeColors(settings.value.theme);
	}
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
		// State exports
		sidebarOpen,
		isDarkMode,
		currentTheme,
		currentNeutral,
		currentRadius,
		ollamaHost,
		ollamaPort,

		// Action exports
		toggleSidebar,
		setColorMode,
		setTheme,
		setNeutral,
		setRadius,
		setOllamaHost,
		setOllamaPort,
		resetSettings,
	};
});
