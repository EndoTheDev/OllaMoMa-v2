import { ref } from 'vue';

export const useColorMode = () => ({
	value: 'light',
	preference: 'light',
});

export const useAppConfig = () => ({
	ui: {
		primary: 'green',
		gray: 'cool',
	},
});

export const useState = <T>(key: string, init: () => T) => {
	const state = ref(init());
	return state;
};
