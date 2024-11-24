<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import { City } from '~/models/City'
import type { Order, OrderRequest } from '~/models/Order'
import { OrderStatus } from '~/models/OrderStatus'
import { OrderType, toDisplayString as orderTypeToDisplayString } from '~/models/OrderTypeMapping'
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'

const emit = defineEmits(['order-edited'])

const id = ref('')
const originalPrice = ref('')
const currentPrice = ref('')
const status = ref<OrderStatus | null>(null)
const userId = ref('')
const city = ref<City | null>(null)
const weight = ref<number | ''>('')
const weightRounded = ref(false)
const additionalCost = ref('')
const partnerCost = ref('')
const description = ref('')
const orderTypes = ref<OrderType[]>([])
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showStatusInputError = ref(false)
const showUserIdInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

async function editOrder() {
  if (validateForm()) {
    try {
      const orderRequest: OrderRequest = {
        date: new Date(),
        status: status.value!,
        user_id: userId.value,
        weight_rounded: weightRounded.value,
        original_price: originalPrice.value ? new Decimal(originalPrice.value) : new Decimal(0),
        current_price: currentPrice.value ? new Decimal(currentPrice.value) : new Decimal(0),
        city: city.value || City.Other,
        weight: weight.value ? new Decimal(weight.value) : new Decimal(0),
        additional_cost: additionalCost.value ? new Decimal(additionalCost.value) : new Decimal(0),
        partner_cost: partnerCost.value ? new Decimal(partnerCost.value) : new Decimal(0),
        description: description.value,
        order_type_mappings: orderTypes.value.map((orderType) => ({ order_type: orderType })),
        order_tracks: [],
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

  if (status.value == null) {
    valid = false
    showStatusInputError.value = true
  }

  if (!userId.value) {
    valid = false
    showUserIdInputError.value = true
  }

  return valid
}

function close() {
  modalRef.value?.close()
  resetFieldErrors()
}

function open(order: Order) {
  id.value = order.id
  originalPrice.value = order.original_price.toString()
  currentPrice.value = order.current_price.toString()
  status.value = order.status
  userId.value = order.user_id
  city.value = order.city
  weight.value = order.weight.toNumber()
  weightRounded.value = order.weight_rounded
  additionalCost.value = order.additional_cost.toString()
  partnerCost.value = order.partner_cost.toString()
  description.value = order.description
  orderTypes.value = order.order_type_mappings.map((mapping) => mapping.order_type)
  cdekTrackNumber.value =
    order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.CDEK)?.track_number || ''
  postTrackNumber.value =
    order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.PostRussia)?.track_number || ''
  boxberryTrackNumber.value =
    order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.Boxberry)?.track_number || ''
  post5TrackNumber.value =
    order.order_tracks.find((track) => track.delivery_provider === DeliveryProvider.POST5)?.track_number || ''

  modalRef.value?.showModal()
}

function resetFieldErrors() {
  showStatusInputError.value = false
  showUserIdInputError.value = false
}

function calculatePrice() {
  const additionalCostDecimal = additionalCost.value ? new Decimal(additionalCost.value) : new Decimal(0)

  originalPrice.value = roundedWeight.value.mul(18).add(additionalCostDecimal).toString()
}

const roundedWeight = computed(() => {
  let finalWeight = weight.value ? new Decimal(weight.value) : new Decimal(0)
  const weightValueString = weight.value.toString()

  if (weightRounded.value) {
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
          <Input
            type="text"
            label="User id *"
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            v-model="userId"
            :class="{ 'input-error': showUserIdInputError }"
          />
          <AdminStatusDropdown :class="{ 'select-error': showStatusInputError }" v-model="status" />
          <div>
            <Input type="number" label="Weight" placeholder="0" v-model="weight" />
            <label class="label cursor-pointer justify-normal gap-2">
              <input type="checkbox" class="checkbox checkbox-xs" v-model="weightRounded" />
              <span
                class="label-text text-xs"
                v-html="weightRounded ? `Rounded weight: <b>${roundedWeight}</b>` : 'Round weight'"
              ></span>
            </label>
          </div>
          <Input type="number" label="Additional cost" placeholder="0" v-model="additionalCost" />
          <div class="flex flex-row items-end gap-2">
            <Input type="number" label="Original price" placeholder="50.25" v-model="originalPrice" />
            <button class="btn text-2xl btn-square btn-outline" @click="calculatePrice">
              <ion-icon name="calculator-outline"></ion-icon>
            </button>
          </div>
          <Input type="number" label="Current price" placeholder="50.25" v-model="currentPrice" />
          <CityDropdown label="City" placeholder="Select a city" v-model="city" />
          <Input type="number" label="Partner cost" placeholder="0" v-model="partnerCost" />
          <div class="collapse collapse-arrow">
            <input type="checkbox" />
            <div class="collapse-title text-lg font-medium pl-0">Additional info</div>
            <div class="collapse-content pl-0 flex flex-col gap-2">
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
            </div>
          </div>
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
