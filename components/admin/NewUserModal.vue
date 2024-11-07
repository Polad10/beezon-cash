<script lang="ts" setup>
const props = defineProps<{
  id: string
}>()

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
const showInvitedByInputError = ref(false)

function addUser() {
  if (validateForm()) {
  } else {
    showToast(showErrorToast)
  }
}

function formIsValid() {
  if (!firstName.value || !lastName.value || !phoneNr.value || !tgUserName.value || !invitedBy.value) {
    return false
  }

  return true
}

function validateForm() {
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

  if (!invitedBy.value) {
    valid = false
    showInvitedByInputError.value = true
  }

  return valid
}

function reset() {
  firstName.value = ''
  lastName.value = ''
  phoneNr.value = ''
  tgUserName.value = ''
  invitedBy.value = ''

  showFirstNameInputError.value = false
  showLastNameInputError.value = false
  showPhoneNrInputError.value = false
  showTgUsernameInputError.value = false
  showInvitedByInputError.value = false
}
</script>

<template>
  <dialog :id="$props.id" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="reset">✕</button>
      </form>
      <p class="text-2xl text-center">New User</p>
      <div class="divider"></div>
      <div class="flex flex-col gap-2">
        <AdminInput
          type="text"
          label="First name"
          placeholder="Alex"
          v-model="firstName"
          :class="{ 'input-error': showFirstNameInputError }"
        />
        <AdminInput
          type="text"
          label="Last name"
          placeholder="Smith"
          v-model="lastName"
          :class="{ 'input-error': showLastNameInputError }"
        />
        <AdminInput
          type="text"
          label="Phone number"
          placeholder="+995 599 12 34 56"
          v-model="phoneNr"
          :class="{ 'input-error': showPhoneNrInputError }"
        />
        <AdminInput
          type="text"
          label="Telegram username"
          placeholder="username"
          v-model="tgUserName"
          :class="{ 'input-error': showTgUsernameInputError }"
        />
        <AdminInput
          type="text"
          label="Invited by"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          v-model="invitedBy"
          :class="{ 'input-error': showInvitedByInputError }"
        />
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-warning btn-outline" @click="reset">Cancel</button>
        </form>
        <button class="btn btn-success" @click="addUser">Add</button>
      </div>
    </div>
    <div v-if="showErrorToast" class="toast toast-top whitespace-normal z-[9999] inset-x-0 top-0 mx-auto w-[200px]">
      <div
        class="alert alert-error text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
      >
        <ion-icon name="close-circle-outline" class="text-5xl ml-px"></ion-icon>
        <span>Что-то пошло не так. Пожалуйста, попробуйте чуть позже.</span>
      </div>
    </div>
  </dialog>
</template>
