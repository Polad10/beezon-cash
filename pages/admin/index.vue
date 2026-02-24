<script setup lang="ts">
import type { Order } from '~/models/Order'
import type { Message } from '~/models/Message'
import type { User } from '~/models/User'
import type { Transaction } from '~/models/Transaction'
import axios from 'axios'
import OrdersGeRu from '~/components/admin/OrdersGeRu.vue'
import MessagesGeRu from '~/components/admin/MessagesGeRu.vue'
import type { OrderGeRu } from '~/models/OrderGeRu'
import type { MessageGeRu } from '~/models/MessageGeRu'
import Settings from '~/components/admin/Settings.vue'
import type { Setting } from '~/models/Setting'

enum ActiveTab {
	Users,
	Orders,
	OrdersGeRu,
	Messages,
	MessagesGeRu,
	Analytics,
	Settings,
}

const ordersStartDate = ref(getDefaultOrdersStartDate())
const ordersGeRuStartDate = ref(getDefaultOrdersStartDate())
const transactionsStartDate = ref(getDefaultTransactionsStartDate())
const transactionsEndDate = ref('')

const users = (await useFetch<User[]>('/api/admin/users')).data

const orders = (
	await useFetch<Order[]>('/api/admin/orders', {
		query: { startDate: ordersStartDate },
		watch: [ordersStartDate],
	})
).data

const ordersGeRu = (
	await useFetch<OrderGeRu[]>('/api/admin/geru/orders?startDate', {
		query: { startDate: ordersGeRuStartDate },
		watch: [ordersGeRuStartDate],
	})
).data

const messages = (await useFetch<Message[]>('/api/admin/messages')).data
const messagesGeRu = (await useFetch<MessageGeRu[]>('/api/admin/geru/messages')).data

const transactions = (
	await useFetch<Transaction[]>('/api/admin/transactions', {
		query: { startDate: transactionsStartDate, endDate: transactionsEndDate },
		watch: [transactionsStartDate, transactionsEndDate],
	})
).data

const setting = (await useFetch<Setting>('/api/admin/settings')).data

const activeTab = ref<ActiveTab>()
const showErrorToast = ref(false)
const errorMessage = ref('')

onMounted(() => {
	if (process.client) {
		const storedActiveTab = localStorage.getItem('activeTab')

		if (storedActiveTab) {
			activeTab.value = Number(storedActiveTab)
		} else {
			activeTab.value = ActiveTab.Users
		}
	}
})

function getDefaultOrdersStartDate() {
	const date = new Date()
	date.setMonth(date.getMonth() - 2)

	return date.toISOString().split('T')[0]
}

function getDefaultTransactionsStartDate() {
	const date = new Date()
	date.setMonth(date.getMonth() - 1)

	return date.toISOString().split('T')[0]
}

function updateOrdersStartDate(newStartDate: string) {
	ordersStartDate.value = newStartDate
}

function updateOrdersGeRuStartDate(newStartDate: string) {
	ordersGeRuStartDate.value = newStartDate
}

function updateTransactionsStartDate(newStartDate: string) {
	transactionsStartDate.value = newStartDate
}

function updateTransactionsEndDate(newEndDate: string) {
	transactionsEndDate.value = newEndDate
}

function setActiveTab(tab: ActiveTab) {
	activeTab.value = tab
	localStorage.setItem('activeTab', tab.toString())
}

async function deleteUser(user: User) {
	try {
		await axios.delete(`/api/admin/users/${user.id}`)
		users.value = users.value!.filter((u) => u.id !== user.id)
		orders.value = orders.value!.filter((o) => o.user_id !== user.id)
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function deleteOrder(order: Order) {
	try {
		await axios.delete(`/api/admin/orders/${order.id}`)
		orders.value = orders.value?.filter((o) => o.id !== order.id)!
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function deleteGeRuOrder(order: OrderGeRu) {
	try {
		await axios.delete(`/api/admin/geru/orders/${order.id}`)
		ordersGeRu.value = ordersGeRu.value?.filter((o) => o.id !== order.id)!
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function deleteMessage(message: Message) {
	try {
		await axios.delete(`/api/admin/messages/${message.id}`)
		messages.value = messages.value?.filter((m) => m.id !== message.id)!
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function deleteGeRuMessage(message: MessageGeRu) {
	try {
		await axios.delete(`/api/admin/geru/messages/${message.id}`)
		messagesGeRu.value = messagesGeRu.value?.filter((m) => m.id !== message.id)!
	} catch (ex) {
		logError(ex)
		errorMessage.value = 'Something went wrong. Please try again later.'
		showToast(showErrorToast)
	}
}

async function handleSettingsUpdated(updatedSetting: Setting) {
	setting.value = updatedSetting
}
</script>

<template>
	<div data-theme="cmyk" class="flex flex-col w-full h-full">
		<div class="navbar">
			<p class="text-2xl font-bold">BEEZON CASH</p>
		</div>
		<div class="flex flex-row my-3 pr-3 bg-zinc-100 grow overflow-auto">
			<div class="flex flex-col w-44">
				<div class="h-12"></div>
				<ul class="menu w-44 rounded-box py-0">
					<li>
						<button :class="{ active: activeTab == ActiveTab.Users }" @click="setActiveTab(ActiveTab.Users)">
							Users
						</button>
					</li>
					<li>
						<button :class="{ active: activeTab == ActiveTab.Orders }" @click="setActiveTab(ActiveTab.Orders)">
							Orders &nbsp;&nbsp; RU - GE
						</button>
					</li>
					<li>
						<button :class="{ active: activeTab == ActiveTab.OrdersGeRu }" @click="setActiveTab(ActiveTab.OrdersGeRu)">
							Orders &nbsp;&nbsp; GE - RU
						</button>
					</li>
					<li>
						<button :class="{ active: activeTab == ActiveTab.Messages }" @click="setActiveTab(ActiveTab.Messages)">
							Messages &nbsp;&nbsp; RU - GE
						</button>
					</li>
					<li>
						<button
							:class="{ active: activeTab == ActiveTab.MessagesGeRu }"
							@click="setActiveTab(ActiveTab.MessagesGeRu)"
						>
							Messages &nbsp;&nbsp; GE - RU
						</button>
					</li>
					<li>
						<button :class="{ active: activeTab == ActiveTab.Analytics }" @click="setActiveTab(ActiveTab.Analytics)">
							Analytics
						</button>
					</li>
					<li>
						<button :class="{ active: activeTab == ActiveTab.Settings }" @click="setActiveTab(ActiveTab.Settings)">
							Settings
						</button>
					</li>
				</ul>
			</div>
			<KeepAlive>
				<AdminUsers v-if="activeTab === ActiveTab.Users" :all-users="users!" @user-deleted="deleteUser" />
			</KeepAlive>

			<KeepAlive>
				<AdminOrders
					v-if="activeTab === ActiveTab.Orders"
					:all-orders="orders!"
					:all-users="users!"
					:start-date="ordersStartDate"
					@start-date-updated="updateOrdersStartDate"
					@order-deleted="deleteOrder"
				/>
			</KeepAlive>

			<KeepAlive>
				<OrdersGeRu
					v-if="activeTab === ActiveTab.OrdersGeRu"
					:all-orders="ordersGeRu!"
					:all-users="users!"
					:start-date="ordersGeRuStartDate"
					@start-date-updated="updateOrdersGeRuStartDate"
					@order-deleted="deleteGeRuOrder"
				/>
			</KeepAlive>

			<KeepAlive>
				<AdminMessages v-if="activeTab === ActiveTab.Messages" :messages="messages!" @message-deleted="deleteMessage" />
			</KeepAlive>

			<KeepAlive>
				<MessagesGeRu
					v-if="activeTab === ActiveTab.MessagesGeRu"
					:messages="messagesGeRu!"
					@message-deleted="deleteGeRuMessage"
				/>
			</KeepAlive>

			<KeepAlive>
				<AdminAnalytics
					v-if="activeTab === ActiveTab.Analytics"
					:allTransactions="transactions!"
					:orders="orders!"
					:users="users!"
					:start-date="transactionsStartDate"
					:end-date="transactionsEndDate"
					@start-date-updated="updateTransactionsStartDate"
					@end-date-updated="updateTransactionsEndDate"
				/>
			</KeepAlive>

			<Settings v-if="activeTab === ActiveTab.Settings" :setting="setting!" @settings-updated="handleSettingsUpdated" />
		</div>
		<Toast v-if="showErrorToast" class="alert-error" icon-name="close-circle-outline" :message="errorMessage" />
	</div>
</template>

<style scoped>
.btn.btn-disabled {
	background-color: theme('colors.transparent');
}

button.active,
.btn-active {
	background-color: theme('colors.black') !important;
	color: theme('colors.white') !important;
}
</style>
