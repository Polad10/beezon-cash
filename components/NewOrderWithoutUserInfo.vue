<script lang="ts" setup>
import axios from 'axios'
import type { City } from '~/models/City'
import { DeliveryProvider, type OrderTrackRequest } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import DeliveryProviderInput from '~/components/new-order-form/DeliveryProviderInput.vue'
import OrderTypeInput from '~/components/new-order-form/OrderTypeInput.vue'
import CityInput from '~/components/new-order-form/CityInput.vue'
import DescriptionInput from '~/components/new-order-form/DescriptionInput.vue'
import type { NewOrderRequest } from '~/models/Order'

const props = defineProps<{
	initDataRaw: String
}>()

const emit = defineEmits(['order-created'])
defineExpose({ open })

const modalRef = ref<HTMLDialogElement | null>(null)
const deliveryProviderInputRef = ref<typeof DeliveryProviderInput | null>(null)

const description = ref('')
const trackNumber = ref('')
const city = ref<City | null>(null)
const selectedDeliveryProvider = ref<DeliveryProvider | null>(null)
const orderTypes = ref<OrderType[]>([])

const loading = ref(false)
const errorMessage = ref('')

const showDescriptionInputError = ref(false)
const showErrorToast = ref(false)

async function registerOrder() {
	if (validateForm()) {
		try {
			loading.value = true

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

			const headers = {
				headers: { Authorization: `tma ${props.initDataRaw}` },
			}

			const order = (await axios.post('/api/client/orders', orderRequest, headers)).data

			modalRef.value?.close()
			emit('order-created', order)
		} catch (ex) {
			logError(ex)
			errorMessage.value = 'Что-то пошло не так. Пожалуйста, попробуйте чуть позже.'
			showToast(showErrorToast)
		} finally {
			loading.value = false
		}
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

function resetFieldErrors() {
	showDescriptionInputError.value = false
	deliveryProviderInputRef.value?.resetErrors()
}

function open() {
	resetFieldErrors()

	description.value = ''
	trackNumber.value = ''
	city.value = null
	selectedDeliveryProvider.value = null
	orderTypes.value = []

	loading.value = false
	errorMessage.value = ''

	modalRef.value?.showModal()
}
</script>

<template>
	<div data-theme="cmyk" class="flex flex-col w-full h-full justify-center items-center">
		<dialog class="modal" ref="modalRef">
			<div class="modal-box" tabindex="0">
				<p class="text-xl text-center">Форма приема заказов</p>
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
					<button class="btn btn-outline hover:bg-gray-800" @click="modalRef?.close()">Отменить</button>
					<button class="btn bg-blue-700 text-white hover:bg-blue-800" @click="registerOrder">
						Отправить
						<span v-if="loading" class="loading loading-spinner"></span>
						<ion-icon v-else name="chevron-forward"></ion-icon>
					</button>
				</div>
			</div>
			<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
		</dialog>
	</div>
</template>
