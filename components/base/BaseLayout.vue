<script setup lang="ts"></script>

<template>
	<div class="flex flex-col h-screen max-w-3xl w-full md:border-x md:border-[var(--ui-border)] shadow-sm">
		<header class="flex-none">
			<slot name="header" />
		</header>
		<main class="flex-1 min-h-0 border-y border-[var(--ui-border)] overflow-hidden">
			<div class="flex flex-col h-full">
				<UiScrollArea class="flex-1">
					<div class="pl-1 pr-3">
						<slot />
					</div>
				</UiScrollArea>
			</div>
		</main>
		<footer class="flex-none">
			<slot name="footer" />
		</footer>
	</div>
</template>
