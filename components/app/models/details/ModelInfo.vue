<script setup lang="ts">
import type { OllamaModel } from '~/types/ollama';
const { radiusClasses } = useUIUtils();
const { formatSize } = useUtils();

defineProps<{
	model: OllamaModel;
}>();
</script>

<template>
	<div class="space-y-2 px-2">
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-base w-36">Model Family:</span>
			<UBadge
				v-for="family in model.details?.families"
				:key="family"
				:label="family"
				:class="[radiusClasses]"
				class="capitalize text-sm"
				variant="soft"
				color="primary" />
		</div>

		<div class="grid lg:grid-cols-2 gap-y-2 gap-x-12">
			<div class="flex flex-wrap items-center gap-3">
				<span class="text-base w-36">Size:</span>
				<span class="text-[var(--ui-text-muted)] text-base">
					{{ formatSize(model.size) }}
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<span class="text-base w-36">Parameters:</span>
				<span class="text-[var(--ui-text-muted)] text-base">
					{{ model.details?.parameter_size }}
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<span class="text-base w-36">Format:</span>
				<span class="text-[var(--ui-text-muted)] text-base uppercase">
					{{ model.details?.format }}
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<span class="text-base w-36">Quantization:</span>
				<span class="text-[var(--ui-text-muted)] text-base">
					{{ model.details?.quantization_level }}
				</span>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-3">
			<span class="text-base w-36">Modified:</span>
			<span class="text-[var(--ui-text-muted)] text-base flex items-center gap-2">
				{{ new Date(model.modified_at).toLocaleDateString() }}
				<UBadge
					:label="`${useTimeAgo(model.modified_at).value}`"
					:class="[radiusClasses]"
					class="text-xs"
					variant="soft"
					color="neutral" />
			</span>
		</div>

		<div class="flex flex-wrap items-start gap-3">
			<span class="text-base w-36">Digest:</span>
			<span class="text-[var(--ui-text-muted)] break-all text-sm flex-1 font-mono line-clamp-2">
				{{ model.digest }}
			</span>
		</div>
	</div>
</template>
