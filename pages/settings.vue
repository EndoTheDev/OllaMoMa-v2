<script setup lang="ts">
import DarkMode from '~/components/settings/DarkMode.vue';
</script>

<template>
	<BaseLayout>
		<template #header>
			<h1>Settings</h1>
		</template>
		<template #default>
			<DarkMode />
		</template>
		<template #footer>
			<h1>Footer</h1>
		</template>
	</BaseLayout>
</template>
