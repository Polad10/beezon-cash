<script lang="ts" setup>
import axios from 'axios'
import type { City } from '~/models/City'
import { DeliveryProvider } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import type { UserOrderRequest } from '~/models/UserOrder'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ErrorName } from '~/enums/exceptions/ErrorName'
import { TelegramEntityErrorType } from '~/enums/exceptions/TelegramEntityErrorType'
import DeliveryProviderInput from '~/components/new-order-form/DeliveryProviderInput.vue'
import OrderTypeInput from '~/components/new-order-form/OrderTypeInput.vue'
import CityInput from '~/components/new-order-form/CityInput.vue'
import FormInput from '~/components/new-order-form/FormInput.vue'
import DescriptionInput from '~/components/new-order-form/DescriptionInput.vue'
import DataProcessAgreement from '~/components/DataProcessAgreement.vue'
import PrivacyPolicyAgreement from '~/components/PrivacyPolicyAgreement.vue'

const userOrderCookie = useCookie<UserOrderRequest | null>('user-order-cookie', { maxAge: 365 * 24 * 60 * 60 })

const modalRef = ref<HTMLDialogElement | null>(null)
const dataProcessAgreementRef = ref<typeof DataProcessAgreement | null>(null)
const privacyPolicyAgreementRef = ref<typeof PrivacyPolicyAgreement | null>(null)

const firstName = ref(userOrderCookie.value?.first_name || '')
const lastName = ref(userOrderCookie.value?.last_name || '')
const phoneNr = ref(userOrderCookie.value?.phone_nr || '')
const tgUserName = ref(userOrderCookie.value?.tg_username || '')
const description = ref('')
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')
const dpdTrackNumber = ref('')
const inviteCode = ref(userOrderCookie.value?.invite_code || '')
const city = ref<City | null>(userOrderCookie.value?.city || null)
const deliveryProviders = ref<DeliveryProvider[]>([])
const orderTypes = ref<OrderType[]>([])
const hasReferralCode = ref(userOrderCookie.value?.invite_code ? true : false)
const termsAccepted = ref(false)

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
const showDpdTrackNumberInputError = ref(false)
const showDeliveryProviderInputError = ref(false)
const showTermsAcceptedInputError = ref(false)
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

      if (deliveryProviders.value.includes(DeliveryProvider.Cold)) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.Cold,
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

      if (dpdTrackNumber.value) {
        userOrderRequest.order_tracks.push({
          delivery_provider: DeliveryProvider.DPD,
          track_number: dpdTrackNumber.value,
        })
      }

      await axios.post('/api/public/orders', userOrderRequest)

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

  if (deliveryProviders.value.includes(DeliveryProvider.DPD) && !dpdTrackNumber.value) {
    valid = false
    showDpdTrackNumberInputError.value = true
  }

  if (!termsAccepted.value) {
    valid = false
    showTermsAcceptedInputError.value = true
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
  showDpdTrackNumberInputError.value = false
  showDeliveryProviderInputError.value = false
  showTermsAcceptedInputError.value = false
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
          <CityInput v-model="city" />
          <DeliveryProviderInput
            label="Где нам нужно будет получить заказ? *"
            v-model="deliveryProviders"
            :show-input-error="showDeliveryProviderInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.CDEK)"
            label="Трек-номер CDEK *"
            v-model="cdekTrackNumber"
            :show-input-error="showCdekTrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.PostRussia)"
            label="Трек-номер Почты России *"
            v-model="postTrackNumber"
            :show-input-error="showPostTrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.POST5)"
            label="Трек-номер 5POST *"
            v-model="post5TrackNumber"
            :show-input-error="showPost5TrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.Boxberry)"
            label="Трек-номер Boxberry *"
            v-model="boxberryTrackNumber"
            :show-input-error="showBoxberryTrackNumberInputError"
          />
          <FormInput
            v-if="deliveryProviders.includes(DeliveryProvider.DPD)"
            label="Трек-номер DPD *"
            v-model="dpdTrackNumber"
            :show-input-error="showDpdTrackNumberInputError"
          />
          <DescriptionInput
            v-model="description"
            :show-input-error="showDescriptionInputError"
            label="Краткая опись заказа *"
          />
          <div>
            <div>
              <label class="label cursor-pointer justify-normal gap-2">
                <input type="checkbox" class="checkbox checkbox-sm" v-model="hasReferralCode" />
                <span class="font-medium">У меня есть промокод друга</span>
              </label>
              <Input v-if="hasReferralCode" type="text" placeholder="Введите промокод" v-model="inviteCode" />
            </div>
            <OrderTypeInput v-model="orderTypes" />
          </div>
          <label class="label cursor-pointer justify-normal items-start gap-2">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              :class="{ 'checkbox-error': showTermsAcceptedInputError }"
              v-model="termsAccepted"
              @change="showTermsAcceptedInputError = false"
            />
            <span class="text-sm"
              >Я согласен с условиями
              <a href="#" class="text-blue-700 font-semibold" @click="privacyPolicyAgreementRef?.open()"
                >Политики конфиденциальности</a
              >
              и даю
              <a class="text-blue-700 font-semibold" href="#" @click="dataProcessAgreementRef?.open()"
                >Согласие на обработку персональных данных</a
              ></span
            >
          </label>
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
    <DataProcessAgreement ref="dataProcessAgreementRef" />
    <PrivacyPolicyAgreement ref="privacyPolicyAgreementRef" />
    <div :class="['transition-opacity duration-[3000ms]', orderRegistered ? 'opacity-100' : 'opacity-0']">
      <DotLottieVue v-if="orderRegistered" style="height: 300px; width: 300px" autoplay src="/animations/done.lottie" />
      <p class="text-center text-3xl mt-5">Спасибо за заказ!</p>
    </div>
  </div>
</template>
