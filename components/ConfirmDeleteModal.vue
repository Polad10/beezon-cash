<script lang="ts" setup>
const modalRef = ref<HTMLDialogElement | null>(null)

const emit = defineEmits(['item-deleted'])

function close() {
	modalRef.value?.close()
}

function open() {
	modalRef.value?.showModal()
}

function deleteEntity() {
	emit('item-deleted')
	close()
}

defineExpose({ open })
</script>

<template>
	<div>
		<dialog class="modal" ref="modalRef">
			<div class="modal-box">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
				<p class="text-2xl text-center">Вы уверены?</p>
				<div class="divider"></div>
				<div class="modal-action">
					<button class="btn btn-neutral btn-outline" @click="close" autofocus>Отменить</button>
					<button class="btn btn-error" @click="deleteEntity">Удалить</button>
				</div>
			</div>
		</dialog>
	</div>
</template>
