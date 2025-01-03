export const useSettingsStore = defineStore('settings', {
	state: () => ({
		sidebarOpen: true,
		
	}),
	actions: {
		toggleSidebar() {
			this.sidebarOpen = !this.sidebarOpen;
		},
	},
});

