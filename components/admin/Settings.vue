<script lang="ts" setup>
import type { Setting, UpdateSettingRequest } from '~/models/Setting'
import Input from '../Input.vue'
import Decimal from 'decimal.js'
import axios from 'axios'

const props = defineProps<{
	setting: Setting
}>()

const emit = defineEmits(['settings-updated'])

const exchangeRate = ref(props.setting.exchange_rate.toString())
const errorMessage = ref('')
const successMessage = ref('')

const showExchangeRateInputError = ref(false)
const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const loading = ref(false)

const formattedExchangeRate = computed(() => {
	return formatNumber(exchangeRate.value)
})

async function save() {
	if (validate()) {
		try {
			loading.value = true
			const request: UpdateSettingRequest = {
				exchange_rate: new Decimal(exchangeRate.value),
			}

			const updatedSetting = (await axios.put('/api/admin/settings', request)).data
			emit('settings-updated', updatedSetting)

			successMessage.value = 'Settings updated'
			showToast(showSuccessToast)
		} catch (ex) {
			logError(ex)
			errorMessage.value = 'Something went wrong. Please try again later.'
			showToast(showErrorToast)
		} finally {
			loading.value = false
		}
	} else {
		errorMessage.value = 'Please fill all the required fields'
		showToast(showErrorToast)
	}
}

function validate() {
	resetFieldErrors()
	let valid = true

	if (!formattedExchangeRate.value || !isValidDecimal(formattedExchangeRate.value)) {
		valid = false
		showExchangeRateInputError.value = true
	}

	return valid
}

function resetFieldErrors() {
	showExchangeRateInputError.value = false
}
</script>

<template>
	<div class="flex flex-col grow">
		<div class="flex flex-row min-h-12 mr-3 justify-between items-center">
			<span class="text-2xl font-bold">Settings</span>
		</div>
		<div class="flex flex-col bg-white mr-3 mb-5 p-5 grow">
			<div class="w-48">
				<Input
					type="text"
					label="Exchange rate (GEL -> RUB)"
					placeholder="9.9"
					v-model="exchangeRate"
					class="input-sm"
					:class="{ 'input-error': showExchangeRateInputError }"
				/>
				<button class="btn btn-sm btn-success mt-5" @click="save">
					<span v-if="loading" class="loading loading-spinner"></span>
					<span v-else>Save</span>
				</button>
			</div>
		</div>
		<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
		<Toast
			v-if="showSuccessToast"
			class="alert-success"
			icon-name="checkmark-circle-outline"
			:message="successMessage"
		/>
	</div>
</template>
