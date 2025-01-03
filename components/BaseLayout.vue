<script setup lang="ts"></script>

<template>
	<div class="flex flex-col min-h-screen max-w-2xl w-full md:border-x md:border-[var(--ui-border)]">
		<div class="h-12">
			<slot name="header" />
		</div>
		<div class="flex-1 border-y border-[var(--ui-border)] overflow-hidden">
			<ScrollArea class="h-[calc(100vh-98px)]">
				<div class="p-2">
					<slot />
				</div>
			</ScrollArea>
		</div>
		<div class="h-12">
			<slot name="footer" />
		</div>
	</div>
</template>
