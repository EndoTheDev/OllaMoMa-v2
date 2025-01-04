<script setup lang="ts">
interface Props {
	/**
	 * The class to apply to the root element
	 */
	class?: string;
	/**
	 * The maximum height of the scroll area
	 */
	maxHeight?: string;
}

defineProps<Props>();

const container = ref<HTMLElement>();
const content = ref<HTMLElement>();
const thumb = ref<HTMLElement>();
const isScrolling = ref(false);
const isDragging = ref(false);
let scrollTimeout: NodeJS.Timeout;
let startY = 0;
let startScrollTop = 0;

onMounted(() => {
	watchEffect(() => {
		if (container.value && content.value && thumb.value) {
			const containerHeight = container.value.clientHeight;
			const contentHeight = content.value.scrollHeight;
			const scrollPercentage = containerHeight / contentHeight;
			const thumbHeight = Math.max(scrollPercentage * containerHeight, 32); // minimum 32px
			thumb.value.style.height = `${thumbHeight}px`;
		}
	});

	// Add scroll event listener
	container.value?.addEventListener('scroll', () => {
		if (container.value && content.value && thumb.value) {
			isScrolling.value = true;
			clearTimeout(scrollTimeout);

			const scrollPercentage =
				container.value.scrollTop / (content.value.scrollHeight - container.value.clientHeight);
			const thumbPosition = scrollPercentage * (container.value.clientHeight - thumb.value.clientHeight);
			thumb.value.style.transform = `translateY(${thumbPosition}px)`;

			scrollTimeout = setTimeout(() => {
				isScrolling.value = false;
			}, 1000);
		}
	});
});

// Add cleanup
onUnmounted(() => {
	clearTimeout(scrollTimeout);
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('mouseup', onMouseUp);
});

// Handle thumb dragging
const onMouseDown = (e: MouseEvent) => {
	if (!container.value || !content.value || !thumb.value) return;

	isDragging.value = true;
	startY = e.clientY;
	startScrollTop = container.value.scrollTop;

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', onMouseUp);
};

const onMouseMove = (e: MouseEvent) => {
	if (!isDragging.value || !container.value || !content.value || !thumb.value) return;

	const deltaY = e.clientY - startY;
	const scrollRatio =
		(content.value.scrollHeight - container.value.clientHeight) /
		(container.value.clientHeight - thumb.value.clientHeight);

	container.value.scrollTop = startScrollTop + deltaY * scrollRatio;
};

const onMouseUp = () => {
	isDragging.value = false;
	document.removeEventListener('mousemove', onMouseMove);
	document.removeEventListener('mouseup', onMouseUp);
};
</script>

<template>
	<div :class="['relative overflow-hidden group', $props.class]">
		<div
			ref="container"
			class="h-full overflow-auto scrollbar-none"
			:style="maxHeight ? { maxHeight } : undefined">
			<div
				ref="content"
				class="h-full">
				<slot />
			</div>
		</div>
		<div class="absolute right-0.5 top-0.5 h-[calc(100%-8px)] w-1.5 select-none">
			<div
				ref="thumb"
				@mousedown="onMouseDown"
				:class="[
					'rounded-full cursor-pointer',
					isDragging
						? 'bg-[var(--ui-text-muted)]/50'
						: 'bg-[var(--ui-text-dimmed)]/50 hover:bg-[var(--ui-text-muted)]/50 transition-colors duration-200',
					isScrolling || isDragging
						? 'opacity-100 transition-none'
						: 'opacity-0 group-hover:opacity-100 transition-opacity duration-[100ms] group-hover:duration-[300ms]',
				]" />
		</div>
	</div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-none::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-none {
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
}
</style>
