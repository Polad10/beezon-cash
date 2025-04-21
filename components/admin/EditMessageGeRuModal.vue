<script lang="ts" setup>
import axios from 'axios'
import type { OrderStatusGeRu } from '~/enums/OrderStatusGeRu'
import type { MessageGeRu, MessageGeRuRequest } from '~/models/MessageGeRu'
import StatusGeRuDropdown from './StatusGeRuDropdown.vue'

const emit = defineEmits(['message-edited'])

const id = ref<number | null>(null)
const name = ref('')
const text = ref('')
const orderStatus = ref<OrderStatusGeRu | null>(null)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showNameInputError = ref(false)
const showTextInputError = ref(false)
const showOrderStatusInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

async function saveMessage() {
  if (validateForm()) {
    try {
      const MessageRequest: MessageGeRuRequest = {
        name: name.value,
        text: text.value,
        order_status: orderStatus.value!,
      }

      const message: MessageGeRu = (await axios.put(`/api/geru/admin/messages/${id.value}`, MessageRequest)).data
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

function open(message: MessageGeRu) {
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
          <StatusGeRuDropdown
            label="Status *"
            :class="{ 'select-error': showOrderStatusInputError }"
            v-model="orderStatus"
          />
        </div>
        <div class="modal-action">
          <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
          <button class="btn btn-success" @click="saveMessage">Save</button>
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
