<script setup lang="ts">
  import { ref, onMounted, onUnmounted, nextTick } from "vue";

  interface Props {
    /**
     * The class to apply to the root element
     */
    class?: string;
    /**
     * The maximum height of the scroll area
     */
    maxHeight?: string;
    /**
     * Whether to auto scroll to bottom when content changes
     */
    autoScroll?: boolean;
  }

  const props = defineProps<Props>();

  const container = ref<HTMLElement>();
  const content = ref<HTMLElement>();
  const thumb = ref<HTMLElement>();
  const isScrolling = ref(false);
  const isDragging = ref(false);
  const showScrollbar = ref(false);
  const userScrolledUp = ref(false);
  let scrollTimeout: NodeJS.Timeout;
  let startY = 0;
  let startScrollTop = 0;
  let resizeObserver: ResizeObserver;
  let mutationObserver: MutationObserver;
  let thumbUpdatePending = false;
  let dragUpdatePending = false;

  // Add function to check if content overflows
  const checkOverflow = () => {
    if (container.value && content.value) {
      const containerHeight = container.value.clientHeight;
      const contentHeight = content.value.scrollHeight;
      showScrollbar.value = contentHeight > containerHeight;
      return showScrollbar.value;
    }
    return false;
  };

  // Add function to check if scrolled near bottom
  const isNearBottom = () => {
    if (!container.value || !content.value) return false;
    const { scrollTop, clientHeight } = container.value;
    const { scrollHeight } = content.value;
    const threshold = 100; // pixels from bottom
    return scrollHeight - (scrollTop + clientHeight) <= threshold;
  };

  // Add function to scroll to bottom
  const scrollToBottom = (smooth = true) => {
    if (!container.value || !content.value) return;

    container.value.scrollTo({
      top: content.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Add function to update thumb size and position
  const updateThumb = () => {
    if (!checkOverflow() || !container.value || !content.value || !thumb.value)
      return;

    const containerHeight = container.value.clientHeight;
    const contentHeight = content.value.scrollHeight;
    const scrollPercentage = containerHeight / contentHeight;
    const thumbHeight = Math.max(scrollPercentage * containerHeight, 32);
    thumb.value.style.height = `${thumbHeight}px`;

    // Update thumb position
    const scrollPercent =
      container.value.scrollTop / (contentHeight - containerHeight);
    const maxThumbPosition = containerHeight - thumbHeight;
    const thumbPosition = scrollPercent * maxThumbPosition;
    thumb.value.style.transform = `translateY(${thumbPosition}px)`;
  };

  // Function to observe all content changes
  const observeContent = () => {
    if (!content.value || !resizeObserver) return;

    // Observe the content element itself
    resizeObserver.observe(content.value);

    // Observe all child elements that might change size
    const children = content.value.getElementsByTagName("*");
    for (const child of children) {
      resizeObserver.observe(child);
    }
  };

  onMounted(() => {
    // Initial update
    nextTick(() => {
      checkOverflow();
      updateThumb();
      if (props.autoScroll) {
        scrollToBottom(false);
      }
    });

    // Watch for content changes
    resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        checkOverflow();
        updateThumb();
        // Auto-scroll only if we were already near the bottom or autoScroll is enabled and user hasn't scrolled up
        if ((props.autoScroll && !userScrolledUp.value) || isNearBottom()) {
          requestAnimationFrame(() => {
            scrollToBottom(false);
          });
        }
      });
    });

    if (content.value) {
      observeContent();

      // Create a MutationObserver to watch for DOM changes
      mutationObserver = new MutationObserver(() => {
        // Re-observe all content when DOM changes
        nextTick(() => {
          observeContent();
          checkOverflow();
          updateThumb();
          // Auto-scroll only if we were already near the bottom or autoScroll is enabled and user hasn't scrolled up
          if ((props.autoScroll && !userScrolledUp.value) || isNearBottom()) {
            requestAnimationFrame(() => {
              scrollToBottom(false);
            });
          }
        });
      });

      // Watch for changes in the content's DOM
      mutationObserver.observe(content.value, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      });
    }

    // Scroll event handler
    const handleScroll = () => {
      if (!showScrollbar.value) return;

      // Check if user manually scrolled up
      if (container.value && content.value) {
        const atBottom =
          container.value.scrollTop + container.value.clientHeight >=
          content.value.scrollHeight - 1;

        if (!atBottom && !isNearBottom()) {
          userScrolledUp.value = true;
        } else if (atBottom) {
          userScrolledUp.value = false;
        }
      }

      isScrolling.value = true;
      clearTimeout(scrollTimeout);

      // Throttle thumb updates
      if (!thumbUpdatePending) {
        thumbUpdatePending = true;
        requestAnimationFrame(() => {
          updateThumb();
          thumbUpdatePending = false;
        });
      }

      scrollTimeout = setTimeout(() => {
        isScrolling.value = false;
      }, 1000);
    };

    // Add scroll event listener
    container.value?.addEventListener("scroll", handleScroll);

    // Cleanup observer
    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      if (container.value) {
        container.value.removeEventListener("scroll", handleScroll);
      }
    });
  });

  // Handle thumb dragging
  const onMouseDown = (e: MouseEvent) => {
    if (!container.value || !content.value || !thumb.value) return;

    isDragging.value = true;
    startY = e.clientY;
    startScrollTop = container.value.scrollTop;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !container.value || !content.value || !thumb.value)
      return;

    if (!dragUpdatePending) {
      dragUpdatePending = true;
      requestAnimationFrame(() => {
        const deltaY = e.clientY - startY;
        const scrollRatio =
          (content.value!.scrollHeight - container.value!.clientHeight) /
          (container.value!.clientHeight - thumb.value!.clientHeight);

        container.value!.scrollTop = startScrollTop + deltaY * scrollRatio;
        dragUpdatePending = false;
      });
    }
  };

  const onMouseUp = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Expose methods
  defineExpose({
    scrollToBottom,
    isNearBottom,
  });
</script>

<template>
  <div
    :class="['relative overflow-hidden group', props.class]"
    :style="maxHeight ? { height: maxHeight } : undefined">
    <div
      ref="container"
      class="h-full overflow-y-auto overflow-x-hidden scrollbar-none">
      <div
        ref="content"
        class="h-full">
        <slot />
      </div>
    </div>
    <div
      v-if="showScrollbar"
      class="absolute right-0.5 top-0 h-full w-1.5 select-none bg-[var(--ui-text-dimmed)]/10">
      <div
        ref="thumb"
        :class="[
          'rounded-full cursor-pointer',
          isDragging ?
            'bg-[var(--ui-text-muted)]/50'
          : 'bg-[var(--ui-text-dimmed)]/50 hover:bg-[var(--ui-text-muted)]/50 transition-colors duration-200',
          isScrolling || isDragging ?
            'opacity-100 transition-none'
          : 'opacity-0 group-hover:opacity-100 transition-opacity duration-[100ms] group-hover:duration-[300ms]',
        ]"
        @mousedown="onMouseDown" />
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
