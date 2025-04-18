<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import type { OrderStatusGeRu } from '~/enums/OrderStatusGeRu'
import type { User } from '~/models/User'
import StatusGeRuDropdown from './StatusGeRuDropdown.vue'

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits(['order-created'])

const selectedUser = ref<User | null>(null)
const status = ref<OrderStatusGeRu | null>(null)
const weight = ref('')
const price = ref('')
const weightRounded = ref(true)
const cdekTrackNumber = ref('')
const description = ref('')
const sendNotification = ref(false)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showUserInputError = ref(false)
const showStatusInputError = ref(false)
const showWeightInputError = ref(false)
const showPriceInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

const fuseUsersOptions = {
  keys: ['tg_username', 'last_name', 'first_name'],
  threshold: 0.1,
}

async function addOrder() {
  // if (validateForm()) {
  //   try {
  //     const orderRequest: OrderRequest = {
  //       status: status.value!,
  //       user_id: selectedUser.value!.id,
  //       weight_rounded: weightRounded.value,
  //       original_price: originalPrice.value ? new Decimal(originalPrice.value) : undefined,
  //       current_price: currentPrice.value ? new Decimal(currentPrice.value) : undefined,
  //       city: city.value || undefined,
  //       weight: weight.value ? new Decimal(weight.value) : undefined,
  //       additional_cost: additionalCost.value ? new Decimal(additionalCost.value) : undefined,
  //       partner_cost: partnerCost.value ? new Decimal(partnerCost.value) : undefined,
  //       description: description.value || undefined,
  //       order_type_mappings: orderTypes.value.map((orderType) => ({ order_type: orderType })),
  //       order_tracks: [],
  //       send_notification: sendNotification.value,
  //     }
  //     const order: Order = (await axios.post('/api/orders', orderRequest)).data
  //     emit('order-created', order)
  //     successMessage.value = 'Order added'
  //     showToast(showSuccessToast)
  //     close()
  //   } catch (ex) {
  //     errorMessage.value = 'Something went wrong. Please try again later.'
  //     showToast(showErrorToast)
  //   }
  // } else {
  //   errorMessage.value = 'Please fill all the required fields'
  //   showToast(showErrorToast)
  // }
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

  if (weight.value && !isValidDecimal(weight.value)) {
    valid = false
    showWeightInputError.value = true
  }

  if (price.value && !isValidDecimal(price.value)) {
    valid = false
    showPriceInputError.value = true
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
  selectedUser.value = null
  status.value = null
  weight.value = ''
  weightRounded.value = false
  price.value = ''
  cdekTrackNumber.value = ''
  description.value = ''
  sendNotification.value = false
}

function resetFieldErrors() {
  showUserInputError.value = false
  showStatusInputError.value = false
  showWeightInputError.value = false
  showPriceInputError.value = false
}

function calculatePrice() {
  let valid = true

  if (weight.value && !isValidDecimal(weight.value)) {
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
  if (weight.value && !isValidDecimal(weight.value)) {
    errorMessage.value = 'Please fill valid values'
    showWeightInputError.value = true
    showToast(showErrorToast)

    return new Decimal(0)
  }

  let finalWeight = weight.value ? new Decimal(weight.value) : new Decimal(0)

  if (weightRounded.value) {
    if (finalWeight.lte(0.5)) {
      return new Decimal(1)
    }

    const weightValueString = weight.value.toString()
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
        <p class="text-2xl text-center">New Order</p>
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
          <StatusGeRuDropdown label="Status *" :class="{ 'select-error': showStatusInputError }" v-model="status" />
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
          <Input type="text" label="Track number" placeholder="123456789" v-model="cdekTrackNumber" />
          <Textarea
            label="Description"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            v-model="description"
          />
        </div>
        <div class="modal-action flex-col items-end">
          <div class="flex flex-row gap-2">
            <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
            <button class="btn btn-success" @click="addOrder">Add</button>
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
