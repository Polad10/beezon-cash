<script lang="ts" setup>
import axios from 'axios'
import type { Message, MessageRequest } from '~/models/Message'
import { OrderStatus } from '~/models/OrderStatus'

const emit = defineEmits(['message-created'])

const name = ref('')
const text = ref('')
const orderStatus = ref<OrderStatus | null>(null)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showNameInputError = ref(false)
const showTextInputError = ref(false)
const showOrderStatusInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

async function addMessage() {
	if (validateForm()) {
		try {
			const MessageRequest: MessageRequest = {
				name: name.value,
				text: text.value,
				order_status: orderStatus.value!,
			}

			const message: Message = (await axios.post('/api/admin/messages', MessageRequest)).data
			emit('message-created', message)

			successMessage.value = 'Message added'
			showToast(showSuccessToast)

			close()
		} catch (ex) {
			logError(ex)
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

	if (!name.value) {
		valid = false
		showNameInputError.value = true
	}

	if (!text.value) {
		valid = false
		showTextInputError.value = true
	}

	if (orderStatus.value == null) {
		valid = false
		showOrderStatusInputError.value = true
	}

	return valid
}

function close() {
	modalRef.value?.close()
	resetFieldValues()
	resetFieldErrors()
}

function open() {
	modalRef.value?.showModal()
}

function resetFieldValues() {
	name.value = ''
	text.value = ''
	orderStatus.value = null
}

function resetFieldErrors() {
	showNameInputError.value = false
	showTextInputError.value = false
	showOrderStatusInputError.value = false
}

defineExpose({ open })
</script>

<template>
	<div>
		<dialog class="modal" ref="modalRef">
			<div class="modal-box">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
				<p class="text-2xl text-center">New Message</p>
				<div class="divider"></div>
				<div class="flex flex-col gap-2">
					<Input
						type="text"
						label="Name *"
						placeholder="Some short name"
						v-model="name"
						:class="{ 'input-error': showNameInputError }"
					/>
					<Textarea
						label="Text *"
						placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
						v-model="text"
						:class="{ 'textarea-error': showTextInputError }"
					/>
					<AdminStatusDropdown
						label="Status *"
						:class="{ 'select-error': showOrderStatusInputError }"
						v-model="orderStatus"
					/>
				</div>
				<div class="modal-action">
					<button class="btn btn-warning btn-outline" @click="close">Cancel</button>
					<button class="btn btn-success" @click="addMessage">Add</button>
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
