import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useSettingsStore } from '~/stores/settings';

// Mock the useColorMode composable
vi.mock('#imports', () => ({
	useColorMode: () => ({
		value: 'dark',
		preference: 'dark',
	}),
	useAppConfig: () => ({
		ui: {
			colors: {},
		},
	}),
}));

describe('settings store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		// Clear localStorage before each test
		localStorage.clear();
	});

	describe('initial state', () => {
		it('should have default values', () => {
			const store = useSettingsStore();
			expect(store.sidebarOpen).toBe(true);
			expect(store.isDarkMode).toBe(true);
			expect(store.currentTheme).toBe('green');
			expect(store.currentNeutral).toBe('neutral');
			expect(store.currentRadius).toBe('md');
			expect(store.ollamaHost).toBe('127.0.0.1');
			expect(store.ollamaPort).toBe(11434);
		});
	});

	describe('actions', () => {
		it('should toggle sidebar', () => {
			const store = useSettingsStore();
			expect(store.sidebarOpen).toBe(true);
			store.toggleSidebar();
			expect(store.sidebarOpen).toBe(false);
			store.toggleSidebar();
			expect(store.sidebarOpen).toBe(true);
		});

		it('should set color mode', () => {
			const store = useSettingsStore();
			store.setColorMode('light');
			expect(store.isDarkMode).toBe(false);
			store.setColorMode('dark');
			expect(store.isDarkMode).toBe(true);
		});

		it('should set theme', () => {
			const store = useSettingsStore();
			store.setTheme('blue');
			expect(store.currentTheme).toBe('blue');
			store.setTheme('red');
			expect(store.currentTheme).toBe('red');
		});

		it('should set neutral', () => {
			const store = useSettingsStore();
			store.setNeutral('slate');
			expect(store.currentNeutral).toBe('slate');
			store.setNeutral('zinc');
			expect(store.currentNeutral).toBe('zinc');
		});

		it('should set radius', () => {
			const store = useSettingsStore();
			store.setRadius('none');
			expect(store.currentRadius).toBe('none');
			store.setRadius('lg');
			expect(store.currentRadius).toBe('lg');
		});

		it('should set Ollama host', () => {
			const store = useSettingsStore();
			store.setOllamaHost('localhost');
			expect(store.ollamaHost).toBe('localhost');
			store.setOllamaHost('192.168.1.100');
			expect(store.ollamaHost).toBe('192.168.1.100');
		});

		it('should set Ollama port', () => {
			const store = useSettingsStore();
			store.setOllamaPort(8080);
			expect(store.ollamaPort).toBe(8080);
			store.setOllamaPort(3000);
			expect(store.ollamaPort).toBe(3000);
		});
	});

	describe('persistence', () => {
		it('should persist settings in localStorage', () => {
			const store = useSettingsStore();

			// Modify settings
			store.setColorMode('light');
			store.setTheme('blue');
			store.setNeutral('slate');

			// Create new store instance to test persistence
			const newStore = useSettingsStore();
			expect(newStore.isDarkMode).toBe(false);
			expect(newStore.currentTheme).toBe('blue');
			expect(newStore.currentNeutral).toBe('slate');
		});
	});

	describe('color mode', () => {
		it('should initialize with dark mode', () => {
			const store = useSettingsStore();
			expect(store.isDarkMode).toBe(true);
		});

		it('should handle color mode changes', () => {
			const store = useSettingsStore();
			store.setColorMode('light');
			expect(store.isDarkMode).toBe(false);
		});
	});
});
