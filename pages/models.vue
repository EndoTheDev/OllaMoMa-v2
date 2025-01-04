<script setup lang="ts">
interface ModelDetails {
	parent_model: string;
	format: string;
	family: string;
	families: string[];
	parameter_size: string;
	quantization_level: string;
}

interface OllamaModel {
	name: string;
	modified_at: string;
	size: number;
	digest: string;
	details?: ModelDetails;
}

const ollamaStore = useOllamaStore();

onMounted(() => {
	ollamaStore.fetchModels();
});
</script>

<template>
	<BaseLayout>
		<template #header>
			<h1>Models</h1>
		</template>
		<template #default>
			<div
				v-if="ollamaStore.isLoading"
				class="text-[var(--ui-text-dimmed)]">
				Loading models...
			</div>
			<div
				v-else-if="ollamaStore.error"
				class="text-[var(--ui-error)]">
				{{ ollamaStore.error }}
			</div>
			<div v-else>
				<ul
					v-if="ollamaStore.hasModels"
					class="space-y-1">
					<li
						v-for="model in ollamaStore.models"
						:key="model.name"
						class="border border-[var(--ui-border)] p-3 rounded-lg">
						<UAccordion
							:items="[
								{
									label: model.name,
									icon: 'i-lucide-box',
									content: '',
									slot: 'model-details',
								},
							]"
							class="[&_.u-accordion-trigger]:text-xl [&_.u-accordion-trigger]:font-bold [&_.u-accordion-trigger]:py-2">
							<template #model-details="{ item }">
								<div class="space-y-2 py-2">
									<div class="flex flex-wrap items-center gap-2">
										<span class="font-medium text-base w-36">Model Family:</span>
										<UBadge
											v-for="family in model.details?.families"
											:key="family"
											:label="family"
											class="capitalize text-sm"
											variant="solid"
											color="primary" />
									</div>

									<div class="grid lg:grid-cols-2 gap-y-2 gap-x-12">
										<div class="flex flex-wrap items-center gap-3">
											<span class="font-medium text-base w-36">Size:</span>
											<span class="text-[var(--ui-text-muted)] text-base">
												{{
													model.size >= 1024 * 1024 * 1024
														? `${(model.size / 1024 / 1024 / 1024).toFixed(2)} GB`
														: model.size >= 1024 * 1024
															? `${(model.size / 1024 / 1024).toFixed(2)} MB`
															: `${(model.size / 1024).toFixed(2)} KB`
												}}
											</span>
										</div>

										<div class="flex flex-wrap items-center gap-3">
											<span class="font-medium text-base w-36">Parameters:</span>
											<span class="text-[var(--ui-text-muted)] text-base">
												{{ model.details?.parameter_size }}
											</span>
										</div>

										<div class="flex flex-wrap items-center gap-3">
											<span class="font-medium text-base w-36">Format:</span>
											<span class="text-[var(--ui-text-muted)] text-base uppercase">
												{{ model.details?.format }}
											</span>
										</div>

										<div class="flex flex-wrap items-center gap-3">
											<span class="font-medium text-base w-36">Quantization:</span>
											<span class="text-[var(--ui-text-muted)] text-base">
												{{ model.details?.quantization_level }}
											</span>
										</div>
									</div>

									<div class="flex flex-wrap items-center gap-3">
										<span class="font-medium text-base w-36">Modified:</span>
										<span class="text-[var(--ui-text-muted)] text-base flex items-center gap-2">
											{{ new Date(model.modified_at).toLocaleDateString() }}
											<UBadge
												:label="`${useTimeAgo(model.modified_at).value}`"
												variant="subtle"
												color="neutral"
												class="text-xs" />
										</span>
									</div>

									<div class="flex flex-wrap items-start gap-3">
										<span class="font-medium text-base w-36">Digest:</span>
										<span
											class="text-[var(--ui-text-muted)] break-all text-sm flex-1 font-mono line-clamp-2">
											{{ model.digest }}
										</span>
									</div>
								</div>
							</template>
						</UAccordion>
					</li>
				</ul>
				<p
					v-else
					class="text-[var(--ui-text-muted)]">
					No models available
				</p>
			</div>
		</template>
		<template #footer>
			<h1>FOOTER</h1>
		</template>
	</BaseLayout>
</template>
