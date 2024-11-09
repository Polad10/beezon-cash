<script lang="ts" setup>
import axios from 'axios'
import type { User, UserRequest } from '~/models/User'

const emit = defineEmits(['user-created'])

const firstName = ref('')
const lastName = ref('')
const phoneNr = ref('')
const tgUserName = ref('')
const invitedBy = ref('')

const showErrorToast = ref(false)
const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTgUsernameInputError = ref(false)

const modalRef = ref<HTMLDialogElement | null>(null)

async function addUser() {
  if (validateForm()) {
    const userRequest: UserRequest = {
      first_name: firstName.value,
      last_name: lastName.value,
      phone_nr: phoneNr.value,
      tg_username: tgUserName.value,
    }

    if (invitedBy.value) {
      userRequest.invited_by = invitedBy.value
    }

    const user: User = (await axios.post('/api/users', userRequest)).data
    emit('user-created', user)

    close()
  } else {
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

  return valid
}

function close() {
  modalRef.value?.close()
  resetFieldValues()
  resetFieldErrors()
}

function resetFieldValues() {
  firstName.value = ''
  lastName.value = ''
  phoneNr.value = ''
  tgUserName.value = ''
  invitedBy.value = ''
}

function resetFieldErrors() {
  showFirstNameInputError.value = false
  showLastNameInputError.value = false
  showPhoneNrInputError.value = false
  showTgUsernameInputError.value = false
}
</script>

<template>
  <dialog class="modal" ref="modalRef">
    <div class="modal-box">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
      <p class="text-2xl text-center">New User</p>
      <div class="divider"></div>
      <div class="flex flex-col gap-2">
        <AdminInput
          type="text"
          label="First name *"
          placeholder="Alex"
          v-model="firstName"
          :class="{ 'input-error': showFirstNameInputError }"
        />
        <AdminInput
          type="text"
          label="Last name *"
          placeholder="Smith"
          v-model="lastName"
          :class="{ 'input-error': showLastNameInputError }"
        />
        <AdminInput
          type="text"
          label="Phone number *"
          placeholder="+995 599 12 34 56"
          v-model="phoneNr"
          :class="{ 'input-error': showPhoneNrInputError }"
        />
        <AdminInput
          type="text"
          label="Telegram username *"
          placeholder="username"
          v-model="tgUserName"
          :class="{ 'input-error': showTgUsernameInputError }"
        />
        <AdminInput
          type="text"
          label="Invited by"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          v-model="invitedBy"
        />
      </div>
      <div class="modal-action">
        <button class="btn btn-warning btn-outline" @click="close">Cancel</button>
        <button class="btn btn-success" @click="addUser">Add</button>
      </div>
    </div>
    <div v-if="showErrorToast" class="toast toast-top whitespace-normal z-[9999] inset-x-0 top-0 mx-auto w-[200px]">
      <div
        class="alert alert-error text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
      >
        <ion-icon name="close-circle-outline" class="text-5xl ml-px"></ion-icon>
        <span>Please fill all the required fields</span>
      </div>
    </div>
  </dialog>
</template>
