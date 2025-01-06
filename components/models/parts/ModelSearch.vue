<script setup lang="ts"></script>

<template>
	<div class="w-full">
		<UInput
			placeholder="Search models..."
			variant="none"
			class="w-full"
			:ui="{
				base: 'h-10 ',
				trailing: 'pe-1',
			}">
			<template #trailing>
				<UIcon
					name="i-lucide-search"
					class="text-[var(--ui-text-dimmed)]" />
			</template>
		</UInput>
	</div>
</template>
