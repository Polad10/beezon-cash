<script lang="ts" setup>
import axios from 'axios'
import type { Order, OrderRequest } from '~/models/Order'
import OrderModal from './OrderModal.vue'

import type { User } from '~/models/User'

const props = defineProps<{
	users: User[]
}>()

const emit = defineEmits(['order-edited'])

const orderModalRef = ref<typeof OrderModal | null>(null)

const id = ref('')

const showErrorToast = ref(false)
const showSuccessToast = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

async function editOrder(orderRequest: OrderRequest) {
	try {
		const order: Order = (await axios.put(`/api/admin/orders/${id.value}`, orderRequest)).data
		emit('order-edited', order)

		successMessage.value = 'Saved'
		showToast(showSuccessToast)

		close()
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
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
	<OrderModal
		ref="orderModalRef"
		title="Edit Order"
		:users="users"
		submit-btn-text="Save"
		@order-submitted="editOrder"
	/>
	<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	<Toast v-if="showSuccessToast" class="alert-success" icon-name="checkmark-circle-outline" :message="successMessage" />
</template>
