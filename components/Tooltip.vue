<script setup lang="ts">
defineOptions({
	inheritAttrs: false,
})
</script>

<template>
	<div class="flex relative group">
		<div
			class="absolute hidden min-w-32 group-hover:block mt-5 text-xs rounded shadow text-left p-2 left-1/2 -translate-x-1/2"
			v-bind="$attrs"
		>
			<slot name="content" />
		</div>
		<slot />
	</div>
</template>
