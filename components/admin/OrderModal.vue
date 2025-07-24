<script lang="ts" setup>
import Decimal from 'decimal.js'
import type { PaymentMethod } from '~/enums/PaymentMethod'
import type { City } from '~/models/City'
import type { Order, OrderRequest } from '~/models/Order'
import type { OrderStatus } from '~/models/OrderStatus'
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'
import { OrderType, toDisplayString as orderTypeToDisplayString } from '~/models/OrderTypeMapping'
import type { User } from '~/models/User'

const props = defineProps<{
	title: string
	users: User[]
	submitBtnText: string
}>()

const emit = defineEmits(['order-submitted'])

const fuseUsersOptions = {
	keys: ['tg_username', 'last_name', 'first_name'],
	threshold: 0.1,
}

defineExpose({ open, close })

const modalRef = ref<HTMLDialogElement | null>(null)

const selectedUser = ref<User | null>(null)
const originalPrice = ref('')
const currentPrice = ref('')
const status = ref<OrderStatus | null>(null)
const city = ref<City | null>(null)
const weight = ref('')
const weightRounded = ref(true)
const additionalCost = ref('')
const partnerCost = ref('')
const description = ref('')
const orderTypes = ref<OrderType[]>([])
const deliveryProviders = ref<DeliveryProvider[]>([])
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')
const dpdTrackNumber = ref('')
const paymentMethod = ref<PaymentMethod | null>(null)
const sendNotification = ref(false)

const showStatusInputError = ref(false)
const showUserInputError = ref(false)
const showWeightInputError = ref(false)
const showAdditionalCostInputError = ref(false)
const showOriginalPriceInputError = ref(false)
const showCurrentPriceInputError = ref(false)
const showPartnerCostInputError = ref(false)

const showErrorToast = ref(false)

const errorMessage = ref('')

function close() {
	modalRef.value?.close()
	resetFieldValues()
	resetFieldErrors()
}

function open(order: Order | undefined) {
	if (order) {
		originalPrice.value = order.original_price.toString()
		currentPrice.value = order.current_price.toString()
		status.value = order.status
		selectedUser.value = props.users.find((user) => user.id === order.user_id)!
		city.value = order.city
		weight.value = order.weight.toString()
		weightRounded.value = order.weight_rounded
		additionalCost.value = order.additional_cost.toString()
		partnerCost.value = order.partner_cost.toString()
		description.value = order.description
		orderTypes.value = order.order_type_mappings.map((mapping) => mapping.order_type)
		deliveryProviders.value = order.order_tracks.map((mapping) => mapping.delivery_provider)
		paymentMethod.value = order.payment_method
		cdekTrackNumber.value =
			order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.CDEK)?.track_number || ''
		postTrackNumber.value =
			order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.PostRussia)?.track_number || ''
		boxberryTrackNumber.value =
			order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.Boxberry)?.track_number || ''
		post5TrackNumber.value =
			order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.POST5)?.track_number || ''
		dpdTrackNumber.value =
			order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.DPD)?.track_number || ''
		sendNotification.value = false
	}

	modalRef.value?.showModal()
}

function resetFieldValues() {
	selectedUser.value = null
	originalPrice.value = ''
	currentPrice.value = ''
	status.value = null
	city.value = null
	weight.value = ''
	weightRounded.value = false
	additionalCost.value = ''
	partnerCost.value = ''
	description.value = ''
	orderTypes.value = []
	deliveryProviders.value = []
	cdekTrackNumber.value = ''
	postTrackNumber.value = ''
	boxberryTrackNumber.value = ''
	post5TrackNumber.value = ''
	dpdTrackNumber.value = ''
	paymentMethod.value = null
	sendNotification.value = false
}

function resetFieldErrors() {
	showStatusInputError.value = false
	showUserInputError.value = false
	showWeightInputError.value = false
	showAdditionalCostInputError.value = false
	showOriginalPriceInputError.value = false
	showCurrentPriceInputError.value = false
	showPartnerCostInputError.value = false
}

const formattedWeight = computed(() => {
	return formatNumber(weight.value)
})

const formattedAdditionalCost = computed(() => {
	return formatNumber(additionalCost.value)
})

const formattedPartnerCost = computed(() => {
	return formatNumber(partnerCost.value)
})

const formattedOriginalPrice = computed(() => {
	return formatNumber(originalPrice.value)
})

const formattedCurrentPrice = computed(() => {
	return formatNumber(currentPrice.value)
})

const roundedWeight = computed(() => {
	if (formattedWeight.value && !isValidDecimal(formattedWeight.value)) {
		errorMessage.value = 'Please fill valid values'
		showWeightInputError.value = true
		showToast(showErrorToast)

		return new Decimal(0)
	}

	let finalWeight = formattedWeight.value ? new Decimal(formattedWeight.value) : new Decimal(0)

	if (weightRounded.value) {
		if (finalWeight.lte(0.5)) {
			return new Decimal(1)
		}

		const weightValueString = formattedWeight.value.toString()
		const weightDecimalsString = weightValueString.includes('.') ? weightValueString.split('.')[1] : '0'
		const zeroPrefixedWeightDecimalsString = `0.${weightDecimalsString}`
		const weightDecimals = new Decimal(zeroPrefixedWeightDecimalsString)

		if (weightDecimals.gt(0)) {
			if (weightDecimals.lt(0.5)) {
				finalWeight = new Decimal(`${weightValueString.split('.')[0]}.5`)
			} else if (weightDecimals.gt(0.5)) {
				finalWeight = new Decimal(`${new Decimal(weightValueString.split('.')[0]).add(1)}.0`)
			}
		}
	}

	return finalWeight
})

function calculatePrice() {
	let valid = true

	if (formattedWeight.value && !isValidDecimal(formattedWeight.value)) {
		valid = false
		showWeightInputError.value = true
	}

	if (formattedAdditionalCost.value && !isValidDecimal(formattedAdditionalCost.value)) {
		valid = false
		showAdditionalCostInputError.value = true
	}

	if (!valid) {
		errorMessage.value = 'Please fill valid values'
		showToast(showErrorToast)

		return
	}

	const additionalCostDecimal = formattedAdditionalCost.value
		? new Decimal(formattedAdditionalCost.value)
		: new Decimal(0)

	originalPrice.value = currentPrice.value = roundedWeight.value.mul(18).add(additionalCostDecimal).toString()
}

function submit() {
	if (validateForm()) {
		const orderRequest: OrderRequest = {
			status: status.value!,
			user_id: selectedUser.value!.id,
			weight_rounded: weightRounded.value,
			original_price: formattedOriginalPrice.value ? new Decimal(formattedOriginalPrice.value) : undefined,
			current_price: formattedCurrentPrice.value ? new Decimal(formattedCurrentPrice.value) : undefined,
			city: city.value || undefined,
			weight: formattedWeight.value ? new Decimal(formattedWeight.value) : undefined,
			additional_cost: formattedAdditionalCost.value ? new Decimal(formattedAdditionalCost.value) : undefined,
			partner_cost: formattedPartnerCost.value ? new Decimal(formattedPartnerCost.value) : undefined,
			description: description.value || undefined,
			payment_method: paymentMethod.value || undefined,
			order_type_mappings: orderTypes.value.map((orderType) => ({ order_type: orderType })),
			order_tracks: [],
			send_notification: sendNotification.value,
		}

		if (deliveryProviders.value.includes(DeliveryProvider.Ozon)) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.Ozon,
			})
		}

		if (deliveryProviders.value.includes(DeliveryProvider.Wilbderries)) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.Wilbderries,
			})
		}

		if (deliveryProviders.value.includes(DeliveryProvider.Cold)) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.Cold,
			})
		}

		if (cdekTrackNumber.value) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.CDEK,
				track_number: cdekTrackNumber.value,
			})
		}

		if (postTrackNumber.value) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.PostRussia,
				track_number: postTrackNumber.value,
			})
		}

		if (boxberryTrackNumber.value) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.Boxberry,
				track_number: boxberryTrackNumber.value,
			})
		}

		if (post5TrackNumber.value) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.POST5,
				track_number: post5TrackNumber.value,
			})
		}

		if (dpdTrackNumber.value) {
			orderRequest.order_tracks.push({
				delivery_provider: DeliveryProvider.DPD,
				track_number: dpdTrackNumber.value,
			})
		}

		emit('order-submitted', orderRequest)
	} else {
		errorMessage.value = 'Please fill all the required fields'
		showToast(showErrorToast)
	}
}

function validateForm() {
	resetFieldErrors()
	let valid = true

	if (status.value == null) {
		valid = false
		showStatusInputError.value = true
	}

	if (!selectedUser.value) {
		valid = false
		showUserInputError.value = true
	}

	if (formattedWeight.value && !isValidDecimal(formattedWeight.value)) {
		valid = false
		showWeightInputError.value = true
	}

	if (formattedAdditionalCost.value && !isValidDecimal(formattedAdditionalCost.value)) {
		valid = false
		showAdditionalCostInputError.value = true
	}

	if (formattedOriginalPrice.value && !isValidDecimal(formattedOriginalPrice.value)) {
		valid = false
		showOriginalPriceInputError.value = true
	}

	if (formattedCurrentPrice.value && !isValidDecimal(formattedCurrentPrice.value)) {
		valid = false
		showCurrentPriceInputError.value = true
	}

	if (formattedPartnerCost.value && !isValidDecimal(formattedPartnerCost.value)) {
		valid = false
		showPartnerCostInputError.value = true
	}

	return valid
}
</script>

<template>
	<div>
		<dialog class="modal" ref="modalRef">
			<div class="modal-box">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
				<p class="text-2xl text-center">{{ title }}</p>
				<div class="divider"></div>
				<div class="flex flex-col gap-2">
					<SelectWithSearch
						placeholder="Select a user"
						:options="users"
						:fuse-options="fuseUsersOptions"
						:class="{ 'input-error': showUserInputError }"
						:get-option-string="getUserNameAndTelegram"
						v-model="selectedUser"
					/>
					<AdminStatusDropdown label="Status *" :class="{ 'select-error': showStatusInputError }" v-model="status" />
					<div>
						<Input
							type="text"
							label="Weight"
							placeholder="0"
							v-model="weight"
							:class="{ 'input-error': showWeightInputError }"
						/>
						<label class="label cursor-pointer justify-normal gap-2">
							<input type="checkbox" class="checkbox checkbox-xs" v-model="weightRounded" />
							<span
								class="label-text text-xs"
								v-html="weightRounded ? `Rounded weight: <b>${roundedWeight}</b>` : 'Round weight'"
							></span>
						</label>
					</div>
					<Input
						type="text"
						label="Additional cost"
						placeholder="0"
						v-model="additionalCost"
						:class="{ 'input-error': showAdditionalCostInputError }"
					/>
					<div class="flex flex-row items-end gap-2">
						<Input
							type="text"
							label="Original price"
							placeholder="50.25"
							v-model="originalPrice"
							:class="{ 'input-error': showOriginalPriceInputError }"
						/>
						<button class="btn text-2xl btn-square btn-outline" @click="calculatePrice">
							<ion-icon name="calculator-outline"></ion-icon>
						</button>
					</div>
					<Input
						type="text"
						label="Current price"
						placeholder="50.25"
						v-model="currentPrice"
						:class="{ 'input-error': showCurrentPriceInputError }"
					/>
					<CityDropdown label="City" placeholder="Select a city" v-model="city" />
					<Input
						type="text"
						label="Partner cost"
						placeholder="0"
						v-model="partnerCost"
						:class="{ 'input-error': showPartnerCostInputError }"
					/>
					<div class="collapse collapse-arrow">
						<input type="checkbox" />
						<div class="collapse-title text-lg font-medium pl-0">Additional info</div>
						<div class="collapse-content pl-0 flex flex-col gap-2">
							<PaymentMethodDropdown
								label="Payment method"
								placeholder="Select a payment method"
								v-model="paymentMethod"
							/>
							<div class="flex flex-row gap-3">
								<label class="label cursor-pointer justify-normal gap-2">
									<input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Drugs" v-model="orderTypes" />
									<span class="label-text">{{ orderTypeToDisplayString(OrderType.Drugs) }}</span>
								</label>
								<label class="label cursor-pointer justify-normal gap-2">
									<input
										type="checkbox"
										class="checkbox checkbox-sm"
										:value="OrderType.Electronics"
										v-model="orderTypes"
									/>
									<span class="label-text">{{ orderTypeToDisplayString(OrderType.Electronics) }}</span>
								</label>
								<label class="label cursor-pointer justify-normal gap-2">
									<input
										type="checkbox"
										class="checkbox checkbox-sm"
										:value="OrderType.Commercial"
										v-model="orderTypes"
									/>
									<span class="label-text">{{ orderTypeToDisplayString(OrderType.Commercial) }}</span>
								</label>
							</div>
							<Textarea
								label="Description"
								placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
								v-model="description"
							/>
							<div class="flex flex-row gap-x-1 flex-wrap">
								<label class="label cursor-pointer justify-normal gap-2 font-light">
									<input
										type="checkbox"
										class="checkbox checkbox-sm"
										:value="DeliveryProvider.Ozon"
										v-model="deliveryProviders"
									/>
									<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Ozon) }}</span>
								</label>
								<label class="label cursor-pointer justify-normal gap-2 font-light">
									<input
										type="checkbox"
										class="checkbox checkbox-sm"
										:value="DeliveryProvider.Wilbderries"
										v-model="deliveryProviders"
									/>
									<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Wilbderries) }}</span>
								</label>
								<label class="label cursor-pointer justify-normal gap-2 font-light">
									<input
										type="checkbox"
										class="checkbox checkbox-sm"
										:value="DeliveryProvider.Cold"
										v-model="deliveryProviders"
									/>
									<span>{{ deliveryProviderToDisplayString(DeliveryProvider.Cold) }}</span>
								</label>
							</div>
							<Input
								type="text"
								:label="`Track number ${deliveryProviderToDisplayString(DeliveryProvider.CDEK)}`"
								placeholder="123456789"
								v-model="cdekTrackNumber"
							/>
							<Input
								type="text"
								:label="`Track number ${deliveryProviderToDisplayString(DeliveryProvider.PostRussia)}`"
								placeholder="123456789"
								v-model="postTrackNumber"
							/>
							<Input
								type="text"
								:label="`Track number ${deliveryProviderToDisplayString(DeliveryProvider.Boxberry)}`"
								placeholder="123456789"
								v-model="boxberryTrackNumber"
							/>
							<Input
								type="text"
								:label="`Track number ${deliveryProviderToDisplayString(DeliveryProvider.POST5)}`"
								placeholder="123456789"
								v-model="post5TrackNumber"
							/>
							<Input
								type="text"
								:label="`Track number ${deliveryProviderToDisplayString(DeliveryProvider.DPD)}`"
								placeholder="123456789"
								v-model="dpdTrackNumber"
							/>
						</div>
					</div>
				</div>
				<div class="modal-action flex-col items-end">
					<div class="flex flex-row gap-2">
						<button class="btn btn-warning btn-outline" @click="close">Cancel</button>
						<button class="btn btn-success" @click="submit">{{ submitBtnText }}</button>
					</div>
					<label class="label cursor-pointer justify-normal gap-2 mt-2">
						<input type="checkbox" class="checkbox checkbox-xs" v-model="sendNotification" />
						<span class="label-text text-xs">Send notification</span>
					</label>
				</div>
			</div>
			<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
		</dialog>
	</div>
</template>
