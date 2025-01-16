<script setup lang="ts">
interface Instruction {
	id: number;
	instruction: string;
	value: string;
}

const instructions = ref<Instruction[]>([
	{
		id: 1,
		instruction: 'FROM',
		value: '',
	},
]);

const addInstruction = () => {
	instructions.value.push({
		id: Date.now(),
		instruction: '',
		value: '',
	});
};

const removeInstruction = (index: number) => {
	if (instructions.value.length > 1) {
		instructions.value.splice(index, 1);
	}
};

const updateInstruction = (index: number, instruction: string) => {
	instructions.value[index].instruction = instruction;
};

const updateValue = (index: number, value: string) => {
	instructions.value[index].value = value;
};
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center py-2.5 px-2 h-full">
				<h1 class="text-[var(--ui-text)]">Modelfile</h1>
			</div>
		</template>
		<template #default>
			<div class="flex flex-col gap-1 pt-1">
				<div
					v-for="(instruction, index) in instructions"
					:key="instruction.id"
					class="flex flex-col gap-1">
					<AppModelfileInput
						:is-first-line="index === 0"
						@add="addInstruction"
						@remove="() => removeInstruction(index)"
						@update:instruction="(val) => updateInstruction(index, val)"
						@update:value="(val) => updateValue(index, val)" />
				</div>

				<AppModelfilePreview :instructions="instructions" />
			</div>
		</template>
		<template #footer>
			<div class="h-12" />
		</template>
	</BaseLayout>
</template>
