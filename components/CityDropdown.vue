<script lang="ts" setup>
import { City, toDisplayString } from '~/models/City'

const props = defineProps<{
	label: string
	placeholder: string
	labelClass?: string
	labelTextClass?: string
}>()

defineOptions({
	inheritAttrs: false,
})

const model = defineModel()
</script>

<template>
	<label class="form-control flex-1 min-w-32">
		<div class="label" :class="labelClass">
			<span class="label-text" :class="labelTextClass">{{ label }}</span>
		</div>
		<select
			class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
			v-bind="$attrs"
			v-model="model"
		>
			<option value="null" disabled>{{ placeholder }}</option>
			<option :value="City.Tbilisi">{{ toDisplayString(City.Tbilisi) }}</option>
			<option :value="City.Batumi">{{ toDisplayString(City.Batumi) }}</option>
			<option :value="City.Borjomi">{{ toDisplayString(City.Borjomi) }}</option>
			<option :value="City.Rustavi">{{ toDisplayString(City.Rustavi) }}</option>
			<option :value="City.Mtskheta">{{ toDisplayString(City.Mtskheta) }}</option>
			<option :value="City.Kobuleti">{{ toDisplayString(City.Kobuleti) }}</option>
			<option :value="City.Other">{{ toDisplayString(City.Other) }}</option>
		</select>
	</label>
</template>
