<script setup lang="ts">
const modal = useModal();
const ollama = useOllamaStore();
const isOpen = ref(true);

defineProps<{
	modelName?: string;
}>();

const emit = defineEmits<{
	(e: 'confirm', destination: string): void;
	(e: 'cancel'): void;
}>();

const destination = ref('');
const error = ref('');

function handleCopy() {
	if (!destination.value) {
		error.value = 'Please enter a name for the new model';
		return;
	}

	if (ollama.getModelByName(destination.value)) {
		error.value = 'A model with this name already exists';
		return;
	}

	emit('confirm', destination.value);
	modal.close();
}
</script>

<template>
	<UModal
		v-model:open="isOpen"
		:title="`Copy ${modelName || 'Model'}`"
		:ui="{ overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm' }">
		<template #body>
			<div class="space-y-6">
				<p class="text-sm text-[var(--ui-text-muted)]">
					This will create an exact copy of
					<span class="font-medium text-[var(--ui-text)]">{{ modelName }}</span> with all its parameters and
					settings.
				</p>

				<div class="space-y-4">
					<UInput
						v-model="destination"
						placeholder="New model name"
						:class="{ 'border-[var(--ui-error)]': error }"
						@keyup.enter="handleCopy" />
					<p
						v-if="error"
						class="text-sm text-[var(--ui-error)]">
						{{ error }}
					</p>
				</div>

				<div class="flex justify-end gap-1">
					<UButton
						color="neutral"
						variant="ghost"
						@click="
							emit('cancel');
							modal.close();
						">
						<UIcon
							name="i-heroicons-x-mark"
							class="w-5 h-5" />
						<span>CANCEL</span>
					</UButton>
					<UButton
						color="primary"
						variant="ghost"
						@click="handleCopy">
						<UIcon
							name="i-heroicons-document-duplicate"
							class="w-5 h-5" />
						<span>COPY</span>
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
