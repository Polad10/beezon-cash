<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import type { OrderStatusGeRu } from '~/enums/OrderStatusGeRu'
import type { User } from '~/models/User'
import StatusGeRuDropdown from './StatusGeRuDropdown.vue'
import type { OrderGeRu, OrderGeRuRequest } from '~/models/OrderGeRu'
import PaymentMethodDropdown from './PaymentMethodDropdown.vue'
import { PaymentMethod } from '~/enums/PaymentMethod'

const props = defineProps<{
	users: User[]
}>()

const emit = defineEmits(['order-edited'])

const id = ref('')
const selectedUser = ref<User | null>(null)
const status = ref<OrderStatusGeRu | null>(null)
const receiverName = ref('')
const receiverPhoneNr = ref('')
const receiverAddress = ref('')
const weight = ref('')
const weightRounded = ref(true)
const price = ref('')
const hintPrice = ref('')
const cdekTrackNumber = ref('')
const description = ref('')
const paymentMethod = ref<PaymentMethod | null>(null)
const sendNotification = ref(false)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showUserInputError = ref(false)
const showStatusInputError = ref(false)
const showReceiverNameInputError = ref(false)
const showReceiverPhoneNrInputError = ref(false)
const showReceiverAddressInputError = ref(false)
const showWeightInputError = ref(false)
const showPriceInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

const formattedWeight = computed(() => {
	return formatNumber(weight.value)
})

const formattedPrice = computed(() => {
	return formatNumber(price.value)
})

async function saveOrder() {
	if (validateForm()) {
		try {
			const orderRequest: OrderGeRuRequest = {
				original_price: formattedPrice.value ? new Decimal(formattedPrice.value) : new Decimal(0),
				current_price: formattedPrice.value ? new Decimal(formattedPrice.value) : new Decimal(0),
				status: status.value!,
				user_id: selectedUser.value!.id,
				description: description.value,
				weight: formattedWeight.value ? new Decimal(formattedWeight.value) : new Decimal(0),
				weight_rounded: weightRounded.value,
				hint_price: hintPrice.value,
				receiver_name: receiverName.value,
				receiver_phone_nr: receiverPhoneNr.value,
				receiver_address: receiverAddress.value,
				cdek_track_nr: cdekTrackNumber.value,
				payment_method: paymentMethod.value || undefined,
				send_notification: sendNotification.value,
			}

			const order: OrderGeRu = (await axios.put(`/api/admin/geru/orders/${id.value}`, orderRequest)).data
			emit('order-edited', order)

			successMessage.value = 'Saved'
			showToast(showSuccessToast)

			close()
		} catch (ex) {
			errorMessage.value = 'Something went wrong. Please try again later.'
			showToast(showErrorToast)
		}
	} else {
		errorMessage.value = 'Please fill all the required fields'
		showToast(showErrorToast)
	}
}

function validateForm() {
	resetFieldErrors()
	let valid = true

	if (!selectedUser.value) {
		valid = false
		showUserInputError.value = true
	}

	if (status.value == null) {
		valid = false
		showStatusInputError.value = true
	}

	if (!receiverName.value) {
		valid = false
		showReceiverNameInputError.value = true
	}

	if (!receiverPhoneNr.value) {
		valid = false
		showReceiverPhoneNrInputError.value = true
	}

	if (!receiverAddress.value) {
		valid = false
		showReceiverAddressInputError.value = true
	}

	if (formattedWeight.value && !isValidDecimal(formattedWeight.value)) {
		valid = false
		showWeightInputError.value = true
	}

	if (formattedPrice.value && !isValidDecimal(formattedPrice.value)) {
		valid = false
		showPriceInputError.value = true
	}

	return valid
}

function close() {
	modalRef.value?.close()
	resetFieldErrors()
}

function open(order: OrderGeRu) {
	id.value = order.id
	selectedUser.value = props.users.find((user) => user.id === order.user_id)!
	status.value = order.status
	receiverName.value = order.receiver_name
	receiverPhoneNr.value = order.receiver_phone_nr
	receiverAddress.value = order.receiver_address
	weight.value = order.weight.toString()
	weightRounded.value = order.weight_rounded
	price.value = order.current_price.toString()
	hintPrice.value = order.hint_price
	cdekTrackNumber.value = order.cdek_track_nr || ''
	description.value = order.description || ''
	paymentMethod.value = order.payment_method
	sendNotification.value = false

	modalRef.value?.showModal()
}

function resetFieldErrors() {
	showUserInputError.value = false
	showStatusInputError.value = false
	showReceiverNameInputError.value = false
	showReceiverPhoneNrInputError.value = false
	showReceiverAddressInputError.value = false
	showWeightInputError.value = false
	showPriceInputError.value = false
}

function calculatePrice() {
	let valid = true

	if (formattedWeight.value && !isValidDecimal(formattedWeight.value)) {
		valid = false
		showWeightInputError.value = true
	}

	if (!valid) {
		errorMessage.value = 'Please fill valid values'
		showToast(showErrorToast)

		return
	}

	price.value = roundedWeight.value.mul(20).toString()
}

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

defineExpose({ open })
</script>

<template>
	<div>
		<dialog class="modal" ref="modalRef">
			<div class="modal-box">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
				<p class="text-2xl text-center">Edit Order</p>
				<div class="divider"></div>
				<div class="flex flex-col gap-2">
					<SelectWithSearch
						placeholder="Select a user"
						:options="users"
						:fuse-options="fuseSelectUserOptions"
						:class="{ 'input-error': showUserInputError }"
						:get-option-string="getUserNameAndTelegram"
						v-model="selectedUser"
					/>
					<StatusGeRuDropdown label="Status *" :class="{ 'select-error': showStatusInputError }" v-model="status" />
					<Input
						type="text"
						label="Receiver's name *"
						placeholder="Full name"
						v-model="receiverName"
						:class="{ 'input-error': showReceiverNameInputError }"
					/>
					<Input
						type="text"
						label="Receiver's phone number *"
						placeholder="+79999097878"
						v-model="receiverPhoneNr"
						:class="{ 'input-error': showReceiverPhoneNrInputError }"
					/>
					<Input
						type="text"
						label="Receiver's address *"
						placeholder="Address"
						v-model="receiverAddress"
						:class="{ 'input-error': showReceiverAddressInputError }"
					/>
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
					<div class="flex flex-row items-end gap-2">
						<Input
							type="text"
							label="Price"
							placeholder="50.25"
							v-model="price"
							:class="{ 'input-error': showPriceInputError }"
						/>
						<button class="btn text-2xl btn-square btn-outline" @click="calculatePrice">
							<ion-icon name="calculator-outline"></ion-icon>
						</button>
					</div>
					<Input type="text" label="Hint price" placeholder="50.25" v-model="hintPrice" />
					<Textarea
						label="Description"
						placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
						v-model="description"
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
							<Input type="text" label="Track number" placeholder="123456789" v-model="cdekTrackNumber" />
						</div>
					</div>
				</div>
				<div class="modal-action flex-col items-end">
					<div class="flex flex-row gap-2">
						<button class="btn btn-warning btn-outline" @click="close">Cancel</button>
						<button class="btn btn-success" @click="saveOrder">Save</button>
					</div>
					<label class="label cursor-pointer justify-normal gap-2 mt-2">
						<input type="checkbox" class="checkbox checkbox-xs" v-model="sendNotification" />
						<span class="label-text text-xs">Send notification</span>
					</label>
				</div>
			</div>
			<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
		</dialog>
		<Toast
			v-if="showSuccessToast"
			class="alert-success"
			icon-name="checkmark-circle-outline"
			:message="successMessage"
		/>
	</div>
</template>
