<script setup lang="ts"></script>

<template>
	<div class="flex flex-col min-h-screen max-w-3xl w-full md:border-x md:border-[var(--ui-border)] shadow-sm">
		<div class="h-12">
			<slot name="header" />
		</div>
		<div class="flex-1 border-y border-[var(--ui-border)] overflow-hidden">
			<slot />
		</div>
		<div>
			<slot name="footer" />
		</div>
	</div>
</template>
