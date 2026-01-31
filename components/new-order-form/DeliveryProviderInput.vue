<script lang="ts" setup>
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'
import FormInput from '~/components/new-order-form/FormInput.vue'

defineProps<{
	label: string
	showAsterisk?: boolean
}>()

defineExpose({ validate, resetErrors })

const selectedDeliveryProvider = defineModel<DeliveryProvider | null>({ required: true })
const trackNumber = defineModel<string>('trackNumber', { required: true })

const showDeliveryProviderInputError = ref(false)
const showTrackNumberInputError = ref(false)

// Providers that require track numbers
const providersRequiringTrackNumber = [
	DeliveryProvider.CDEK,
	DeliveryProvider.PostRussia,
	DeliveryProvider.POST5,
	DeliveryProvider.Boxberry,
	DeliveryProvider.DPD,
	DeliveryProvider.AptekaRu,
]

// Computed property to check if current provider requires track number
const requiresTrackNumber = computed(() => {
	return (
		selectedDeliveryProvider.value != null && providersRequiringTrackNumber.includes(selectedDeliveryProvider.value)
	)
})

// Computed property for track number label
const trackNumberLabel = computed(() => {
	if (!selectedDeliveryProvider.value) return ''

	const providerName = deliveryProviderToDisplayString(selectedDeliveryProvider.value)
	return `Трек-номер ${providerName}`
})

const deliveryProviderOptions = [
	DeliveryProvider.Ozon,
	DeliveryProvider.Wilbderries,
	DeliveryProvider.CDEK,
	DeliveryProvider.PostRussia,
	DeliveryProvider.POST5,
	DeliveryProvider.Boxberry,
	DeliveryProvider.DPD,
	DeliveryProvider.Cold,
	DeliveryProvider.AptekaRu,
]

function validate(): boolean {
	resetErrors()
	let valid = true

	if (selectedDeliveryProvider.value == null) {
		showDeliveryProviderInputError.value = true
		valid = false
	}

	// Check if selected provider requires track number and it's not provided
	if (requiresTrackNumber.value && !trackNumber.value) {
		valid = false
		showTrackNumberInputError.value = true
	}

	return valid
}

function resetErrors() {
	showDeliveryProviderInputError.value = false
	showTrackNumberInputError.value = false
}

function sanitizeTrackNumber(value: string): string {
	// Remove all characters except letters, numbers, and hyphens
	return value.replace(/[^a-zA-Z0-9-]/g, '')
}

// Watch and sanitize track number
watch(trackNumber, (newValue) => {
	const sanitized = sanitizeTrackNumber(newValue)
	if (sanitized !== newValue) {
		trackNumber.value = sanitized
	}
})

// Clear track number when switching providers
watch(selectedDeliveryProvider, (newValue) => {
	if (newValue !== selectedDeliveryProvider.value) {
		trackNumber.value = ''
	}
})
</script>

<template>
	<div>
		<label class="form-control flex-1 min-w-32">
			<div class="label font-medium pb-1">
				<span class="label-text text-base">{{ label }}</span>
			</div>
			<select
				class="select select-bordered focus-within:outline-0 focus-within:border-gray-500 text-base"
				:class="{ 'select-error': showDeliveryProviderInputError }"
				v-model="selectedDeliveryProvider"
			>
				<option value="null" disabled>Выберите службу доставки</option>
				<option v-for="provider in deliveryProviderOptions" :key="provider" :value="provider">
					{{ deliveryProviderToDisplayString(provider) }}
				</option>
			</select>
		</label>
		<!-- Track number input -->
		<div class="mt-2">
			<FormInput
				v-if="requiresTrackNumber"
				:label="`${trackNumberLabel}${showAsterisk ? ' *' : ''}`"
				v-model="trackNumber"
				:show-input-error="showTrackNumberInputError"
			/>
		</div>
	</div>
</template>
