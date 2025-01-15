<script setup lang="ts">
import type { OllamaModel } from '~/types/ollama';

const props = defineProps<{
	model: OllamaModel;
	activePanel: 'info' | 'modelfile';
}>();

defineEmits<{
	'update:activePanel': ['info' | 'modelfile'];
}>();

const transitionClasses = {
	enterActive: 'transition duration-200 ease-out',
	leaveActive: 'transition duration-150 ease-in',
	enterTo: 'opacity-100 translate-x-0',
	leaveFrom: 'opacity-100 translate-x-0',
};

const getTransitionClasses = computed(() => {
	const isInfo = props.activePanel === 'info';
	return {
		...transitionClasses,
		enterFrom: isInfo ? 'opacity-0 -translate-x-4' : 'opacity-0 translate-x-4',
		leaveTo: isInfo ? 'opacity-0 translate-x-4' : 'opacity-0 -translate-x-4',
	};
});
</script>

<template>
	<UAccordion
		:items="[
			{
				label: model.name,
				icon: 'i-lucide-box',
				content: '',
				slot: 'model-details',
			},
		]"
		:ui="{
			trigger: 'text-base font-bold py-2 cursor-pointer',
		}">
		<template #model-details>
			<AppModelsActionsMenu
				class="py-2"
				:active-panel="activePanel"
				:model-name="model.name"
				@update:active-panel="(panel: 'info' | 'modelfile') => $emit('update:activePanel', panel)" />
			<div class="relative">
				<Transition
					mode="out-in"
					:enter-active-class="getTransitionClasses.enterActive"
					:enter-from-class="getTransitionClasses.enterFrom"
					:enter-to-class="getTransitionClasses.enterTo"
					:leave-active-class="getTransitionClasses.leaveActive"
					:leave-from-class="getTransitionClasses.leaveFrom"
					:leave-to-class="getTransitionClasses.leaveTo">
					<AppModelsDetailsModelInfo
						v-if="activePanel === 'info'"
						:key="'info-' + model.name"
						:model="model" />
					<AppModelsDetailsModelFile
						v-else
						:key="'modelfile-' + model.name"
						:model-name="model.name" />
				</Transition>
			</div>
		</template>
	</UAccordion>
</template>
