<script lang="ts" setup>
import axios from 'axios'
import type { Message, MessageRequest } from '~/models/Message'
import { OrderStatus } from '~/models/OrderStatus'

const emit = defineEmits(['message-edited'])

const id = ref<Number | null>(null)
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

async function editMessage() {
  if (validateForm()) {
    try {
      const messageRequest: MessageRequest = {
        name: name.value,
        text: text.value,
        order_status: orderStatus.value!,
      }

      const message: Message = (await axios.put(`/api/messages/${id.value}`, messageRequest)).data
      emit('message-edited', message)

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
  resetFieldErrors()
}

function open(message: Message) {
  id.value = message.id
  name.value = message.name
  text.value = message.text
  orderStatus.value = message.order_status

  modalRef.value?.showModal()
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
        <p class="text-2xl text-center">Edit Message</p>
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
          <AdminStatusDropdown :class="{ 'select-error': showOrderStatusInputError }" v-model="orderStatus" />
        </div>
        <div class="modal-action">
          <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
          <button class="btn btn-success" @click="editMessage">Save</button>
        </div>
      </div>
      <div v-if="showErrorToast" class="toast toast-top whitespace-normal z-[9999] inset-x-0 top-0 mx-auto w-[200px]">
        <div
          class="alert alert-error text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
        >
          <ion-icon name="close-circle-outline" class="text-xl ml-px"></ion-icon>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </dialog>
    <div v-if="showSuccessToast" class="toast toast-top whitespace-normal z-[9999] inset-x-0 top-0 mx-auto w-[200px]">
      <div
        class="alert alert-success text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
      >
        <ion-icon name="checkmark-circle-outline" class="text-xl ml-px"></ion-icon>
        <span>{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>
