<script setup lang="ts"></script>

<template>
	<div class="flex flex-col min-h-screen max-w-3xl w-full md:border-x md:border-[var(--ui-border)]">
		<div class="h-12">
			<slot name="header" />
		</div>
		<div class="flex-1 border-y border-[var(--ui-border)] overflow-hidden">
			<UiScrollArea class="h-[calc(100vh-98px)]">
				<div class="pl-1 pr-3 py-1 space-y-1">
					<slot />
				</div>
			</UiScrollArea>
		</div>
		<div class="min-h-12">
			<slot name="footer" />
		</div>
	</div>
</template>
