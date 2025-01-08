/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./test/setup/vitest.setup.ts'],
		include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
	},
	resolve: {
		alias: {
			'~': fileURLToPath(new URL('./', import.meta.url)),
			'@': fileURLToPath(new URL('./', import.meta.url)),
			'#imports': fileURLToPath(new URL('./test/setup/nuxt-imports.ts', import.meta.url)),
			'#app': fileURLToPath(new URL('./test/setup/nuxt-app.ts', import.meta.url)),
		},
	},
});
