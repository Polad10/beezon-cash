<script lang="ts" setup>
import { MapOption } from '~/models/MapOption'

const props = defineProps<{
	label?: string
}>()

const emit = defineEmits(['map-chosen'])

const modalRef = ref<HTMLDialogElement | null>(null)

function close() {
	modalRef.value?.close()
}

function open() {
	modalRef.value?.showModal()
}

function chooseMap(mapOption: MapOption) {
	emit('map-chosen', mapOption)
	close()
}

defineExpose({ open })
</script>

<template>
	<dialog class="modal" ref="modalRef">
		<div class="modal-box w-[77%]" tabindex="0">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="close">✕</button>
			<div class="flex flex-col items-center gap-3 mt-7">
				<button
					class="btn btn-wide rounded-lg bg-[#FFDC40] border-[#FFDC40] font-bold"
					@click="() => chooseMap(MapOption.Yandex)"
				>
					<ion-icon name="location-outline" size="small" class="mr-1"></ion-icon>
					Yandex карты
				</button>
				<button
					class="btn btn-wide rounded-lg bg-[#4285F4] border-[#4285F4] text-white font-bold"
					@click="() => chooseMap(MapOption.Google)"
				>
					<ion-icon name="logo-google" size="small" class="mr-1"></ion-icon>
					Google карты
				</button>
			</div>
		</div>
	</dialog>
</template>
