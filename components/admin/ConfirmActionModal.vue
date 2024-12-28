<script lang="ts" setup>
const emit = defineEmits(['confirmed', 'closed'])

const modalRef = ref<HTMLDialogElement | null>(null)

function close() {
  modalRef.value?.close()
  emit('closed')
}

function open() {
  modalRef.value?.showModal()
}

function confirm() {
  emit('confirmed')
}

defineExpose({ open, close })
</script>

<template>
  <div>
    <dialog class="modal" ref="modalRef">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
        <p class="text-2xl text-center">Are you sure?</p>
        <div class="divider"></div>
        <slot></slot>
        <div class="modal-action">
          <button class="btn btn-neutral btn-outline" @click="close">Cancel</button>
          <button class="btn btn-success" @click="confirm">Confirm</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
