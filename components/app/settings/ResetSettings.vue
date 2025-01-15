<script setup lang="ts">
import ConfirmReset from '~/components/app/settings/actions/ConfirmReset.vue';

const settings = useSettingsStore();
const modal = useModal();
const { radiusClasses } = useUIUtils();

const showResetConfirmation = () => {
	modal.open(ConfirmReset, {
		onConfirm: () => {
			settings.resetSettings();
		},
	});
};
</script>

<template>
	<div :class="['flex items-center justify-between p-4 border border-[var(--ui-border)]', radiusClasses]">
		<div>
			<h3 class="font-medium">Reset Settings</h3>
			<p class="text-sm text-[var(--ui-text-muted)]">Reset all settings to their default values</p>
		</div>
		<UButton
			color="error"
			variant="ghost"
			icon="i-heroicons-arrow-path"
			@click="showResetConfirmation">
			Reset
		</UButton>
	</div>
</template>
