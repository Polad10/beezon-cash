<script lang="ts" setup>
import NewUserModal from './NewUserModal.vue'
import EditUserModal from './EditUserModal.vue'
import ConfirmDeleteModal from './ConfirmDeleteModal.vue'
import Fuse from 'fuse.js'
import type { User } from '~/models/User'

const props = defineProps({
  allUsers: {
    type: Array<User>,
    required: true,
  },
})

const emit = defineEmits(['user-deleted'])

const fuseUsersOptions = {
  keys: ['id', 'tg_username', 'last_name', 'first_name', 'phone_nr', 'referral_code', 'invited_by'],
  threshold: 0.1,
}

const userSearch = ref('')
const currentPageNr = ref(1)
const rowsPerPage = 100

const newUserModalRef = ref<typeof NewUserModal | null>(null)
const editUserModalRef = ref<typeof EditUserModal | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)

let fuseUsers = computed(() => {
  return new Fuse(props.allUsers, fuseUsersOptions)
})

const users = computed(() => {
  if (!userSearch.value) {
    return [...props.allUsers]
  }

  return fuseUsers.value.search(userSearch.value).map((result) => result.item)
})

const pageUsers = computed(() => {
  return users.value?.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const pageNr = computed(() => {
  currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
  return currentPageNr.value
})

const maxPageNr = computed(() => {
  return Math.max(Math.ceil(users.value.length / rowsPerPage), 1)
})

function setPageNr(newPageNr: number) {
  currentPageNr.value = newPageNr
}

function handleUserCreated(user: User) {
  props.allUsers.push(user)
}

function handleUserEdited(user: User) {
  const localUser = props.allUsers.find((u) => u.id === user.id)

  if (localUser) {
    Object.assign(localUser, user)
  }
}

async function deleteUser(user: User) {
  emit('user-deleted', user)
}
</script>

<template>
  <div class="flex flex-col grow">
    <div class="flex flex-row min-h-12 mr-3 justify-between items-center">
      <span class="text-2xl font-bold">Users</span>
      <div class="flex flex-row gap-5">
        <label
          class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
        >
          <input type="text" class="grow" placeholder="Search" v-model="userSearch" />
          <ion-icon name="search-outline"></ion-icon>
        </label>
        <button class="btn btn-sm btn-outline" @click="newUserModalRef?.open()">Add user</button>
      </div>
    </div>
    <div class="flex flex-col bg-white mr-3 mb-5 grow">
      <table class="table table-sm">
        <thead>
          <tr class="bg-base-200">
            <th>ID</th>
            <th>NAME</th>
            <th>PHONE NUMBER</th>
            <th>TELEGRAM</th>
            <th>REFERRAL CODE</th>
            <th>INVITED BY</th>
            <th>BALANCE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in pageUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.first_name }} {{ user.last_name }}</td>
            <td>{{ user.phone_nr }}</td>
            <td>{{ user.tg_username }}</td>
            <td>{{ user.referral_code }}</td>
            <td>{{ user.invited_by }}</td>
            <td>{{ user.balance }}</td>
            <td>
              <div class="flex flex-row gap-2">
                <button class="btn btn-sm text-gray-500 btn-square btn-outline" @click="editUserModalRef?.open(user)">
                  <ion-icon name="pencil"></ion-icon>
                </button>
                <button
                  class="btn btn-sm text-gray-500 btn-square btn-outline"
                  @click="confirmDeleteModalRef?.open(() => deleteUser(user))"
                >
                  <ion-icon name="trash"></ion-icon>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <AdminPagination :page-nr="pageNr" :max-page-nr="maxPageNr" @page-nr-changed="setPageNr" />
    <AdminNewUserModal ref="newUserModalRef" @user-created="handleUserCreated" />
    <AdminEditUserModal ref="editUserModalRef" @user-edited="handleUserEdited" />
    <AdminConfirmDeleteModal ref="confirmDeleteModalRef" />
  </div>
</template>
