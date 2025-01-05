<template>
	<BaseLayout>
		<!-- <template #header>
			<h1>HEADER</h1>
		</template> -->
		<template #default>
			<!-- todo: wrap in one accordion -->
			<SettingsDarkMode />
			<SettingsThemeSelector />
			<SettingsNeutralSelector />
			<SettingsBorderSelector />
			<!-- todo: wrap in one accordion -->
		</template>
		<!-- <template #footer>
			<h1>FOOTER</h1>
		</template> -->
	</BaseLayout>
</template>
