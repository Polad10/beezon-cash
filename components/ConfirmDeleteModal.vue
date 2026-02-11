<script lang="ts" setup>
const props = defineProps<{
	label: string
}>()

const emit = defineEmits(['item-deleted'])

const modalRef = ref<HTMLDialogElement | null>(null)

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
	<dialog class="modal" ref="modalRef">
		<div class="modal-box w-[77%]" tabindex="0">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
			<p class="text-sm font-semibold text-center">{{ props.label }}</p>
			<div class="flex flex-row justify-center gap-5 mt-5">
				<button class="btn btn-sm px-8 rounded-lg" @click="close">Нет</button>
				<button class="btn btn-sm px-8 rounded-lg btn-error text-white" @click="deleteEntity">Да</button>
			</div>
		</div>
	</dialog>
</template>
