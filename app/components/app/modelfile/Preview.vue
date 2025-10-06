<script setup lang="ts">
interface Instruction {
	id: number;
	instruction: string;
	value: string;
}

const props = defineProps<{
	instructions: Instruction[];
}>();

const { radiusClasses } = useUIUtils();
const toast = useToast();
const isCopied = ref(false);

const modelfileContent = computed(() => {
	return props.instructions
		.filter((inst) => {
			// Always require instruction to be non-empty
			if (!inst.instruction) return false;

			// For triple-quoted instructions, filter out if the value is empty or just quotes
			if (['SYSTEM', 'TEMPLATE', 'LICENSE'].includes(inst.instruction)) {
				const valueWithoutQuotes = inst.value.replace(/"""/g, '').trim();
				return valueWithoutQuotes.length > 0;
			}

			// For MESSAGE instruction, check if there's actual content
			if (inst.instruction === 'MESSAGE') {
				const [role, ...messageParts] = inst.value.split(' ');
				const messageContent = messageParts.join(' ').replace(/"""/g, '').trim();
				return role && messageContent.length > 0;
			}

			// For other instructions, require non-empty value
			return inst.value.trim().length > 0;
		})
		.map((inst) => `${inst.instruction} ${inst.value}`)
		.join('\n');
});

const hasMultipleLines = computed(() => {
	const lines = modelfileContent.value.split('\n').filter((line) => line.trim());
	return lines.length > 1;
});

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(modelfileContent.value);
		isCopied.value = true;
		toast.add({
			title: 'Copied to clipboard',
			description: 'Modelfile content has been copied',
			icon: 'i-heroicons-clipboard-document-check',
			color: 'primary',
		});
		setTimeout(() => {
			isCopied.value = false;
		}, 2000);
	} catch {
		toast.add({
			title: 'Failed to copy',
			description: 'Could not copy to clipboard',
			icon: 'i-heroicons-exclamation-triangle',
			color: 'error',
		});
	}
};
</script>

<template>
	<div class="relative">
		<UiScrollArea
			class="bg-[var(--ui-bg-muted)] border border-[var(--ui-border)]"
			:class="radiusClasses">
			<pre class="text-sm p-2 whitespace-pre-wrap break-words font-mono min-h-[40px]">{{
				modelfileContent || '# No content yet. Add instructions above.'
			}}</pre>
		</UiScrollArea>
		<UButton
			v-if="hasMultipleLines"
			size="xl"
			color="primary"
			variant="solid"
			square
			:icon="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard'"
			class="absolute bottom-2 right-3 z-10 rounded-full opacity-80"
			@click="copyToClipboard" />
	</div>
</template>
