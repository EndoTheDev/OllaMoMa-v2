import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import ScrollArea from '../components/ui/ScrollArea.vue';
import type { ComponentPublicInstance } from 'vue';
import { nextTick } from 'vue';

interface ScrollAreaInstance extends ComponentPublicInstance {
	isScrolling: boolean;
	isDragging: boolean;
	updateThumb: () => void;
}

describe('ScrollArea', () => {
	let wrapper: VueWrapper;
	let mockScrollHeight: number;
	let mockClientHeight: number;

	beforeEach(() => {
		mockScrollHeight = 200;
		mockClientHeight = 100;

		// Mock ResizeObserver
		global.ResizeObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn(),
		}));

		// Mock element properties and methods
		Element.prototype.getBoundingClientRect = vi.fn(() => ({
			width: 100,
			height: 100,
			top: 0,
			left: 0,
			bottom: 100,
			right: 100,
			x: 0,
			y: 0,
			toJSON: () => {},
		}));

		// Mock scrollHeight and clientHeight
		Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
			configurable: true,
			get: function () {
				return mockScrollHeight;
			},
		});

		Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
			configurable: true,
			get: function () {
				return mockClientHeight;
			},
		});
	});

	afterEach(() => {
		wrapper?.unmount();
		vi.clearAllMocks();
	});

	it('renders properly with default props', () => {
		wrapper = mount(ScrollArea);
		expect(wrapper.exists()).toBe(true);
		expect(wrapper.find('.overflow-hidden').exists()).toBe(true);
		expect(wrapper.find('.overflow-y-auto').exists()).toBe(true);
	});

	it('applies custom class when provided', () => {
		const customClass = 'custom-class';
		wrapper = mount(ScrollArea, {
			props: {
				class: customClass,
			},
		});
		expect(wrapper.classes()).toContain(customClass);
	});

	it('applies maxHeight style when provided', () => {
		const maxHeight = '200px';
		wrapper = mount(ScrollArea, {
			props: {
				maxHeight,
			},
		});
		expect(wrapper.attributes('style')).toContain(`height: ${maxHeight}`);
	});

	it('shows scrollbar thumb on container hover when content overflows', async () => {
		wrapper = mount(ScrollArea);
		await nextTick();

		// Ensure content is larger than container
		const content = wrapper.find('.overflow-y-auto > div').element as HTMLElement;
		Object.defineProperty(content, '_scrollHeight', { value: 200 });
		Object.defineProperty(content.parentElement!, '_clientHeight', { value: 100 });

		// Trigger resize observer to update scrollbar visibility
		const resizeObserver = global.ResizeObserver as unknown as ReturnType<typeof vi.fn>;
		const observerCallback = resizeObserver.mock.calls[0][0];
		observerCallback([{ contentRect: { width: 100, height: 200 } }]);
		await nextTick();

		const container = wrapper.find('.relative');
		const thumb = wrapper.find('.rounded-full');

		// Initial state should be opacity-0
		expect(thumb.exists()).toBe(true);
		expect(thumb.classes()).toContain('opacity-0');

		// Hover should add opacity-100
		await container.trigger('mouseenter');
		expect(thumb.classes()).toContain('group-hover:opacity-100');
	});

	it('updates thumb position on scroll when content overflows', async () => {
		wrapper = mount(ScrollArea);
		await nextTick();

		// Ensure content is larger than container
		const content = wrapper.find('.overflow-y-auto > div').element as HTMLElement;
		Object.defineProperty(content, '_scrollHeight', { value: 200 });
		Object.defineProperty(content.parentElement!, '_clientHeight', { value: 100 });

		// Trigger resize observer
		const resizeObserver = global.ResizeObserver as unknown as ReturnType<typeof vi.fn>;
		const observerCallback = resizeObserver.mock.calls[0][0];
		observerCallback([{ contentRect: { width: 100, height: 200 } }]);
		await nextTick();

		const container = wrapper.find('.overflow-y-auto');
		await container.trigger('scroll');
		expect((wrapper.vm as unknown as ScrollAreaInstance).isScrolling).toBe(true);

		// Wait for scroll timeout
		await new Promise((resolve) => setTimeout(resolve, 1100));
		expect((wrapper.vm as unknown as ScrollAreaInstance).isScrolling).toBe(false);
	});

	it('handles thumb dragging when content overflows', async () => {
		wrapper = mount(ScrollArea);
		await nextTick();

		// Ensure content is larger than container
		const content = wrapper.find('.overflow-y-auto > div').element as HTMLElement;
		Object.defineProperty(content, '_scrollHeight', { value: 200 });
		Object.defineProperty(content.parentElement!, '_clientHeight', { value: 100 });

		// Trigger resize observer
		const resizeObserver = global.ResizeObserver as unknown as ReturnType<typeof vi.fn>;
		const observerCallback = resizeObserver.mock.calls[0][0];
		observerCallback([{ contentRect: { width: 100, height: 200 } }]);
		await nextTick();

		const thumb = wrapper.find('.rounded-full');

		// Start dragging
		await thumb.trigger('mousedown', {
			clientY: 0,
		});
		expect((wrapper.vm as unknown as ScrollAreaInstance).isDragging).toBe(true);

		// Move thumb
		await document.dispatchEvent(
			new MouseEvent('mousemove', {
				clientY: 50,
			})
		);

		// End dragging
		await document.dispatchEvent(new MouseEvent('mouseup'));
		expect((wrapper.vm as unknown as ScrollAreaInstance).isDragging).toBe(false);
	});

	it('updates scrollbar when content changes dynamically', async () => {
		// Create a component with dynamic content
		const TestComponent = {
			components: { ScrollArea },
			template: `
				<ScrollArea class="h-[200px]">
					<div ref="content">
						<div v-for="item in items" :key="item">
							<div :style="{ height: expanded === item ? '100px' : '20px' }">
								Item {{ item }}
							</div>
						</div>
					</div>
				</ScrollArea>
			`,
			data() {
				return {
					items: [1, 2, 3],
					expanded: null,
				};
			},
		};

		wrapper = mount(TestComponent);
		await nextTick();

		// Set initial content larger than container
		mockScrollHeight = 400;
		mockClientHeight = 200;

		// Trigger resize observer
		const resizeObserver = global.ResizeObserver as unknown as ReturnType<typeof vi.fn>;
		const observerCallback = resizeObserver.mock.calls[0][0];
		observerCallback([{ contentRect: { width: 100, height: 400 } }]);
		await nextTick();

		const scrollArea = wrapper.findComponent(ScrollArea);
		const thumb = scrollArea.find('.rounded-full').element as HTMLElement;
		const initialThumbHeight = parseInt(thumb.style.height || '0');

		// Simulate content shrinking
		mockScrollHeight = 300;
		observerCallback([{ contentRect: { width: 100, height: 300 } }]);
		await nextTick();

		const newThumbHeight = parseInt(thumb.style.height || '0');
		expect(newThumbHeight).toBeGreaterThan(initialThumbHeight);
	});

	it('hides scrollbar when content fits container', async () => {
		// Create a component with content that fits
		const TestComponent = {
			components: { ScrollArea },
			template: `
				<ScrollArea class="h-[200px]">
					<div ref="content">
						<div>Short content</div>
					</div>
				</ScrollArea>
			`,
		};

		// Set content height less than container
		mockScrollHeight = 100;
		mockClientHeight = 200;

		wrapper = mount(TestComponent);
		await nextTick();

		// Trigger resize observer
		const resizeObserver = global.ResizeObserver as unknown as ReturnType<typeof vi.fn>;
		const observerCallback = resizeObserver.mock.calls[0][0];
		observerCallback([{ contentRect: { width: 100, height: 100 } }]);

		await nextTick();
		const thumb = wrapper.find('.rounded-full');
		expect(thumb.exists()).toBe(false);
	});

	it('observes nested content changes', async () => {
		// Mock MutationObserver
		const mockMutationObserver = vi.fn();
		global.MutationObserver = vi.fn().mockImplementation(() => ({
			observe: mockMutationObserver,
			disconnect: vi.fn(),
		}));

		// Mock ResizeObserver with spy
		const observeSpy = vi.fn();
		global.ResizeObserver = vi.fn().mockImplementation(() => ({
			observe: observeSpy,
			unobserve: vi.fn(),
			disconnect: vi.fn(),
		}));

		wrapper = mount(ScrollArea);
		await nextTick();

		// Verify MutationObserver is set up correctly
		expect(mockMutationObserver).toHaveBeenCalledWith(
			expect.any(Element),
			expect.objectContaining({
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['style', 'class'],
			})
		);

		// Verify ResizeObserver is used
		expect(observeSpy).toHaveBeenCalled();
		expect(observeSpy.mock.calls.length).toBeGreaterThan(0);
	});
});
