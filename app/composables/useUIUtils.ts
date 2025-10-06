import { useSettingsStore } from '~/stores/settings';

export const useUIUtils = () => {
	const settingsStore = useSettingsStore();

	const fadeTransition = {
		enterActiveClass: 'transition duration-300 ease-out',
		enterFromClass: 'opacity-0',
		enterToClass: 'opacity-100',
		leaveActiveClass: 'transition duration-200 ease-in',
		leaveFromClass: 'opacity-100',
		leaveToClass: 'opacity-0',
	};

	const radiusClasses = computed(() => {
		switch (settingsStore.currentRadius) {
			case 'none':
				return 'rounded-none';
			case 'xs':
				return 'rounded';
			case 'sm':
				return 'rounded-md';
			case 'md':
				return 'rounded-lg';
			case 'lg':
				return 'rounded-xl';
			default:
				return 'rounded-lg';
		}
	});

	return {
		fadeTransition,
		radiusClasses,
	};
};
