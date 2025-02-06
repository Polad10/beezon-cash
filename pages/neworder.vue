<script lang="ts" setup>
import axios from 'axios'
import type { City } from '~/models/City'
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import type { UserOrderRequest } from '~/models/UserOrder'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ErrorName } from '~/enums/exceptions/ErrorName'
import { TelegramEntityErrorType } from '~/enums/exceptions/TelegramEntityErrorType'

const userOrderCookie = useCookie<UserOrderRequest | null>('user-order-cookie', { maxAge: 365 * 24 * 60 * 60 })
const modalRef = ref<HTMLDialogElement | null>(null)

const firstName = ref(userOrderCookie.value?.first_name || '')
const lastName = ref(userOrderCookie.value?.last_name || '')
const phoneNr = ref(userOrderCookie.value?.phone_nr || '')
const tgUserName = ref(userOrderCookie.value?.tg_username || '')
const description = ref('')
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')
const inviteCode = ref(userOrderCookie.value?.invite_code || '')
const city = ref<City | null>(userOrderCookie.value?.city || null)
const deliveryProviders = ref<DeliveryProvider[]>([])
const orderTypes = ref<OrderType[]>([])
const hasReferralCode = ref(userOrderCookie.value?.invite_code ? true : false)

const orderRegistered = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTgUsernameInputError = ref(false)
const showDescriptionInputError = ref(false)
const showCdekTrackNumberInputError = ref(false)
const showPostTrackNumberInputError = ref(false)
const showBoxberryTrackNumberInputError = ref(false)
const showPost5TrackNumberInputError = ref(false)
const showDeliveryProviderInputError = ref(false)
const showErrorToast = ref(false)

onMounted(() => {
  modalRef.value?.showModal()
})

async function registerOrder() {
  if (validateForm()) {
    try {
      loading.value = true

      const userOrderRequest: UserOrderRequest = {
        first_name: firstName.value,
        last_name: lastName.value,
        phone_nr: phoneNr.value,
        tg_username: tgUserName.value.replace('@', ''),
        invite_code: inviteCode.value || undefined,
        description: description.value,
        city: city.value || undefined,
        order_type_mappings: orderTypes.value.map((orderType) => ({ order_type: orderType })),
        order_tracks: [],
      }

      if (deliveryProviders.value.includes(DeliveryProvider.Ozon)) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.Ozon,
        })
      }

      if (deliveryProviders.value.includes(DeliveryProvider.Wilbderries)) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.Wilbderries,
        })
      }

      if (cdekTrackNumber.value) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.CDEK,
          track_number: cdekTrackNumber.value,
        })
      }

      if (postTrackNumber.value) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.PostRussia,
          track_number: postTrackNumber.value,
        })
      }

      if (boxberryTrackNumber.value) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.Boxberry,
          track_number: boxberryTrackNumber.value,
        })
      }

      if (post5TrackNumber.value) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.POST5,
          track_number: post5TrackNumber.value,
        })
      }

      await axios.post('api/public/orders', userOrderRequest)

      orderRegistered.value = true
      userOrderCookie.value = userOrderRequest
      modalRef.value?.close()
    } catch (ex) {
      const errorResponseData = getErrorResponseData(ex)

      if (
        errorResponseData?.errorName == ErrorName.TelegramEntityError &&
        errorResponseData?.errorType == TelegramEntityErrorType.EntityNotFound
      ) {
        errorMessage.value = 'Указанный ник в Telegram не найден'
        return showToast(showErrorToast)
      }

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

  if (!firstName.value) {
    valid = false
    showFirstNameInputError.value = true
  }

  if (!lastName.value) {
    valid = false
    showLastNameInputError.value = true
  }

  if (!phoneNr.value) {
    valid = false
    showPhoneNrInputError.value = true
  }

  if (!tgUserName.value) {
    valid = false
    showTgUsernameInputError.value = true
  }

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
  showFirstNameInputError.value = false
  showLastNameInputError.value = false
  showPhoneNrInputError.value = false
  showTgUsernameInputError.value = false
  showDescriptionInputError.value = false
  showCdekTrackNumberInputError.value = false
  showPostTrackNumberInputError.value = false
  showBoxberryTrackNumberInputError.value = false
  showPost5TrackNumberInputError.value = false
  showDeliveryProviderInputError.value = false
}
</script>

<template>
  <div data-theme="cmyk" class="flex flex-col w-full h-full justify-center items-center">
    <dialog class="modal" ref="modalRef">
      <div class="modal-box">
        <p class="text-2xl text-center">Доставка из РФ в Грузию</p>
        <div class="divider"></div>
        <div class="flex flex-col gap-2">
          <Input
            type="text"
            label="Имя *"
            placeholder="Имя получателя заказа"
            v-model="firstName"
            :class="{ 'input-error': showFirstNameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            type="text"
            label="Фамилия *"
            placeholder="Фамилия получателя заказа"
            v-model="lastName"
            :class="{ 'input-error': showLastNameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            type="text"
            label="Номер телефона *"
            placeholder="+995 999 99 99 99"
            v-model="phoneNr"
            :class="{ 'input-error': showPhoneNrInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            type="text"
            label="Ваш ник в Telegram *"
            placeholder="username"
            v-model="tgUserName"
            :class="{ 'input-error': showTgUsernameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <CityDropdown
            label="В какой город Грузии требуется доставка?"
            placeholder="Выберите город"
            v-model="city"
            class="text-base"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <div>
            <div class="label font-medium pb-1">
              <span>Где нам нужно будет получить заказ? *</span>
            </div>
            <div :class="{ 'border rounded-lg border-[red]': showDeliveryProviderInputError }">
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
                    :value="DeliveryProvider.CDEK"
                    v-model="deliveryProviders"
                  />
                  <span>{{ deliveryProviderToDisplayString(DeliveryProvider.CDEK) }}</span>
                </label>
                <label class="label cursor-pointer justify-normal gap-2 font-light">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :value="DeliveryProvider.PostRussia"
                    v-model="deliveryProviders"
                  />
                  <span>{{ deliveryProviderToDisplayString(DeliveryProvider.PostRussia) }}</span>
                </label>
                <label class="label cursor-pointer justify-normal gap-2 font-light">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :value="DeliveryProvider.POST5"
                    v-model="deliveryProviders"
                  />
                  <span>{{ deliveryProviderToDisplayString(DeliveryProvider.POST5) }}</span>
                </label>
                <label class="label cursor-pointer justify-normal gap-2 font-light">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :value="DeliveryProvider.Boxberry"
                    v-model="deliveryProviders"
                  />
                  <span>{{ deliveryProviderToDisplayString(DeliveryProvider.Boxberry) }}</span>
                </label>
              </div>
            </div>
          </div>
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.CDEK)"
            label="Трек-номер CDEK *"
            type="text"
            placeholder="123456789"
            v-model="cdekTrackNumber"
            :class="{ 'input-error': showCdekTrackNumberInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.PostRussia)"
            label="Трек-номер Почты России *"
            type="text"
            placeholder="123456789"
            v-model="postTrackNumber"
            :class="{ 'input-error': showPostTrackNumberInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.POST5)"
            label="Трек-номер 5POST *"
            type="text"
            placeholder="123456789"
            v-model="post5TrackNumber"
            :class="{ 'input-error': showPost5TrackNumberInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.Boxberry)"
            label="Трек-номер Boxberry *"
            type="text"
            placeholder="123456789"
            v-model="boxberryTrackNumber"
            :class="{ 'input-error': showBoxberryTrackNumberInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <Textarea
            label="Краткая опись заказа *"
            placeholder="Введите список товаров"
            v-model="description"
            class="text-base"
            :class="{ 'textarea-error': showDescriptionInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
          />
          <div>
            <div>
              <label class="label cursor-pointer justify-normal gap-2">
                <input type="checkbox" class="checkbox checkbox-sm" v-model="hasReferralCode" />
                <span class="font-medium">У меня есть промокод друга</span>
              </label>
              <Input v-if="hasReferralCode" type="text" placeholder="Введите промокод" v-model="inviteCode" />
            </div>
            <label class="label cursor-pointer justify-normal items-start gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Drugs" v-model="orderTypes" />
              <div class="flex flex-col">
                <span class="font-medium">В заказе лекарства или БАДы</span>
                <span class="text-sm font-light leading-4"
                  >Для лекарств и БАДов действует наценка 10 лари/упаковка </span
                >
              </div>
            </label>
            <label class="label cursor-pointer justify-normal items-start gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Electronics" v-model="orderTypes" />
              <div class="flex flex-col">
                <span class="font-medium">В заказе электронные товары дороже 300 лари</span>
                <span class="text-sm font-light leading-4"
                  >На провоз электронных товаров дороже 300 лари без растаможивания действует наценка +10% от стоимости
                  товара</span
                >
              </div>
            </label>
            <label class="label cursor-pointer justify-normal items-start gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Commercial" v-model="orderTypes" />
              <div class="flex flex-col">
                <span class="font-medium">В заказе 5 и более штук одинаковых товаров</span>
                <span class="text-sm font-light leading-4"
                  >Такой заказ попадает под понятие “коммерческая партия”, будет действовать наценка от 15 лари и выше в
                  зависимости от кол-ва повторяющихся товаров</span
                >
              </div>
            </label>
          </div>
        </div>
        <div class="modal-action">
          <button class="btn bg-blue-700 text-white hover:bg-blue-800" @click="registerOrder">
            Отправить
            <ion-icon name="chevron-forward"></ion-icon>
            <span v-if="loading" class="loading loading-spinner"></span>
          </button>
        </div>
      </div>
      <Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
    </dialog>
    <div :class="['transition-opacity duration-[3000ms]', orderRegistered ? 'opacity-100' : 'opacity-0']">
      <DotLottieVue v-if="orderRegistered" style="height: 300px; width: 300px" autoplay src="/animations/done.lottie" />
      <p class="text-center text-3xl mt-5">Спасибо за заказ!</p>
    </div>
  </div>
</template>
