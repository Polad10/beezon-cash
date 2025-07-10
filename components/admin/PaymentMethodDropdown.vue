<script lang="ts" setup>
import { PaymentMethod, toAdminDisplayString } from '~/enums/PaymentMethod'

defineProps<{
	label?: string
	formControlClass?: string
	placeholder?: string
}>()

defineOptions({
	inheritAttrs: false,
})

const model = defineModel()
</script>

<template>
	<label class="form-control" :class="formControlClass">
		<div v-if="label" class="label">
			<span class="label-text">{{ label }}</span>
		</div>
		<select
			class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
			v-bind="$attrs"
			v-model="model"
		>
			<option :value="null" disabled>{{ placeholder || 'Select a payment method' }}</option>
			<option v-for="paymentMethod in Object.values(PaymentMethod)" :value="paymentMethod">
				{{ toAdminDisplayString(paymentMethod) }}
			</option>
		</select>
	</label>
</template>
