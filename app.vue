<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';
const settingsStore = useSettingsStore();
const isSmallViewport = useMediaQuery('(min-width: 768px)');

const fadeTransition = {
	enterActiveClass: 'transition duration-300 ease-out',
	enterFromClass: 'opacity-0',
	enterToClass: 'opacity-100',
	leaveActiveClass: 'transition duration-200 ease-in',
	leaveFromClass: 'opacity-100',
	leaveToClass: 'opacity-0',
};
</script>

<template>
	<UApp>
		<div class="flex">
			<AppSidebar>
				<template #default>
					<UButton
						:to="'/'"
						class="h-10 flex w-full justify-center">
						<UIcon
							name="i-heroicons-chat-bubble-left-right"
							class="fixed left-4 w-6 h-6" />
						<Transition v-bind="fadeTransition">
							<span v-if="settingsStore.sidebarOpen">Chat</span>
						</Transition>
					</UButton>
				</template>
				<template #footer>
					<UButton
						:to="'/settings'"
						class="h-10 flex w-full justify-center">
						<UIcon
							name="i-heroicons-cog-6-tooth"
							class="fixed left-4 w-6 h-6" />
						<Transition v-bind="fadeTransition">
							<span v-if="settingsStore.sidebarOpen">Settings</span>
						</Transition>
					</UButton>
				</template>
			</AppSidebar>
			<!-- CONTENT -->
			<div
				class="fixed pl-14 transition-all duration-300"
				:class="{ 'pl-56': isSmallViewport && settingsStore.sidebarOpen, 'pl-14': !settingsStore.sidebarOpen }">
				<NuxtPage />
			</div>
		</div>
	</UApp>
</template>
