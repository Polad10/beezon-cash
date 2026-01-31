<script lang="ts" setup>
import axios from 'axios'
import type { NewOrderRequest, Order } from '~/models/Order'
import OrderWithoutUserInfo from './OrderWithoutUserInfo.vue'

const props = defineProps<{
	initDataRaw: String
}>()

const emit = defineEmits(['order-created'])

defineExpose({ open })

function open() {
	orderModalRef.value?.open(undefined)
}

function close() {
	orderModalRef.value?.close()
}

const orderModalRef = ref<typeof OrderWithoutUserInfo | null>(null)

const showErrorToast = ref(false)

const errorMessage = ref('')

async function registerOrder(orderRequest: NewOrderRequest) {
	try {
		const headers = {
			headers: { Authorization: `tma ${props.initDataRaw}` },
		}

		const order: Order = (await axios.post('/api/client/orders', orderRequest, headers)).data

		emit('order-created', order)

		close()
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Что-то пошло не так. Пожалуйста, попробуйте чуть позже.'
		showToast(showErrorToast)
	}
}
</script>

<template>
	<div data-theme="cmyk" class="flex flex-col w-full h-full justify-center items-center">
		<OrderWithoutUserInfo
			ref="orderModalRef"
			title="Форма приема заказов"
			submit-btn-text="Отправить"
			cancel-btn-text="Отменить"
			@order-submitted="registerOrder"
		/>
		<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	</div>
</template>
