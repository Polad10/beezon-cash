<script lang="ts" setup>
import axios from 'axios'
import type { Order, NewOrderRequest } from '~/models/Order'
import OrderWithoutUserInfo from './OrderWithoutUserInfo.vue'

const props = defineProps<{
	initDataRaw: String
}>()

const emit = defineEmits(['order-edited'])

const orderModalRef = ref<typeof OrderWithoutUserInfo | null>(null)

const id = ref('')

const showErrorToast = ref(false)

const errorMessage = ref('')

async function editOrder(orderRequest: NewOrderRequest) {
	try {
		const headers = {
			headers: { Authorization: `tma ${props.initDataRaw}` },
		}

		const order: Order = (await axios.put(`/api/client/orders/${id.value}`, orderRequest, headers)).data

		emit('order-edited', order)

		close()
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Что-то пошло не так. Пожалуйста, попробуйте чуть позже.'
		showToast(showErrorToast)
	}
}

function close() {
	orderModalRef.value?.close()
}

function open(order: Order) {
	id.value = order.id
	orderModalRef.value?.open(order)
}

defineExpose({ open })
</script>

<template>
	<div data-theme="cmyk" class="flex flex-col w-full h-full justify-center items-center">
		<OrderWithoutUserInfo
			ref="orderModalRef"
			title="Изменить заказ"
			submit-btn-text="Сохранить"
			cancel-btn-text="Назад"
			@order-submitted="editOrder"
		/>
		<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	</div>
</template>
