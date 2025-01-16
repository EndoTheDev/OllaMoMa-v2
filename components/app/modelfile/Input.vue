<script setup lang="ts">
interface ModelfileInstruction {
	name: string;
	description: string;
}

interface Parameter {
	name: string;
	description: string;
	type: 'int' | 'float' | 'string';
	default?: string | number;
	example: string;
}

const props = defineProps<{
	isFirstLine?: boolean;
}>();

const parameters: Parameter[] = [
	{
		name: 'mirostat',
		description: 'Enable Mirostat sampling for controlling perplexity (0 = disabled, 1 = Mirostat, 2 = Mirostat 2.0)',
		type: 'int',
		default: 0,
		example: 'mirostat 0',
	},
	{
		name: 'mirostat_eta',
		description:
			'Influences how quickly the algorithm responds to feedback from the generated text. Lower = slower adjustments',
		type: 'float',
		default: 0.1,
		example: 'mirostat_eta 0.1',
	},
	{
		name: 'mirostat_tau',
		description: 'Controls the balance between coherence and diversity of the output. Lower = more focused',
		type: 'float',
		default: 5.0,
		example: 'mirostat_tau 5.0',
	},
	{
		name: 'num_ctx',
		description: 'Sets the size of the context window used to generate the next token',
		type: 'int',
		default: 2048,
		example: 'num_ctx 4096',
	},
	{
		name: 'repeat_last_n',
		description: 'Sets how far back for the model to look back to prevent repetition (0 = disabled, -1 = num_ctx)',
		type: 'int',
		default: 64,
		example: 'repeat_last_n 64',
	},
	{
		name: 'repeat_penalty',
		description: 'Sets how strongly to penalize repetitions. Higher = stronger penalty',
		type: 'float',
		default: 1.1,
		example: 'repeat_penalty 1.1',
	},
	{
		name: 'temperature',
		description: 'The temperature of the model. Higher = more creative',
		type: 'float',
		default: 0.8,
		example: 'temperature 0.7',
	},
	{
		name: 'seed',
		description: 'Sets the random number seed to use for generation',
		type: 'int',
		default: 0,
		example: 'seed 42',
	},
	{
		name: 'stop',
		description: 'Sets the stop sequences to use. Multiple stop patterns may be set',
		type: 'string',
		example: 'stop "AI assistant:"',
	},
	{
		name: 'tfs_z',
		description: 'Tail free sampling to reduce impact of less probable tokens. Higher = reduce more',
		type: 'float',
		default: 1,
		example: 'tfs_z 1',
	},
	{
		name: 'num_predict',
		description: 'Maximum number of tokens to predict (-1 = infinite)',
		type: 'int',
		default: -1,
		example: 'num_predict 42',
	},
	{
		name: 'top_k',
		description: 'Reduces probability of generating nonsense. Higher = more diverse',
		type: 'int',
		default: 40,
		example: 'top_k 40',
	},
	{
		name: 'top_p',
		description: 'Works with top-k. Higher = more diverse text',
		type: 'float',
		default: 0.9,
		example: 'top_p 0.9',
	},
	{
		name: 'min_p',
		description: 'Alternative to top_p for quality and variety balance',
		type: 'float',
		default: 0.0,
		example: 'min_p 0.05',
	},
];

const baseInstructions: ModelfileInstruction[] = [
	{
		name: 'FROM',
		description: 'Base model to use',
	},
	{
		name: 'PARAMETER',
		description: 'Set a parameter for model configuration',
	},
	{
		name: 'SYSTEM',
		description: 'Set the system message for the model',
	},
	{
		name: 'TEMPLATE',
		description: 'Define prompt template format',
	},
	{
		name: 'ADAPTER',
		description: 'Use LoRA adapter weights',
	},
	{
		name: 'LICENSE',
		description: 'Specify the model license',
	},
	{
		name: 'MESSAGE',
		description: 'Define a message for the model',
	},
];

const messageRoles = [
	{ name: 'user', description: 'Example message of what the user could have asked' },
	{ name: 'assistant', description: 'Example message of how the model should respond' },
];

const multilineInstructions = ['SYSTEM', 'TEMPLATE', 'LICENSE', 'MESSAGE'];

const tripleQuoteInstructions = ['SYSTEM', 'TEMPLATE', 'LICENSE'];

const modelfileInstructions = computed(
	() =>
		props.isFirstLine
			? [baseInstructions[0]] // Only FROM for first line
			: baseInstructions.slice(1) // Exclude FROM for other lines
);

const selectedInstruction = ref(props.isFirstLine ? 'FROM' : '');
const selectedRole = ref('');
const selectedParameter = ref('');
const instructionValue = ref('');

const isMultiline = computed(() => multilineInstructions.includes(selectedInstruction.value));
const isMessage = computed(() => selectedInstruction.value === 'MESSAGE');
const isParameter = computed(() => selectedInstruction.value === 'PARAMETER');

const selectedParameterDetails = computed(() => parameters.find((p) => p.name === selectedParameter.value));

const emit = defineEmits(['add', 'remove', 'update:instruction', 'update:value']);

watch([selectedInstruction, selectedRole, selectedParameter, instructionValue], () => {
	if (isMessage.value) {
		emit('update:instruction', selectedInstruction.value);
		emit('update:value', `${selectedRole.value} """${instructionValue.value}"""`);
	} else if (isParameter.value && selectedParameter.value) {
		emit('update:instruction', selectedInstruction.value);
		emit('update:value', `${selectedParameter.value} ${instructionValue.value}`);
	} else if (tripleQuoteInstructions.includes(selectedInstruction.value)) {
		emit('update:instruction', selectedInstruction.value);
		emit('update:value', `"""${instructionValue.value}"""`);
	} else {
		emit('update:instruction', selectedInstruction.value);
		emit('update:value', instructionValue.value);
	}
});

// Reset values when instruction changes
watch(selectedInstruction, (newVal) => {
	if (newVal === 'MESSAGE') {
		selectedRole.value = messageRoles[0].name;
		instructionValue.value = '';
	} else if (newVal === 'PARAMETER') {
		selectedParameter.value = '';
		instructionValue.value = '';
	} else {
		selectedRole.value = '';
		selectedParameter.value = '';
	}
});

// Set default value when parameter changes
watch(selectedParameter, (newVal) => {
	const param = parameters.find((p) => p.name === newVal);
	if (param?.default !== undefined) {
		instructionValue.value = param.default.toString();
	} else {
		instructionValue.value = '';
	}
});
</script>

<template>
	<div class="flex gap-1 items-end">
		<USelectMenu
			v-model="selectedInstruction"
			:items="modelfileInstructions"
			value-key="name"
			label-key="name"
			class="w-[120px]"
			placeholder="Select an instruction"
			color="primary"
			:disabled="isFirstLine"
			size="lg">
			<template #item="{ item }">
				<div class="flex flex-col gap-0.5">
					<span class="font-medium">{{ item.name }}</span>
					<!-- <span class="text-xs text-[var(--ui-text-muted)]">{{ item.description }}</span> -->
				</div>
			</template>
		</USelectMenu>

		<USelectMenu
			v-if="isMessage"
			v-model="selectedRole"
			:items="messageRoles"
			value-key="name"
			label-key="name"
			class="w-[120px]"
			placeholder="Role"
			color="primary"
			size="lg">
			<template #item="{ item }">
				<div class="flex flex-col gap-0.5">
					<span class="font-medium">{{ item.name }}</span>
					<!-- <span class="text-xs text-[var(--ui-text-muted)]">{{ item.description }}</span> -->
				</div>
			</template>
		</USelectMenu>

		<USelectMenu
			v-if="isParameter"
			v-model="selectedParameter"
			:items="parameters"
			value-key="name"
			label-key="name"
			class="w-[120px]"
			placeholder="Select parameter"
			color="primary"
			size="lg">
			<template #item="{ item }">
				<div class="flex flex-col gap-0.5">
					<span class="font-medium">{{ item.name }}</span>
					<span class="text-xs text-[var(--ui-text-muted)]">{{ item.description }}</span>
				</div>
			</template>
		</USelectMenu>

		<UTextarea
			v-if="isMultiline"
			v-model="instructionValue"
			class="flex-1 [&_textarea]:resize-none"
			size="lg"
			color="primary"
			:rows="1"
			:maxrows="12"
			autoresize
			:placeholder="
				selectedInstruction
					? isMessage
						? `Enter ${selectedRole} message (without quotes)...`
						: tripleQuoteInstructions.includes(selectedInstruction)
							? `Enter ${selectedInstruction.toLowerCase()} value (without quotes)...`
							: `Enter ${selectedInstruction.toLowerCase()} value...`
					: 'Select an instruction first'
			"
			:disabled="!selectedInstruction || (isMessage && !selectedRole)" />

		<UInput
			v-else
			v-model="instructionValue"
			class="flex-1"
			size="lg"
			color="primary"
			:type="
				isParameter && selectedParameterDetails
					? selectedParameterDetails.type === 'int'
						? 'number'
						: selectedParameterDetails.type === 'float'
							? 'number'
							: 'text'
					: 'text'
			"
			:step="isParameter && selectedParameterDetails?.type === 'float' ? '0.1' : '1'"
			:placeholder="
				selectedInstruction
					? isParameter
						? selectedParameter
							? `Enter value (default: ${selectedParameterDetails?.default})`
							: 'Select a parameter first'
						: `Enter ${selectedInstruction.toLowerCase()} value...`
					: 'Select an instruction first'
			"
			:disabled="!selectedInstruction || (isParameter && !selectedParameter)" />

		<div class="flex gap-1">
			<UButton
				color="primary"
				size="lg"
				icon="i-lucide-plus"
				@click="$emit('add')" />
			<UButton
				color="primary"
				size="lg"
				icon="i-lucide-minus"
				:disabled="isFirstLine"
				@click="$emit('remove')" />
		</div>
	</div>
</template>
