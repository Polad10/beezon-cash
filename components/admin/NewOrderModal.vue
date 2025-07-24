<script lang="ts" setup>
import axios from 'axios'
import type { Order, OrderRequest } from '~/models/Order'
import type { User } from '~/models/User'
import OrderModal from './OrderModal.vue'

const props = defineProps<{
	users: User[]
}>()

const emit = defineEmits(['order-created'])

defineExpose({ open })

function open() {
	orderModalRef.value?.open()
}

function close() {
	orderModalRef.value?.close()
}
const orderModalRef = ref<typeof OrderModal | null>(null)

const showErrorToast = ref(false)
const showSuccessToast = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

async function addOrder(orderRequest: OrderRequest) {
	try {
		const order: Order = (await axios.post('/api/admin/orders', orderRequest)).data
		emit('order-created', order)

		successMessage.value = 'Order added'
		showToast(showSuccessToast)

		close()
	} catch (ex) {
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}
</script>

<template>
	<OrderModal ref="orderModalRef" title="New Order" :users="users" submit-btn-text="Add" @order-submitted="addOrder" />
	<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	<Toast v-if="showSuccessToast" class="alert-success" icon-name="checkmark-circle-outline" :message="successMessage" />
</template>
