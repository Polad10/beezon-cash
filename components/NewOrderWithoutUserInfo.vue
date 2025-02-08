<script lang="ts" setup>
import axios from 'axios'
import type { City } from '~/models/City'
import { DeliveryProvider } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import DeliveryProviderInput from '~/components/new-order-form/DeliveryProviderInput.vue'
import OrderTypeInput from '~/components/new-order-form/OrderTypeInput.vue'
import CityInput from '~/components/new-order-form/CityInput.vue'
import FormInput from '~/components/new-order-form/FormInput.vue'
import DescriptionInput from '~/components/new-order-form/DescriptionInput.vue'
import type { NewOrderRequest } from '~/models/Order'

const props = defineProps<{
  initDataRaw: String
}>()

const emit = defineEmits(['order-created'])
defineExpose({ open })

const modalRef = ref<HTMLDialogElement | null>(null)

const description = ref('')
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')
const city = ref<City | null>(null)
const deliveryProviders = ref<DeliveryProvider[]>([])
const orderTypes = ref<OrderType[]>([])

const loading = ref(false)
const errorMessage = ref('')

const showDescriptionInputError = ref(false)
const showCdekTrackNumberInputError = ref(false)
const showPostTrackNumberInputError = ref(false)
const showBoxberryTrackNumberInputError = ref(false)
const showPost5TrackNumberInputError = ref(false)
const showDeliveryProviderInputError = ref(false)
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

      const headers = {
        headers: { Authorization: `tma ${props.initDataRaw}` },
      }

      const order = (await axios.post('api/me/orders', orderRequest, headers)).data

      modalRef.value?.close()
      emit('order-created', order)
    } catch (ex) {
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

  if (deliveryProviders.value.length === 0) {
    showDeliveryProviderInputError.value = true
    valid = false
  }

  if (deliveryProviders.value.includes(DeliveryProvider.CDEK) && !cdekTrackNumber.value) {
    valid = false
    showCdekTrackNumberInputError.value = true
  }

  if (deliveryProviders.value.includes(DeliveryProvider.PostRussia) && !postTrackNumber.value) {
    valid = false
    showPostTrackNumberInputError.value = true
  }

  if (deliveryProviders.value.includes(DeliveryProvider.POST5) && !post5TrackNumber.value) {
    valid = false
    showPost5TrackNumberInputError.value = true
  }

  if (deliveryProviders.value.includes(DeliveryProvider.Boxberry) && !boxberryTrackNumber.value) {
    valid = false
    showBoxberryTrackNumberInputError.value = true
  }

  return valid
}

function resetFieldErrors() {
  showDescriptionInputError.value = false
  showCdekTrackNumberInputError.value = false
  showPostTrackNumberInputError.value = false
  showBoxberryTrackNumberInputError.value = false
  showPost5TrackNumberInputError.value = false
  showDeliveryProviderInputError.value = false
}

function open() {
  resetFieldErrors()

  description.value = ''
  cdekTrackNumber.value = ''
  postTrackNumber.value = ''
  boxberryTrackNumber.value = ''
  post5TrackNumber.value = ''
  city.value = null
  deliveryProviders.value = []
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
            label="Где нам нужно будет получить заказ?"
            v-model="deliveryProviders"
            :show-input-error="showDeliveryProviderInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.CDEK)"
            label="Трек-номер CDEK"
            v-model="cdekTrackNumber"
            :show-input-error="showCdekTrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.PostRussia)"
            label="Трек-номер Почты России"
            v-model="postTrackNumber"
            :show-input-error="showPostTrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.POST5)"
            label="Трек-номер 5POST"
            v-model="post5TrackNumber"
            :show-input-error="showPost5TrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.Boxberry)"
            label="Трек-номер Boxberry"
            v-model="boxberryTrackNumber"
            :show-input-error="showBoxberryTrackNumberInputError"
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
