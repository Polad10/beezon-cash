<script lang="ts" setup>
import NewMessageModal from '~/components/admin/NewMessageModal.vue'
import EditMessageModal from '~/components/admin/EditMessageModal.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import { toAdminDisplayString as orderStatusToDisplayString } from '~/models/OrderStatus'
import type { Message } from '~/models/Message'

const props = defineProps({
  messages: {
    type: Array<Message>,
    required: true,
  },
})

const emit = defineEmits(['message-deleted'])

const rowsPerPage = 30

const newMessageModalRef = ref<typeof NewMessageModal | null>(null)
const editMessageModalRef = ref<typeof EditMessageModal | null>(null)
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

function handleMessageCreated(message: Message) {
  props.messages.push(message)
}

function handleMessageEdited(message: Message) {
  const localMessage = props.messages.find((m) => m.id === message.id)

  if (localMessage) {
    Object.assign(localMessage, message)
  }
}

async function deleteMessage(message: Message) {
  emit('message-deleted', message)
}
</script>

<template>
  <div class="flex flex-col grow">
    <div class="flex flex-row min-h-12 mr-3 justify-between items-center">
      <span class="text-2xl font-bold">Messages</span>
      <div class="flex flex-row gap-5">
        <button class="btn btn-sm btn-outline" @click="newMessageModalRef?.open()">Add message</button>
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
            <td>{{ orderStatusToDisplayString(message.order_status) }}</td>
            <td>
              <div class="flex flex-row gap-2">
                <button
                  class="btn btn-sm text-gray-500 btn-square btn-outline"
                  @click="editMessageModalRef?.open(message)"
                >
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
    <AdminPagination v-model="pageNr" :max-page-nr="maxPageNr" />
    <AdminNewMessageModal ref="newMessageModalRef" @message-created="handleMessageCreated" />
    <AdminEditMessageModal ref="editMessageModalRef" @message-edited="handleMessageEdited" />
  </div>
</template>
