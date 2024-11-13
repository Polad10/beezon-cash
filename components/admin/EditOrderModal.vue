<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import type { Order, OrderRequest } from '~/models/Order'
import { OrderStatus, toDisplayString } from '~/models/OrderStatus'

const emit = defineEmits(['order-edited'])

const id = ref('')
const date = ref('')
const originalPrice = ref('')
const currentPrice = ref('')
const status = ref<OrderStatus | null>(null)
const userId = ref('')
const code = ref('')

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showDateInputError = ref(false)
const showOriginalPriceInputError = ref(false)
const showCurrentPriceInputError = ref(false)
const showStatusInputError = ref(false)
const showUserIdInputError = ref(false)
const showCodeInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

async function editOrder() {
  if (validateForm()) {
    try {
      const orderRequest: OrderRequest = {
        date: new Date(date.value),
        original_price: new Decimal(originalPrice.value),
        current_price: new Decimal(currentPrice.value),
        status: status.value!,
        user_id: userId.value,
        code: Number(code.value),
      }

      const order: Order = (await axios.put(`/api/orders/${id.value}`, orderRequest)).data
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

  if (!date.value) {
    valid = false
    showDateInputError.value = true
  }

  if (originalPrice.value === '') {
    valid = false
    showOriginalPriceInputError.value = true
  }

  if (currentPrice.value === '') {
    valid = false
    showCurrentPriceInputError.value = true
  }

  if (status.value == null) {
    valid = false
    showStatusInputError.value = true
  }

  if (!userId.value) {
    valid = false
    showUserIdInputError.value = true
  }

  if (!code.value) {
    valid = false
    showCodeInputError.value = true
  }

  return valid
}

function close() {
  modalRef.value?.close()
  resetFieldErrors()
}

function open(order: Order) {
  id.value = order.id
  date.value = toISODate(order.date)
  originalPrice.value = order.original_price.toString()
  currentPrice.value = order.current_price.toString()
  status.value = order.status
  userId.value = order.user_id
  code.value = order.code.toString()

  modalRef.value?.showModal()
}

function resetFieldErrors() {
  showDateInputError.value = false
  showOriginalPriceInputError.value = false
  showCurrentPriceInputError.value = false
  showStatusInputError.value = false
  showUserIdInputError.value = false
  showCodeInputError.value = false
}

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
          <AdminInput
            type="text"
            label="Date *"
            placeholder="2024-01-20"
            v-model="date"
            :class="{ 'input-error': showDateInputError }"
          />
          <AdminInput
            type="number"
            label="Original price *"
            placeholder="50.25"
            v-model="originalPrice"
            :class="{ 'input-error': showOriginalPriceInputError }"
          />
          <AdminInput
            type="number"
            label="Current price *"
            placeholder="50.25"
            v-model="currentPrice"
            :class="{ 'input-error': showCurrentPriceInputError }"
          />
          <label class="form-control">
            <div class="label">
              <span class="label-text">Status *</span>
            </div>
            <select
              class="select select-bordered focus-within:outline-0 focus-within:border-gray-500"
              :class="{ 'select-error': showStatusInputError }"
              v-model="status"
            >
              <option value="null" disabled>Select a status</option>
              <option :value="OrderStatus.New">{{ toDisplayString(OrderStatus.New) }}</option>
              <option :value="OrderStatus.OnTheWay">{{ toDisplayString(OrderStatus.OnTheWay) }}</option>
              <option :value="OrderStatus.ArrivedInDestinationCountry">
                {{ toDisplayString(OrderStatus.ArrivedInDestinationCountry) }}
              </option>
              <option :value="OrderStatus.WaitingForPayment">
                {{ toDisplayString(OrderStatus.WaitingForPayment) }}
              </option>
              <option :value="OrderStatus.Delivered">{{ toDisplayString(OrderStatus.Delivered) }}</option>
            </select>
          </label>
          <AdminInput
            type="text"
            label="User id *"
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            v-model="userId"
            :class="{ 'input-error': showUserIdInputError }"
          />
          <AdminInput
            type="text"
            label="Order code *"
            placeholder="123456"
            v-model="code"
            :class="{ 'input-error': showCodeInputError }"
          />
        </div>
        <div class="modal-action">
          <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
          <button class="btn btn-success" @click="editOrder">Save</button>
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
