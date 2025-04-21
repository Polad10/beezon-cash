<script lang="ts" setup>
import type { UserGeRuOrderRequest } from '~/models/UserOrder'
import DataProcessAgreement from '~/components/DataProcessAgreement.vue'
import PrivacyPolicyAgreement from '~/components/PrivacyPolicyAgreement.vue'
import DescriptionInput from '~/components/new-order-form/DescriptionInput.vue'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { ErrorName } from '~/enums/exceptions/ErrorName'
import { TelegramEntityErrorType } from '~/enums/exceptions/TelegramEntityErrorType'
import axios from 'axios'

const userOrderCookie = useCookie<UserGeRuOrderRequest | null>('user-geruorder-cookie', { maxAge: 365 * 24 * 60 * 60 })

const modalRef = ref<HTMLDialogElement | null>(null)
const dataProcessAgreementRef = ref<typeof DataProcessAgreement | null>(null)
const privacyPolicyAgreementRef = ref<typeof PrivacyPolicyAgreement | null>(null)

const firstName = ref(userOrderCookie.value?.first_name || '')
const lastName = ref(userOrderCookie.value?.last_name || '')
const phoneNr = ref(userOrderCookie.value?.phone_nr || '')
const tgUserName = ref(userOrderCookie.value?.tg_username || '')
const receiverName = ref(userOrderCookie.value?.receiver_name || '')
const receiverPhoneNr = ref(userOrderCookie.value?.receiver_phone_nr || '')
const receiverAddress = ref(userOrderCookie.value?.receiver_address || '')
const description = ref('')
const hintPrice = ref('')
const termsAccepted = ref(false)

const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTgUsernameInputError = ref(false)
const showReceiverNameInputError = ref(false)
const showReceiverPhoneNrInputError = ref(false)
const showReceiverAddressInputError = ref(false)
const showDescriptionInputError = ref(false)
const showHintPriceInputError = ref(false)
const showTermsAcceptedInputError = ref(false)
const showErrorToast = ref(false)

const orderRegistered = ref(false)
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  modalRef.value?.showModal()
})

async function registerOrder() {
  if (validateForm()) {
    try {
      loading.value = true

      const userOrderRequest: UserGeRuOrderRequest = {
        first_name: firstName.value,
        last_name: lastName.value,
        phone_nr: phoneNr.value,
        tg_username: tgUserName.value.replace('@', ''),
        receiver_name: receiverName.value,
        receiver_phone_nr: receiverPhoneNr.value,
        receiver_address: receiverAddress.value,
        description: description.value,
        hint_price: hintPrice.value,
      }

      await axios.post('/api/geru/public/orders', userOrderRequest)

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

  if (!receiverName.value) {
    valid = false
    showReceiverNameInputError.value = true
  }

  if (!receiverPhoneNr.value) {
    valid = false
    showReceiverPhoneNrInputError.value = true
  }

  if (!receiverAddress.value) {
    valid = false
    showReceiverAddressInputError.value = true
  }

  if (!description.value) {
    valid = false
    showDescriptionInputError.value = true
  }

  if (!hintPrice.value) {
    valid = false
    showHintPriceInputError.value = true
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
  showReceiverNameInputError.value = false
  showReceiverPhoneNrInputError.value = false
  showReceiverAddressInputError.value = false
  showDescriptionInputError.value = false
  showHintPriceInputError.value = false
  showTermsAcceptedInputError.value = false
  showErrorToast.value = false
}
</script>

<template>
  <div data-theme="cmyk" class="flex flex-col w-full h-full justify-center items-center">
    <dialog class="modal" ref="modalRef">
      <div class="modal-box">
        <p class="text-2xl text-center">Доставка из Грузии в РФ</p>
        <div class="divider"></div>
        <div class="flex flex-col gap-2">
          <Input
            type="text"
            label="Имя отправителя"
            placeholder="Имя отправителя"
            v-model="firstName"
            :class="{ 'input-error': showFirstNameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="Фамилия отправителя"
            placeholder="Фамилия отправителя"
            v-model="lastName"
            :class="{ 'input-error': showLastNameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="Номер телефона отправителя"
            placeholder="+79999097878"
            v-model="phoneNr"
            :class="{ 'input-error': showPhoneNrInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="Логин отправителя в Telegram"
            placeholder="username"
            v-model="tgUserName"
            :class="{ 'input-error': showTgUsernameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="ФИО получателя в России (полностью)"
            placeholder="ФИО получателя в России (полностью)"
            v-model="receiverName"
            :class="{ 'input-error': showReceiverNameInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="Номер телефона получателя в России"
            placeholder="+79999097878"
            v-model="receiverPhoneNr"
            :class="{ 'input-error': showReceiverPhoneNrInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <Input
            type="text"
            label="Адрес ПВЗ СДЭКа / Адрес получателя"
            placeholder="Адрес ПВЗ СДЭКа / Адрес получателя"
            v-model="receiverAddress"
            :class="{ 'input-error': showReceiverAddressInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
          <DescriptionInput
            v-model="description"
            :show-input-error="showDescriptionInputError"
            label="Краткая опись заказа"
            :required="true"
          />
          <Input
            type="text"
            label="Объявленная ценность посылки (в лари)"
            placeholder="Объявленная ценность посылки (в лари)"
            v-model="hintPrice"
            :class="{ 'input-error': showHintPriceInputError }"
            label-class="font-medium pb-1"
            label-text-class="text-base"
            :required="true"
          />
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
