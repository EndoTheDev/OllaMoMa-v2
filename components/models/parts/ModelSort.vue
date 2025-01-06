<script setup lang="ts"></script>

<template>
	<div>
		<UDropdownMenu
			:items="[
				[
					{
						label: 'Sort by Name',
						icon: 'i-lucide-text',
						onSelect: () => {},
					},
					{
						label: 'Sort by Size',
						icon: 'i-lucide-database',
						onSelect: () => {},
					},
					{
						label: 'Sort by Last Modified',
						icon: 'i-lucide-clock',
						onSelect: () => {},
						active: true,
					},
				],
			]">
			<UButton
				color="neutral"
				variant="ghost"
				icon="i-lucide-sort-desc"
				label="Sort" />
		</UDropdownMenu>
	</div>
</template>
