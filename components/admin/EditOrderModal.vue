<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import { City } from '~/models/City'
import type { Order, OrderRequest } from '~/models/Order'
import { OrderStatus } from '~/models/OrderStatus'
import { OrderType, toDisplayString as orderTypeToDisplayString } from '~/models/OrderTypeMapping'
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'

import type { User } from '~/models/User'

const props = defineProps<{
  users: User[]
}>()

const emit = defineEmits(['order-edited'])

const id = ref('')
const originalPrice = ref('')
const currentPrice = ref('')
const status = ref<OrderStatus | null>(null)
const selectedUser = ref<User | null>(null)
const city = ref<City | null>(null)
const weight = ref('')
const weightRounded = ref(false)
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
const sendNotification = ref(false)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showStatusInputError = ref(false)
const showUserInputError = ref(false)
const showWeightInputError = ref(false)
const showAdditionalCostInputError = ref(false)
const showOriginalPriceInputError = ref(false)
const showCurrentPriceInputError = ref(false)
const showPartnerCostInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

const fuseUsersOptions = {
  keys: ['tg_username', 'last_name', 'first_name'],
  threshold: 0.1,
}

async function editOrder() {
  if (validateForm()) {
    try {
      const orderRequest: OrderRequest = {
        status: status.value!,
        user_id: selectedUser.value!.id,
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

  if (!selectedUser.value) {
    valid = false
    showUserInputError.value = true
  }

  if (weight.value && !isValidDecimal(weight.value)) {
    valid = false
    showWeightInputError.value = true
  }

  if (additionalCost.value && !isValidDecimal(additionalCost.value)) {
    valid = false
    showAdditionalCostInputError.value = true
  }

  if (originalPrice.value && !isValidDecimal(originalPrice.value)) {
    valid = false
    showOriginalPriceInputError.value = true
  }

  if (currentPrice.value && !isValidDecimal(currentPrice.value)) {
    valid = false
    showCurrentPriceInputError.value = true
  }

  if (partnerCost.value && !isValidDecimal(partnerCost.value)) {
    valid = false
    showPartnerCostInputError.value = true
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
  selectedUser.value = props.users.find((user) => user.id === order.user_id)!
  city.value = order.city
  weight.value = order.weight.toString()
  weightRounded.value = order.weight_rounded
  additionalCost.value = order.additional_cost.toString()
  partnerCost.value = order.partner_cost.toString()
  description.value = order.description
  orderTypes.value = order.order_type_mappings.map((mapping) => mapping.order_type)
  deliveryProviders.value = order.order_tracks.map((mapping) => mapping.delivery_provider)
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

  modalRef.value?.showModal()
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

function calculatePrice() {
  let valid = true

  if (weight.value && !isValidDecimal(weight.value)) {
    valid = false
    showWeightInputError.value = true
  }

  if (additionalCost.value && !isValidDecimal(additionalCost.value)) {
    valid = false
    showAdditionalCostInputError.value = true
  }

  if (!valid) {
    errorMessage.value = 'Please fill valid values'
    showToast(showErrorToast)

    return
  }

  const additionalCostDecimal = additionalCost.value ? new Decimal(additionalCost.value) : new Decimal(0)

  originalPrice.value = currentPrice.value = roundedWeight.value.mul(18).add(additionalCostDecimal).toString()
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
        <p class="text-2xl text-center">Edit Order</p>
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
            <button class="btn btn-success" @click="editOrder">Save</button>
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
