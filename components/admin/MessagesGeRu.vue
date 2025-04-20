<script lang="ts" setup>
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import type { MessageGeRu } from '~/models/MessageGeRu'
import { toAdminDisplayString } from '~/enums/OrderStatusGeRu'

const props = defineProps({
  messages: {
    type: Array<MessageGeRu>,
    required: true,
  },
})

const emit = defineEmits(['message-deleted'])

const rowsPerPage = 100

// const newMessageModalRef = ref<typeof NewMessageModal | null>(null)
// const editMessageModalRef = ref<typeof EditMessageModal | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)

const currentPageNr = ref(1)

const pageMessages = computed(() => {
  return props.messages.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

const pageNr = computed(() => {
  currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
  return currentPageNr.value
})

const maxPageNr = computed(() => {
  return Math.max(Math.ceil(props.messages.length / rowsPerPage), 1)
})

function setPageNr(newPageNr: number) {
  currentPageNr.value = newPageNr
}

function handleMessageCreated(message: MessageGeRu) {
  // props.messages.push(message)
}

function handleMessageEdited(message: MessageGeRu) {
  // const localMessage = props.messages.find((m) => m.id === message.id)
  // if (localMessage) {
  //   Object.assign(localMessage, message)
  // }
}

async function deleteMessage(message: MessageGeRu) {
  emit('message-deleted', message)
}
</script>

<template>
  <div class="flex flex-col grow">
    <div class="flex flex-row min-h-12 mr-3 justify-between items-center">
      <span class="text-2xl font-bold">Messages &nbsp;&nbsp; GE - RU</span>
      <div class="flex flex-row gap-5">
        <button class="btn btn-sm btn-outline" @click="">Add message</button>
      </div>
    </div>
    <div class="flex flex-col bg-white mr-3 mb-5 grow">
      <table class="table table-sm">
        <thead>
          <tr class="bg-base-200">
            <th>ID</th>
            <th>NAME</th>
            <th>TEXT</th>
            <th>ORDER STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="message in pageMessages" :key="message.id">
            <td>{{ message.id }}</td>
            <td>{{ message.name }}</td>
            <td>{{ message.text }}</td>
            <td>{{ toAdminDisplayString(message.order_status) }}</td>
            <td>
              <div class="flex flex-row gap-2">
                <button class="btn btn-sm text-gray-500 btn-square btn-outline" @click="">
                  <ion-icon name="pencil"></ion-icon>
                </button>
                <button
                  class="btn btn-sm text-gray-500 btn-square btn-outline"
                  @click="confirmDeleteModalRef?.open(() => deleteMessage(message))"
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
    <!-- <AdminNewMessageModal ref="newMessageModalRef" @message-created="handleMessageCreated" />
    <AdminEditMessageModal ref="editMessageModalRef" @message-edited="handleMessageEdited" /> -->
    <ConfirmDeleteModal ref="confirmDeleteModalRef" />
  </div>
</template>
