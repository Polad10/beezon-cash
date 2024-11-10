<script lang="ts" setup>
const modalRef = ref<HTMLDialogElement | null>(null)

const onDelete = ref<(() => void) | null>(null)

function close() {
  modalRef.value?.close()
}

function open(onDeleteCallback: () => void) {
  modalRef.value?.showModal()
  onDelete.value = onDeleteCallback
}

function deleteEntity() {
  onDelete.value?.()
  close()
}

defineExpose({ open })
</script>

<template>
  <div>
    <dialog class="modal" ref="modalRef">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
        <p class="text-2xl text-center">Are you sure?</p>
        <div class="divider"></div>
        <div class="modal-action">
          <button class="btn btn-neutral btn-outline" @click="close">Cancel</button>
          <button class="btn btn-error" @click="deleteEntity">Delete</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
