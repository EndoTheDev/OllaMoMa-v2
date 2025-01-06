// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/eslint'],
	css: ['~/assets/main.css'],
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	ui: {
		theme: {
			colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral'],
		},
	},
});
