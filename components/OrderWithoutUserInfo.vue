<script lang="ts" setup>
import type { City } from '~/models/City'
import { DeliveryProvider, type OrderTrackRequest } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import DeliveryProviderInput from '~/components/new-order-form/DeliveryProviderInput.vue'
import OrderTypeInput from '~/components/new-order-form/OrderTypeInput.vue'
import CityInput from '~/components/new-order-form/CityInput.vue'
import DescriptionInput from '~/components/new-order-form/DescriptionInput.vue'
import type { Order, NewOrderRequest } from '~/models/Order'

const props = defineProps<{
	title: string
	submitBtnText: string
	cancelBtnText: string
}>()

const emit = defineEmits(['order-submitted'])

defineExpose({ open, close })

const modalRef = ref<HTMLDialogElement | null>(null)
const deliveryProviderInputRef = ref<typeof DeliveryProviderInput | null>(null)

const description = ref('')
const trackNumber = ref('')
const city = ref<City | null>(null)
const selectedDeliveryProvider = ref<DeliveryProvider | null>(null)
const orderTypes = ref<OrderType[]>([])

const errorMessage = ref('')
const showDescriptionInputError = ref(false)
const showErrorToast = ref(false)

function close() {
	modalRef.value?.close()
	resetFieldValues()
	resetFieldErrors()
}

function open(order: Order | undefined) {
	if (order) {
		description.value = order.description
		city.value = order.city
		orderTypes.value = order.order_type_mappings.map((mapping) => mapping.order_type)

		const firstTrack = order.order_tracks[0]
		selectedDeliveryProvider.value = firstTrack.delivery_provider
		trackNumber.value = firstTrack.track_number || ''
	}

	modalRef.value?.showModal()
}

function resetFieldValues() {
	description.value = ''
	trackNumber.value = ''
	city.value = null
	selectedDeliveryProvider.value = null
	orderTypes.value = []
}

function resetFieldErrors() {
	showDescriptionInputError.value = false
	deliveryProviderInputRef.value?.resetErrors()
}

function submit() {
	if (validateForm()) {
		const orderRequest: NewOrderRequest = {
			description: description.value,
			city: city.value || undefined,
			order_type_mappings: orderTypes.value.map((orderType) => ({ order_type: orderType })),
			order_tracks: [],
		}

		if (selectedDeliveryProvider.value != null) {
			const track: OrderTrackRequest = {
				delivery_provider: selectedDeliveryProvider.value,
			}

			// Add track number if provided
			if (trackNumber.value) {
				track.track_number = trackNumber.value
			}

			orderRequest.order_tracks.push(track)
		}

		emit('order-submitted', orderRequest)
	} else {
		errorMessage.value = 'Пожалуйста заполните все необходимые поля'
		showToast(showErrorToast)
	}
}

function validateForm() {
	resetFieldErrors()
	let valid = true

	if (!description.value) {
		valid = false
		showDescriptionInputError.value = true
	}

	if (!deliveryProviderInputRef.value?.validate()) {
		valid = false
	}

	return valid
}
</script>

<template>
	<div>
		<dialog class="modal" ref="modalRef">
			<div class="modal-box" tabindex="0">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
				<p class="text-xl text-center">{{ title }}</p>
				<div class="divider my-1"></div>
				<div class="flex flex-col gap-2">
					<CityInput v-model="city" />
					<DeliveryProviderInput
						ref="deliveryProviderInputRef"
						label="Где нам нужно будет получить заказ?"
						v-model="selectedDeliveryProvider"
						v-model:track-number="trackNumber"
						:show-asterisk="false"
					/>
					<DescriptionInput
						v-model="description"
						:show-input-error="showDescriptionInputError"
						label="Краткая опись заказа"
					/>
					<OrderTypeInput v-model="orderTypes" />
				</div>
				<div class="modal-action">
					<button class="btn btn-outline hover:bg-gray-800" @click="close">{{ cancelBtnText }}</button>
					<button class="btn bg-blue-700 text-white hover:bg-blue-800" @click="submit">
						{{ submitBtnText }}
						<ion-icon name="chevron-forward"></ion-icon>
					</button>
				</div>
			</div>
			<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
		</dialog>
	</div>
</template>
