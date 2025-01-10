<script setup lang="ts">
import DarkMode from '~/components/settings/appearance/DarkMode.vue';
import ThemeSelector from '~/components/settings/appearance/ThemeSelector.vue';
import NeutralSelector from '~/components/settings/appearance/NeutralSelector.vue';
import BorderSelector from '~/components/settings/appearance/BorderSelector.vue';
import OllamaURL from '~/components/settings/connection/OllamaURL.vue';
import OllamaPort from '~/components/settings/connection/OllamaPort.vue';
import ResetSettings from '~/components/settings/ResetSettings.vue';
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center py-2.5 px-2 h-full">
				<h1 class="text-[var(--ui-text)]">Settings</h1>
			</div>
		</template>
		<template #default>
			<div class="flex flex-col gap-1 py-1">
				<!-- todo: wrap in one accordion -->
				<DarkMode />
				<ThemeSelector />
				<NeutralSelector />
				<BorderSelector />
				<!-- todo: wrap in one accordion -->
				<OllamaURL />
				<OllamaPort />
				<ResetSettings />
			</div>
		</template>
		<template #footer>
			<div class="text-xs flex items-center justify-center h-12">
				<div class="flex items-center gap-1">
					<span>Made with</span>
					<UIcon
						name="i-heroicons-heart-solid"
						class="w-4 h-4 text-[var(--ui-primary)]" />
					<span>by EndoTheDev</span>
				</div>
			</div>
		</template>
	</BaseLayout>
</template>
