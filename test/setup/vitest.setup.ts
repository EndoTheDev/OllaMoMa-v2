import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Setup Vue Test Utils global config
config.global.stubs = {
	// Stub out Nuxt components
	NuxtLink: true,
	NuxtImg: true,
	NuxtPage: true,
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});
