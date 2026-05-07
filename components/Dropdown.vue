<script lang="ts" setup>
const props = defineProps<{
	label?: string
	placeholder: string
	labelClass?: string
	labelTextClass?: string
	options: {
		key: string
		displayValue: string
	}[]
}>()

defineOptions({
	inheritAttrs: false,
})

const model = defineModel()
</script>

<template>
	<label class="form-control flex-1">
		<div v-if="label" class="label" :class="labelClass">
			<span class="label-text" :class="labelTextClass">{{ label }}</span>
		</div>
		<select
			class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
			v-bind="$attrs"
			v-model="model"
		>
			<option value="null" disabled>{{ placeholder }}</option>
			<option v-for="option in options" :value="option.key">{{ option.displayValue }}</option>
		</select>
	</label>
</template>
