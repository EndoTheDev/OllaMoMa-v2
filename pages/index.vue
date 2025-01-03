<script setup lang="ts">
const counter = useCounterStore();
</script>

<template>
	<div>
		<p>Count: {{ counter.count }}</p>
		<UButton @click="counter.increment()">Increment</UButton>
	</div>
</template>
