<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'

defineOptions({
	inheritAttrs: false,
})

const props = defineProps<{
	type: InputTypeHTMLAttribute
	label?: string
	placeholder?: string
	labelClass?: string
	labelTextClass?: string
	required?: boolean
}>()

const model = defineModel()
</script>

<template>
	<label class="form-control flex-1 min-w-32">
		<div class="label" :class="labelClass" v-if="props.label">
			<span class="label-text" :class="labelTextClass"
				>{{ props.label }} <span v-if="required" class="hidden sm:inline">*</span></span
			>
		</div>
		<input
			:type="props.type"
			:placeholder="props.placeholder"
			class="input input-bordered focus-within:outline-0 focus-within:border-gray-500"
			v-model="model"
			v-bind="$attrs"
			enterkeyhint="done"
			@keydown.enter=";($event.target as HTMLInputElement).blur()"
		/>
	</label>
</template>
