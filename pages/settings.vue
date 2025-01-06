<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center p-5 h-full">
				<h1>Settings</h1>
			</div>
		</template>
		<template #default>
			<div class="space-y-1">
				<!-- todo: wrap in one accordion -->
				<SettingsDarkMode />
				<SettingsThemeSelector />
				<SettingsNeutralSelector />
				<SettingsBorderSelector />
				<!-- todo: wrap in one accordion -->
				<SettingsOllamaURL />
				<SettingsOllamaPort />
				<!-- todo: wrap in one accordion -->
				<SettingsResetSettings />
			</div>
		</template>
		<template #footer>
			<div class="text-xs flex items-center justify-center h-full">
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
