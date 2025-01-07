<script setup lang="ts">
const messages = ref<{ role: 'user' | 'assistant'; content: string }[]>([
	{ role: 'user', content: 'Hi! I need help with something.' },
	{ role: 'assistant', content: "Hello! I'm here to help. What do you need assistance with?" },
	{ role: 'user', content: "I'm trying to learn about AI models." },
	{
		role: 'assistant',
		content:
			"That's great! I'd be happy to help you learn about AI models. What specific aspects would you like to know more about?",
	},
	{ role: 'user', content: 'Could you explain what neural networks are?' },
	{
		role: 'assistant',
		content:
			'Neural networks are computing systems inspired by biological neural networks in human brains. They consist of interconnected nodes (neurons) that process and transmit information, allowing the system to learn and recognize patterns in data.',
	},
	{ role: 'user', content: 'What are some common applications of neural networks?' },
	{
		role: 'assistant',
		content:
			'Neural networks are used in many areas including image and speech recognition, natural language processing, autonomous vehicles, medical diagnosis, and game playing. They excel at tasks that require pattern recognition and complex decision-making.',
	},
	{ role: 'user', content: 'How do neural networks learn?' },
	{
		role: 'assistant',
		content:
			'Neural networks learn through a process called training, where they analyze large amounts of data and adjust their internal parameters (weights and biases) to minimize errors in their predictions. This typically involves techniques like backpropagation and gradient descent.',
	},
	{ role: 'user', content: 'What are some challenges in training neural networks?' },
	{
		role: 'assistant',
		content:
			'Common challenges include requiring large amounts of high-quality training data, computational intensity, potential overfitting where the model performs well on training data but poorly on new data, and the "black box" nature making it difficult to understand how the network reaches its decisions.',
	},
]);
</script>

<template>
	<BaseLayout>
		<template #header>
			<div class="text-xl flex items-center p-5 h-full">
				<h1>Chat WIP</h1>
			</div>
		</template>
		<template #default>
			<ChatDisplay :messages="messages" />
		</template>
		<template #footer>
			<!--  -->
		</template>
	</BaseLayout>
</template>
