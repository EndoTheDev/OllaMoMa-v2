<script setup lang="ts">
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
		<ClientOnly>
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
					class="fixed w-full flex justify-center transition-all duration-300 pl-14"
					:class="[isSmallViewport && settingsStore.sidebarOpen ? 'md:pl-56' : 'md:pl-14']">
					<NuxtPage />
				</div>
			</div>
		</ClientOnly>
	</UApp>
</template>
