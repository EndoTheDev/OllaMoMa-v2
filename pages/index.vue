<script setup lang="ts">
const selectedModel = ref<string>('');
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([]);
const message = ref<string>('');
const formState = ref({});

const handleModelSelect = (model: string) => {
	console.log('Selected model:', model);
	selectedModel.value = model;
};

const handleClear = () => {
	messages.value = [];
};

const handleSubmit = () => {
	if (!message.value.trim()) return;

	messages.value.push({
		role: 'user',
		content: message.value.trim(),
	});

	// mock response
	messages.value.push({
		role: 'assistant',
		content: 'Hello! I am a helpful assistant.',
	});

	message.value = '';
};
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center p-2 h-full">
				<ChatModelDropdown
					v-model="selectedModel"
					@update:model-value="handleModelSelect" />
				<UButton
					variant="ghost"
					color="primary"
					size="lg"
					@click="handleClear">
					Clear
				</UButton>
			</div>
		</template>
		<template #default>
			<ChatDisplay :messages="messages" />
		</template>
		<template #footer>
			<div class="text-xl flex items-center p-2 h-full">
				<UForm
					:state="formState"
					class="flex w-full gap-1"
					@submit="handleSubmit">
					<UInput
						v-model="message"
						variant="ghost"
						placeholder="Ask a question..."
						class="w-full"
						autofocus />
					<UButton
						type="submit"
						variant="ghost"
						color="primary"
						size="lg"
						:disabled="!message.trim()">
						Send
					</UButton>
				</UForm>
			</div>
		</template>
	</BaseLayout>
</template>
