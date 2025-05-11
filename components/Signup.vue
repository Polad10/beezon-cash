<script lang="ts" setup>
import axios from 'axios'
import type { UserSignupRequest } from '~/models/User'
import type DataProcessAgreement from './DataProcessAgreement.vue'
import PrivacyPolicyAgreement from './PrivacyPolicyAgreement.vue'

const props = defineProps<{
  initDataRaw: String
}>()

const emit = defineEmits(['user-signed-up'])

const dataProcessAgreementRef = ref<typeof DataProcessAgreement | null>(null)
const privacyPolicyAgreementRef = ref<typeof PrivacyPolicyAgreement | null>(null)

const firstName = ref('')
const lastName = ref('')
const phoneNr = ref('')
const inviteCode = ref('')
const termsAccepted = ref(false)
const errorMessage = ref('')

const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTermsAcceptedInputError = ref(false)
const showErrorToast = ref(false)
const loading = ref(false)

async function signUp() {
  try {
    if (validate()) {
      loading.value = true

      const userSignupRequest: UserSignupRequest = {
        first_name: firstName.value,
        last_name: lastName.value,
        phone_nr: phoneNr.value,
        invite_code: inviteCode.value || undefined,
      }

      const headers = {
        headers: { Authorization: `tma ${props.initDataRaw}` },
      }

      await axios.post(`/api/client/me`, userSignupRequest, headers)
      emit('user-signed-up')
    } else {
      errorMessage.value = 'Пожалуйста заполните все необходимые поля'
      showToast(showErrorToast)
    }
  } catch (ex) {
    errorMessage.value = 'Что-то пошло не так. Пожалуйста, попробуйте чуть позже.'
    showToast(showErrorToast)
  } finally {
    loading.value = false
  }
}

function validate() {
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
  showTermsAcceptedInputError.value = false
}
</script>

<template>
  <div class="h-full flex flex-col px-5 py-5">
    <div class="flex flex-col items-center px-8">
      <p class="text-3xl font-bold text-blue-700">BEEZON LOGISTICS</p>
      <p class="text-xl font-bold mt-5">Зарегистрируйтесь</p>
      <p class="text-center font-semibold mt-2">
        Чтобы оформлять новые заказы, отслеживать статус посылок, а также участвовать в программе лояльности
      </p>
    </div>
    <div class="flex flex-col mt-3">
      <Input
        type="text"
        label="Ваше имя"
        placeholder="Иван"
        v-model="firstName"
        :class="{ 'input-error': showFirstNameInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Ваша фамилия"
        placeholder="Иванов"
        v-model="lastName"
        :class="{ 'input-error': showLastNameInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Номер телефона"
        placeholder="+995 999 99 99 99"
        v-model="phoneNr"
        :class="{ 'input-error': showPhoneNrInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Промокод друга (если есть)"
        placeholder="Введите промокод"
        v-model="inviteCode"
        label-class="font-medium pb-1"
      />
    </div>
    <div class="flex flex-col flex-grow justify-end gap-2">
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
      <button class="btn btn-block self-center bg-blue-700 text-white rounded-xl" @click="signUp">
        <span v-if="!loading">Зарегистрироваться</span>
        <span v-else class="loading loading-spinner"></span>
      </button>
    </div>
    <Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
    <DataProcessAgreement ref="dataProcessAgreementRef" />
    <PrivacyPolicyAgreement ref="privacyPolicyAgreementRef" />
  </div>
</template>
