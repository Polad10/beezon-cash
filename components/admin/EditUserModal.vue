<script lang="ts" setup>
import axios from 'axios'
import Decimal from 'decimal.js'
import type { User, UserRequest } from '~/models/User'

const emit = defineEmits(['user-edited'])

const id = ref('')
const firstName = ref('')
const lastName = ref('')
const phoneNr = ref('')
const tgUserName = ref('')
const invitedBy = ref('')
const balance = ref('')
const bonus = ref('')

const showErrorToast = ref(false)
const showSuccessToast = ref(false)
const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTgUsernameInputError = ref(false)
const showBonusInputError = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const modalRef = ref<HTMLDialogElement | null>(null)

async function editUser() {
  if (validateForm()) {
    try {
      const userRequest: UserRequest = {
        first_name: firstName.value,
        last_name: lastName.value,
        phone_nr: phoneNr.value,
        tg_username: tgUserName.value,
        invited_by: invitedBy.value || null,
      }

      if (bonus.value) {
        const newBalance = new Decimal(balance.value).add(new Decimal(bonus.value))
        userRequest.balance = newBalance
      }

      const user: User = (await axios.put(`/api/users/${id.value}`, userRequest)).data
      emit('user-edited', user)

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

  if (bonus.value && !isValidDecimal(bonus.value)) {
    valid = false
    showBonusInputError.value = true
  }

  return valid
}

function close() {
  modalRef.value?.close()
  resetFieldErrors()
}

function open(user: User) {
  id.value = user.id
  firstName.value = user.first_name
  lastName.value = user.last_name
  phoneNr.value = user.phone_nr
  tgUserName.value = user.tg_username
  invitedBy.value = user.invited_by ?? ''
  balance.value = user.balance.toString()
  bonus.value = ''

  modalRef.value?.showModal()
}

function resetFieldErrors() {
  showFirstNameInputError.value = false
  showLastNameInputError.value = false
  showPhoneNrInputError.value = false
  showTgUsernameInputError.value = false
  showBonusInputError.value = false
}

defineExpose({ open })
</script>

<template>
  <div>
    <dialog class="modal" ref="modalRef">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
        <p class="text-2xl text-center">Edit User</p>
        <div class="divider"></div>
        <div class="flex flex-col gap-2">
          <Input
            type="text"
            label="First name *"
            placeholder="Alex"
            v-model="firstName"
            :class="{ 'input-error': showFirstNameInputError }"
          />
          <Input
            type="text"
            label="Last name *"
            placeholder="Smith"
            v-model="lastName"
            :class="{ 'input-error': showLastNameInputError }"
          />
          <Input
            type="text"
            label="Phone number *"
            placeholder="+995 599 12 34 56"
            v-model="phoneNr"
            :class="{ 'input-error': showPhoneNrInputError }"
          />
          <Input
            type="text"
            label="Telegram *"
            placeholder="username"
            v-model="tgUserName"
            :class="{ 'input-error': showTgUsernameInputError }"
          />
          <Input
            type="text"
            label="Invited by"
            placeholder="550e8400-e29b-41d4-a716-446655440000"
            v-model="invitedBy"
          />
          <Input type="text" label="Balance" placeholder="0" v-model="balance" disabled />
          <Input
            type="text"
            label="Add bonus"
            placeholder="0"
            v-model="bonus"
            :class="{ 'input-error': showBonusInputError }"
          />
        </div>
        <div class="modal-action">
          <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
          <button class="btn btn-success" @click="editUser">Save</button>
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
