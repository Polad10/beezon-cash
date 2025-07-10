<script lang="ts" setup>
import Decimal from 'decimal.js'
import Fuse from 'fuse.js'
import { OrderStatusGeRu, toAdminColorCode, toAdminDisplayString } from '~/enums/OrderStatusGeRu'
import {
	PaymentMethod,
	toAdminDisplayString as paymentMethodToAdminDisplayString,
	toAdminColorCode as paymentMethodToAdminColorCode,
} from '~/enums/PaymentMethod'
import ConfirmActionModal from '~/components/admin/ConfirmActionModal.vue'
import ConfirmDeleteModal from '~/components/admin/ConfirmDeleteModal.vue'
import type { OrderGeRu, OrderGeRuBatchPatchRequest, OrderGeRuPatchRequest } from '~/models/OrderGeRu'
import type { User } from '~/models/User'
import StatusGeRuDropdown from './StatusGeRuDropdown.vue'
import PaymentMethodDropdown from './PaymentMethodDropdown.vue'
import NewOrderGeRuModal from './NewOrderGeRuModal.vue'
import EditOrderGeRuModal from './EditOrderGeRuModal.vue'
import axios from 'axios'

const props = defineProps<{
	allOrders: Array<OrderGeRu>
	allUsers: Array<User>
}>()

const emit = defineEmits(['order-deleted'])

const fuseOrdersOptions = {
	keys: ['user.tg_username', 'user.last_name', 'user.first_name', 'code', 'description', 'cdek_track_nr'],
	threshold: 0.1,
}

let fuseOrders = computed(() => {
	return new Fuse(props.allOrders, fuseOrdersOptions)
})

const newOrderModalRef = ref<typeof NewOrderGeRuModal | null>(null)
const editOrderModalRef = ref<typeof EditOrderGeRuModal | null>(null)
const confirmActionModalRef = ref<typeof ConfirmActionModal | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)

const rowsPerPage = 100
const currentPageNr = ref(1)
const orderSearch = ref('')
const orderStatusFilter = ref(new Set<OrderStatusGeRu>())
const sendNotification = ref(false)
const selectedOrderStatusToSet = ref<OrderStatusGeRu | null>(null)
const selectedOrders = ref<OrderGeRu[]>([])
const allOrdersSelected = ref(false)

const errorMessage = ref('')
const showErrorToast = ref(false)

onBeforeMount(() => {
	props.allOrders.forEach((order) => {
		processOrderValues(order)
	})
})

const orders = computed(() => {
	let result = []

	// search
	if (!orderSearch.value) {
		sortOrders()
		result = [...props.allOrders]
	} else {
		result = fuseOrders.value.search(orderSearch.value).map((result) => result.item)
	}

	// filter by order status
	if (orderStatusFilter.value.size > 0) {
		result = result.filter((order) => orderStatusFilter.value.has(order.status))
	}

	return result
})

const pageNr = computed(() => {
	currentPageNr.value = Math.min(currentPageNr.value, maxPageNr.value)
	return currentPageNr.value
})

const maxPageNr = computed(() => {
	return Math.max(Math.ceil(orders.value!.length / rowsPerPage), 1)
})

const pageOrders = computed(() => {
	return orders.value?.slice((pageNr.value - 1) * rowsPerPage, pageNr.value * rowsPerPage)
})

function setPageNr(newPageNr: number) {
	currentPageNr.value = newPageNr
}

function sortOrders() {
	props.allOrders.sort((a, b) => b.code - a.code)
}

function openConfirmModal() {
	confirmActionModalRef.value?.open()
}

function handleOrderCreated(order: OrderGeRu) {
	processOrderValues(order)
	props.allOrders.push(order)
}

function handleOrderEdited(order: OrderGeRu) {
	const localOrder = props.allOrders.find((o) => o.id === order.id)

	if (localOrder) {
		processOrderValues(order)
		Object.assign(localOrder, order)
	}
}

async function deleteOrder(order: OrderGeRu) {
	emit('order-deleted', order)
}

function processOrderValues(order: OrderGeRu) {
	order.original_price = new Decimal(order.original_price)
	order.current_price = new Decimal(order.current_price)
	order.weight = new Decimal(order.weight)
	order.created_at = new Date(order.created_at)
	order.payment_date = order.payment_date ? new Date(order.payment_date) : null
	order.delivered_at = order.delivered_at ? new Date(order.delivered_at) : null
	order.user = props.allUsers.find((u) => u.id === order.user_id)
}

async function updateOrderStatusForSelection() {
	try {
		const body: OrderGeRuBatchPatchRequest = {
			patches: selectedOrders.value.map((order) => ({
				id: order.id,
				status: selectedOrderStatusToSet.value!,
			})),
			send_notification: sendNotification.value,
		}

		const updatedOrders = (await axios.patch('/api/admin/geru/orders', body)).data

		for (const order of updatedOrders) {
			selectedOrders.value.find((o) => o.id === order.id)!.status = order.status
		}
	} catch (ex) {
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	} finally {
		confirmActionModalRef.value?.close()
	}
}

function handleOrderStatusUpdateClosed() {
	selectedOrderStatusToSet.value = null
}

function exportToCSV() {
	const bom = '\uFEFF'
	const headers = [
		'Номер заказа',
		'Фамилия',
		'Имя',
		'Вес без округления',
		'Начальная сумма',
		'Конечная сумма',
		'Дата завершения заказа',
		'Способ оплаты',
		'Дата оплаты',
	]
	const rows: string[] = []

	for (const order of orders.value) {
		const row = [
			order.code,
			order.user?.last_name,
			order.user?.first_name,
			order.weight,
			order.original_price,
			order.current_price,
			order.delivered_at?.toLocaleDateString(),
			paymentMethodToAdminDisplayString(order.payment_method),
			order.payment_date?.toLocaleDateString(),
		].join(',')
		rows.push(row)
	}

	const data = [headers, rows.join('\n')].join('\n')
	const blob = new Blob([bom + data], { type: 'text/csv' })

	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = 'orders.csv'

	a.click()
}

function toggleAllOrdersSelected() {
	selectedOrders.value = allOrdersSelected.value ? [...orders.value] : []
}

async function updateOrderStatus(order: OrderGeRu, newOrderStatus: OrderStatusGeRu) {
	try {
		const body: OrderGeRuPatchRequest = { status: newOrderStatus, send_notification: sendNotification.value }
		const updatedOrder = (await axios.patch(`/api/admin/geru/orders/${order.id}`, body)).data
		order.status = updatedOrder.status
	} catch (ex) {
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function updatePaymentMethod(order: OrderGeRu, newPaymentMethod: PaymentMethod) {
	try {
		const body: OrderGeRuPatchRequest = { payment_method: newPaymentMethod, send_notification: sendNotification.value }
		const updatedOrder = (await axios.patch(`/api/admin/geru/orders/${order.id}`, body)).data
		order.payment_method = updatedOrder.payment_method
	} catch (ex) {
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}
</script>

<template>
	<div class="flex flex-col grow">
		<div class="flex flex-row min-h-12 mr-3 justify-between items-center">
			<span class="text-2xl font-bold">Orders &nbsp;&nbsp; GE - RU</span>
			<div class="flex flex-row gap-5">
				<label class="label cursor-pointer gap-2 p-0">
					<input type="checkbox" class="checkbox checkbox-sm" v-model="sendNotification" />
					<span class="label-text">Send notification</span>
				</label>
				<StatusGeRuDropdown
					class="select-sm"
					placeholder="Change status"
					form-control-class="w-fit"
					v-model="selectedOrderStatusToSet"
					:disabled="selectedOrders.length == 0"
					@change="openConfirmModal"
				/>
				<button class="btn btn-sm" @click="exportToCSV">
					Export CSV
					<ion-icon name="download-outline" class="text-base"></ion-icon>
				</button>
				<div class="dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-sm mb-1">
						{{ orderStatusFilter.size > 0 ? `Selected ${orderStatusFilter.size}` : 'All stages' }}
						<ion-icon name="filter-outline" class="text-base"></ion-icon>
					</div>
					<ul tabindex="0" class="menu dropdown-content rounded-box z-[1] p-2 shadow w-52 bg-white">
						<li v-for="status in Object.values(OrderStatusGeRu)">
							<label class="label cursor-pointer">
								<span class="label-text">{{ toAdminDisplayString(status) }}</span>
								<input type="checkbox" class="checkbox checkbox-sm" :value="status" v-model="orderStatusFilter" />
							</label>
						</li>
					</ul>
				</div>
				<label
					class="input input-sm input-bordered focus-within:outline-0 focus-within:border-gray-500 flex items-center"
				>
					<input type="text" class="grow" placeholder="Search" v-model="orderSearch" />
					<ion-icon name="search-outline"></ion-icon>
				</label>
				<button class="btn btn-sm btn-outline" @click="newOrderModalRef?.open()">Add order</button>
			</div>
		</div>
		<div class="flex flex-col bg-white mr-3 mb-5 grow">
			<table class="table table-sm">
				<thead>
					<tr class="bg-base-200">
						<th>
							<label class="label cursor-pointer">
								<input
									type="checkbox"
									class="checkbox checkbox-sm"
									v-model="allOrdersSelected"
									@change="toggleAllOrdersSelected"
								/>
							</label>
						</th>
						<th>ORDER CODE</th>
						<th>STATUS</th>
						<th>USER</th>
						<th>TELEGRAM</th>
						<th>WEIGHT</th>
						<th>PRICE</th>
						<th>TRACK NUMBER</th>
						<th>PAID WITH</th>
						<th>CREATION DATE</th>
						<th>PAYMENT DATE</th>
						<th>DELIVERY DATE</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="order in pageOrders" :key="order.id">
						<td>
							<label class="label cursor-pointer">
								<input type="checkbox" class="checkbox checkbox-sm" :value="order" v-model="selectedOrders" />
							</label>
						</td>
						<td>{{ order.code }}</td>
						<td>
							<StatusGeRuDropdown
								:model-value="order.status"
								class="select-sm"
								:class="[`bg-[${toAdminColorCode(order.status)}]`, 'focus:bg-white', 'focus:text-black']"
								form-control-class="w-fit"
								@update:model-value="(val: OrderStatusGeRu) => updateOrderStatus(order, val)"
							/>
						</td>
						<td>{{ order.user?.first_name }} {{ order.user?.last_name }}</td>
						<td>{{ order.user?.tg_username }}</td>
						<td>{{ order.weight }}</td>
						<td>{{ order.current_price }}</td>
						<td>{{ order.cdek_track_nr }}</td>
						<td>
							<PaymentMethodDropdown
								:model-value="order.payment_method"
								class="select-sm"
								:class="[
									`bg-[${paymentMethodToAdminColorCode(order.payment_method)}]`,
									'focus:bg-white',
									'focus:text-black',
								]"
								form-control-class="w-fit"
								@update:model-value="(val: PaymentMethod) => updatePaymentMethod(order, val)"
							/>
						</td>
						<td>{{ order.created_at.toLocaleDateString() }}</td>
						<td>{{ order.payment_date?.toLocaleDateString() }}</td>
						<td>{{ order.delivered_at?.toLocaleDateString() }}</td>
						<td>
							<div class="flex flex-row gap-2">
								<button class="btn btn-sm text-gray-500 btn-square btn-outline" @click="editOrderModalRef?.open(order)">
									<ion-icon name="pencil"></ion-icon>
								</button>
								<button
									class="btn btn-sm text-gray-500 btn-square btn-outline"
									@click="confirmDeleteModalRef?.open(() => deleteOrder(order))"
								>
									<ion-icon name="trash"></ion-icon>
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<AdminPagination :page-nr="pageNr" :max-page-nr="maxPageNr" @page-nr-changed="setPageNr" />
		<NewOrderGeRuModal ref="newOrderModalRef" @order-created="handleOrderCreated" :users="allUsers" />
		<EditOrderGeRuModal ref="editOrderModalRef" @order-edited="handleOrderEdited" :users="allUsers" />
		<AdminConfirmActionModal
			ref="confirmActionModalRef"
			@confirmed="updateOrderStatusForSelection"
			@closed="handleOrderStatusUpdateClosed"
		>
			<p>
				New status: <b>{{ toAdminDisplayString(selectedOrderStatusToSet!) }}</b>
			</p>
		</AdminConfirmActionModal>
		<AdminConfirmDeleteModal ref="confirmDeleteModalRef" />
		<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	</div>
</template>
