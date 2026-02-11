<script setup lang="ts">
import { retrieveLaunchParams, type LaunchParams } from '@telegram-apps/sdk'
import { ref } from 'vue'
import axios, { HttpStatusCode } from 'axios'
import type { User } from '~/models/User'
import type { Order } from '~/models/Order'
import Decimal from 'decimal.js'
import type NewOrderWithoutUserInfo from '~/components/NewOrderWithoutUserInfo.vue'
import type EditOrderWithoutUserInfo from '~/components/EditOrderWithoutUserInfo.vue'
import type ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'
import { OrderStatus, toClientColorCode, toClientDisplayString } from '~/models/OrderStatus'
import { toDisplayString as toOrderDisplayString } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'
import { City, toDisplayString } from '~/models/City'
import Tooltip from '~/components/Tooltip.vue'

enum Tab {
	Home,
	Orders,
	Promo,
}

let headers = {}

const activeTab = ref<Tab>(Tab.Home)
const initDataRaw = ref<string | undefined>(undefined)
const copyToastVisible = ref(false)
const customErrorToastVisible = ref(false)
const customErrorMessage = ref('')
const errorToastVisible = ref(false)
const showSuccessToast = ref(false)
const successToastMessage = ref('')
const loading = ref(true)
const loadingError = ref(false)

const user = ref<User | null>(null)
const orders = ref<Order[]>([])
const selectedOrderId = ref<string | null>(null)

const newOrderRef = ref<typeof NewOrderWithoutUserInfo | null>(null)
const editOrderRef = ref<typeof EditOrderWithoutUserInfo | null>(null)
const confirmDeleteModalRef = ref<typeof ConfirmDeleteModal | null>(null)

const computedOrders = computed(() => {
	orders.value.forEach(processOrder)
	return orders.value.sort((a, b) => b.code - a.code)
})

const selectedOrder = computed(() => {
	return computedOrders.value.find((o) => o.id === selectedOrderId.value)
})

const orderTypesOfSelectedOrder = computed(() => {
	return selectedOrder.value?.order_type_mappings.map((m) => m.order_type) || []
})

const discountOfSelectedOrder = computed(() => {
	return selectedOrder.value?.original_price.minus(selectedOrder.value.current_price) || new Decimal(0)
})

onMounted(async () => {
	loading.value = true
	var launchParams: LaunchParams | null = null

	try {
		if (useRuntimeConfig().public.ENVIRONMENT == 'local') {
			mockTgEnv()
		}

		launchParams = retrieveLaunchParams()
		initDataRaw.value = launchParams.initDataRaw

		const user = launchParams?.initData?.user
		setUser(user?.id.toString(), user?.username)

		headers = {
			headers: { Authorization: `tma ${initDataRaw.value}` },
		}

		await retrieveMe()
	} catch (err) {
		logError(err)
		loadingError.value = true
	} finally {
		loading.value = false
	}
})

async function retrieveMe() {
	try {
		const me = (await axios.get<User | null>('/api/client/me', headers)).data

		if (me) {
			const ordersData = (await axios.get<Order[]>('/api/client/orders', headers)).data
			me.balance = new Decimal(me.balance)

			user.value = me
			orders.value = ordersData
		}
	} catch (err) {
		const statusCode = getErrorResponseStatusCode(err)

		if (statusCode == HttpStatusCode.NotFound) {
			// user is just not found
			return
		}

		logError(err)
		throw err
	}
}

function processOrder(order: Order) {
	order.date = new Date(order.date)
	order.current_price = new Decimal(order.current_price)
	order.original_price = new Decimal(order.original_price)
	order.bonus_received = new Decimal(order.bonus_received)
}

function showBonusBalanceExceededToast() {
	customErrorMessage.value = 'Вы списываете больше бонусов, чем есть на балансе'
	showToast(customErrorToastVisible)
}

function showMaxDiscountAmountExceededToast(maxDiscountAmount: Decimal) {
	customErrorMessage.value = `Для данного заказа вы можете списать не более ${maxDiscountAmount} лари`
	showToast(customErrorToastVisible)
}

function showBonusIsZeroToast() {
	customErrorMessage.value = 'Сумма должна быть > 0'
	showToast(customErrorToastVisible)
}

function showErrorToast() {
	showToast(errorToastVisible)
}

async function copyReferralCode() {
	await navigator.clipboard.writeText(user.value!.referral_code)
	showToast(copyToastVisible)
}

async function applyBonus(orderId: string, bonus: Decimal) {
	try {
		if (!bonus.greaterThan(0)) {
			showBonusIsZeroToast()
			return false
		}

		if (bonus.greaterThan(user.value!.balance)) {
			showBonusBalanceExceededToast()
			return false
		}

		const order = orders.value.find((o) => o.id === orderId)

		if (!order) {
			return false
		}

		const maxDiscountAmount = getMaxDiscountAmount(order)

		if (bonus.greaterThan(maxDiscountAmount)) {
			showMaxDiscountAmountExceededToast(maxDiscountAmount)
			return false
		}

		const result = (
			await axios.post<{ user: User; order: Order }>(`api/client/orders/${orderId}/bonus`, { amount: bonus }, headers)
		).data

		user.value!.balance = new Decimal(result.user.balance)
		order.current_price = new Decimal(result.order.current_price)

		return true
	} catch (err) {
		showErrorToast()
		return false
	}
}

async function handleUserSignedUp() {
	loading.value = true

	try {
		await retrieveMe()
	} catch (err) {
		logError(err)
		loadingError.value = true
	} finally {
		loading.value = false
	}
}

async function handleOrderCreated(order: Order) {
	activeTab.value = Tab.Orders
	orders.value.push(order)

	successToastMessage.value = 'Заказ оформлен!'
	showToast(showSuccessToast)
}

async function handleSelectedOrderEdited(order: Order) {
	const orderIndex = orders.value.findIndex((o) => o.id === order.id)

	if (orderIndex >= 0) {
		orders.value.splice(orderIndex, 1, order)
	}

	successToastMessage.value = 'Заказ обновлен!'
	showToast(showSuccessToast)
}

async function deleteSelectedOrder() {
	try {
		if (!selectedOrder.value) {
			return
		}

		await axios.delete(`api/client/orders/${selectedOrder.value.id}`, headers)

		orders.value = orders.value.filter((o) => o.id !== selectedOrder.value!.id)

		successToastMessage.value = 'Заказ удален!'
		showToast(showSuccessToast)
	} catch (err) {
		logError(err)
		showToast(errorToastVisible)
	}
}

function handleOrderClicked(order: Order) {
	selectedOrderId.value = order.id
}
</script>

<template>
	<div class="h-full">
		<div v-if="loadingError" class="h-full flex flex-col justify-center items-center">
			<p class="text-2xl p-2">Что-то пошло не так. Пожалуйста, попробуйте чуть позже.</p>
		</div>
		<div v-else-if="loading" class="h-full flex flex-col justify-center items-center">
			<span class="loading loading-spinner text-accent"></span>
		</div>
		<Signup v-else-if="!user" :init-data-raw="initDataRaw!" @user-signed-up="handleUserSignedUp" />
		<div v-else>
			<div class="text-black">
				<div class="flex flex-col bg-white h-screen">
					<div class="flex flex-row pt-2">
						<div
							class="flex flex-col flex-1 items-center gap-2 border-b-2"
							:class="{ 'text-blue-700 font-bold border-blue-700': activeTab === Tab.Home }"
							@click="activeTab = Tab.Home"
						>
							<ion-icon name="home-outline" class="text-2xl"></ion-icon>
							Главная
						</div>
						<div
							class="flex flex-col flex-1 items-center gap-2 border-b-2"
							:class="{ 'text-blue-700 font-bold border-blue-700': activeTab === Tab.Orders }"
							@click="activeTab = Tab.Orders"
						>
							<ion-icon name="heart-outline" class="text-2xl"></ion-icon>
							Заказы
						</div>
						<div
							class="flex flex-col flex-1 items-center gap-2 border-b-2"
							:class="{ 'text-blue-700 font-bold border-blue-700': activeTab === Tab.Promo }"
							@click="activeTab = Tab.Promo"
						>
							<ion-icon name="ticket-outline" class="text-2xl"></ion-icon>
							Промокод
						</div>
					</div>
					<div v-if="activeTab === Tab.Home" class="flex flex-col flex-1 container mx-auto pt-7 px-5">
						<div id="profile-card" class="flex flex-col justify-between h-64 bg-blue-700 rounded-2xl p-6 text-white">
							<div class="flex flex-row justify-between">
								<div class="flex flex-col">
									<div class="flex flex-row items-center">
										<p>Ваш бонусный баланс</p>
										<Tooltip class="bg-white/75 text-black">
											<ion-icon name="information-circle" class="text-base ml-2 text-white" size="small"></ion-icon>

											<template #content>
												Применить бонусы можно на этапе, когда заказ <b>“Готов к выдаче”</b>
											</template>
										</Tooltip>
									</div>
									<p class="text-3xl font-semibold">₾ {{ user.balance }}</p>
								</div>
								<img src="public/georgia-flag.svg" width="60" />
							</div>
							<div class="flex flex-row mt-7 text-center text-sm justify-center gap-16">
								<div class="flex flex-col w-12 items-center gap-2" @click="newOrderRef?.open()">
									<button class="btn btn-circle text-2xl">
										<ion-icon name="add-outline"></ion-icon>
									</button>
									<p>Оформить заказ</p>
								</div>
								<a href="https://t.me/Beezon_manager_ge">
									<div class="flex flex-col w-12 items-center gap-2">
										<button class="btn btn-circle text-2xl">
											<ion-icon name="paper-plane-outline"></ion-icon>
										</button>
										<p>Написать менеджеру</p>
									</div>
								</a>
								<a href="https://beezon.store/" target="_blank">
									<div class="flex flex-col w-12 items-center gap-2">
										<button class="btn btn-circle text-2xl">
											<ion-icon name="storefront-outline"></ion-icon>
										</button>
										<p>Открыть Beezmarket</p>
									</div>
								</a>
							</div>
						</div>
						<div class="flex flex-row gap-5 mt-5">
							<a class="btn flex-1" href="https://t.me/beezon_logistics/145">Инструкции</a>
							<a class="btn flex-1" href="https://t.me/beezon_logistic">Общий чат</a>
						</div>
					</div>
					<div v-if="activeTab === Tab.Orders" class="flex flex-col flex-1 container mx-auto p-5">
						<div v-if="selectedOrder" class="flex flex-col flex-1">
							<div class="flex flex-row font-semibold items-center">
								<ion-icon name="chevron-back" size="small" @click="() => (selectedOrderId = null)"></ion-icon>
								<p class="mx-auto">Подробнее о заказе</p>
							</div>
							<div class="flex flex-row justify-center gap-2 text-xs font-medium mt-3">
								<div
									class="flex flex-col items-center bg-gray-100 py-2 rounded-xl w-full"
									:class="{ 'pointer-events-none opacity-50': selectedOrder.status > OrderStatus.WarehouseRF }"
									@click="editOrderRef?.open(selectedOrder)"
								>
									<ion-icon name="pencil-outline" size="small"></ion-icon>
									<p>Изменить</p>
								</div>
								<a
									class="flex flex-col items-center bg-gray-100 py-2 rounded-xl w-full"
									:href="`http://t.me/Beezon_manager_ge?text=${encodeURIComponent(`Здравствуйте. У меня вопрос по заказу #${selectedOrder.code}`)}.`"
								>
									<ion-icon name="help-circle-outline" size="small"></ion-icon>
									<p>Вопросы</p>
								</a>
								<div
									class="flex flex-col items-center bg-gray-100 py-2 rounded-xl w-full text-red-700"
									:class="{ 'pointer-events-none opacity-50': selectedOrder.status !== OrderStatus.New }"
									@click="() => confirmDeleteModalRef?.open()"
								>
									<ion-icon name="close-circle-outline" size="small"></ion-icon>
									<p>Отменить</p>
								</div>
							</div>
							<div class="flex flex-col flex-1 my-3 bg-gray-100 p-5 rounded-xl">
								<div class="flex flex-row items-center justify-between">
									<div class="flex flex-col">
										<p class="font-semibold">Заказ #{{ selectedOrder.code }}</p>
										<p class="text-sm font-light opacity-50">{{ formatDateRu(selectedOrder.date) }}</p>
									</div>
									<div
										:class="[`bg-[${toClientColorCode(selectedOrder.status)}]`]"
										class="py-2 px-5 rounded-xl text-sm font-semibold"
									>
										{{ toClientDisplayString(selectedOrder.status) }}
									</div>
								</div>
								<a
									v-if="selectedOrder.city === City.Tbilisi || selectedOrder.city === City.Other"
									class="flex flex-row items-center justify-between bg-white rounded-xl p-3 mt-5"
									href="https://maps.app.goo.gl/QU8LFfuXHzaSidDm6"
									target="_blank"
									rel="noopener noreferrer"
								>
									<div clas="flex flex-col">
										<div class="flex flex-row items-center text-sm font-semibold opacity-60">
											<ion-icon name="navigate-outline" class="mr-1"></ion-icon>
											Пункт выдачи в Тбилиси
										</div>
										<div class="mt-2">
											<p class="font-semibold">Проспект Акакия Церетели, 12</p>
											<p class="text-xs">Каждый день с 11 до 19:00</p>
										</div>
									</div>
									<ion-icon name="chevron-forward" size="small"></ion-icon>
								</a>
								<div v-else class="flex flex-col bg-white rounded-xl p-3 mt-5">
									<div class="flex flex-row items-center text-sm font-semibold opacity-60">
										<ion-icon name="navigate-outline" class="mr-1"></ion-icon>
										Город получателя
									</div>
									<p class="font-semibold mt-2">
										{{ toDisplayString(selectedOrder.city) }}
									</p>
								</div>
								<div class="flex flex-col bg-white rounded-xl p-3 mt-2">
									<div class="flex flex-row items-center text-sm opacity-60">
										<ion-icon name="bag-handle-outline" class="mr-1"></ion-icon>
										Откуда заказ?
									</div>
									<div class="mt-2" v-if="selectedOrder.order_tracks[0]">
										<p class="font-semibold">
											{{ toOrderDisplayString(selectedOrder.order_tracks[0].delivery_provider) }}
										</p>
										<p v-if="selectedOrder.order_tracks[0].track_number" class="text-xs">
											# {{ selectedOrder.order_tracks[0].track_number }}
										</p>
									</div>
								</div>
								<div class="flex flex-col bg-white rounded-xl p-3 mt-2">
									<div class="flex flex-row items-center text-sm font-semibold opacity-60">
										<ion-icon name="cube-outline" class="mr-1"></ion-icon>
										Что в заказе?
									</div>
									<div class="mt-2">
										<p class="text-xs">
											{{ selectedOrder.description }}
										</p>
									</div>
								</div>
								<div class="flex flex-col bg-white rounded-xl p-3 my-2">
									<div class="flex flex-row text-sm font-semibold">
										<div class="flex items-center opacity-60">
											<ion-icon name="flash-outline" class="mr-1"></ion-icon>
											В заказе есть эти категории товаров?
										</div>
										<Tooltip class="bg-[#2B3440] text-[#D7DDE4]">
											<ion-icon name="information-circle" class="text-base ml-2 text-rose-500"></ion-icon>

											<template #content>
												На данные категории товаров распроостраняются дополнительные наценки помимо общего тарифа!
											</template>
										</Tooltip>
									</div>
									<div class="flex flex-col text-xs gap-1 mt-2">
										<div class="flex flex-row items-center">
											<input
												type="checkbox"
												:checked="orderTypesOfSelectedOrder.includes(OrderType.Drugs)"
												class="checkbox checkbox-xs checkbox-secondary mr-2 pointer-events-none"
											/>
											Лекарства и БАДы для людей и животных
										</div>
										<div class="flex flex-row items-center">
											<input
												type="checkbox"
												:checked="orderTypesOfSelectedOrder.includes(OrderType.Electronics)"
												class="checkbox checkbox-xs checkbox-secondary mr-2 pointer-events-none"
											/>
											Товары дороже 300 лари за 1 штуку
										</div>
										<div class="flex flex-row items-center">
											<input
												type="checkbox"
												:checked="orderTypesOfSelectedOrder.includes(OrderType.Commercial)"
												class="checkbox checkbox-xs checkbox-secondary mr-2 pointer-events-none"
											/>
											От 5 повторяющихся единиц товара
										</div>
									</div>
								</div>
								<div class="divider opacity-50 my-auto"></div>
								<div class="flex flex-col">
									<div class="text-sm font-medium">
										<div class="flex flex-row justify-between">
											<p>Доставка до Тбилиси</p>
											<p>{{ selectedOrder.original_price }} ₾</p>
										</div>
										<div class="flex flex-row justify-between">
											<p>Доставка по Грузии</p>
											<p>{{ selectedOrder.partner_cost }} ₾</p>
										</div>
										<div class="flex flex-row justify-between">
											<p>Дополнительные услуги</p>
											<p>{{ selectedOrder.additional_cost }} ₾</p>
										</div>
										<div v-if="discountOfSelectedOrder.gt(0)" class="flex flex-row justify-between">
											<p>Скидка</p>
											<p class="text-green-700">- {{ discountOfSelectedOrder }} ₾</p>
										</div>
									</div>
									<div class="flex flex-row justify-between font-bold mt-5">
										<p>Итого к оплате</p>
										<p>{{ selectedOrder.current_price.add(selectedOrder.partner_cost) }} ₾</p>
									</div>
								</div>
							</div>
						</div>
						<div v-else>
							<OrderItem
								v-for="order in computedOrders"
								:key="order.id"
								:order="order"
								:apply-bonus="applyBonus"
								@order-clicked="handleOrderClicked"
							/>
							<div v-if="computedOrders.length == 0" class="flex flex-col items-center h-full mt-24">
								<div class="flex flex-col w-64 text-center items-center">
									<img src="public/orders-empty.svg" class="w-36" />
									<p class="mt-7">Здесь будет история ваших заказов</p>
									<button class="btn btn-ghost text-blue-800 text-lg mt-7" @click="newOrderRef?.open()">
										Оформить первый заказ
									</button>
								</div>
							</div>
						</div>
					</div>
					<div v-if="activeTab === Tab.Promo" class="flex flex-col flex-1 p-5">
						<div class="flex flex-col items-center">
							<p class="text-xl font-regular text-center">Ваш промокод</p>
							<button
								class="btn btn-wide bg-accent text-xl mt-2 px-5 rounded-2xl hover:bg-accent-content"
								@click="copyReferralCode"
							>
								<div class="mx-auto text-white">{{ user.referral_code }}</div>
								<ion-icon name="copy-outline" class="text-white z-10"></ion-icon>
							</button>
						</div>
						<div class="flex justify-center">
							<ul class="steps steps-vertical mt-5 gap-3">
								<li class="step step-secondary">
									<div>
										<p class="font-semibold text-lg text-left">Отправляете промокод</p>
										<p class="font-thin text-base text-left leading-none">
											Скопируйте свой промокод и отправьте его другу любым удобным способом
										</p>
									</div>
								</li>
								<li class="step step-secondary">
									<div>
										<p class="font-semibold text-lg text-left">Друг регистрируется</p>
										<p class="font-thin text-base text-left leading-none">
											Вводит ваш промокод при заполнении формы приема заказа и получает свой заказ в Грузии
										</p>
									</div>
								</li>
								<li class="step step-secondary" data-content="🎉">
									<div>
										<p class="font-semibold text-lg text-left">Получаете бонусы</p>
										<p class="font-thin text-base text-left leading-none">
											Начисляем <span class="font-medium">10 лари</span> на баланс за первый завершенный заказ вашего
											друга
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
					<div v-if="copyToastVisible" class="toast toast-center">
						<div class="alert bg-secondary text-sm font-bold p-2 flex items-center gap-y-0.5 object-center">
							<span>Скопировано</span>
						</div>
					</div>
					<div
						v-if="customErrorToastVisible"
						class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full"
					>
						<div
							class="alert bg-orange-100 text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-orange-200 object-center"
						>
							<ion-icon name="alert-circle-outline" class="text-warning text-5xl ml-px"></ion-icon>
							<span>{{ customErrorMessage }}</span>
						</div>
					</div>
					<div v-if="errorToastVisible" class="toast toast-top whitespace-normal z-10 flex-row justify-between w-full">
						<div
							class="alert alert-info text-sm font-bold py-3 px-3 flex items-center gap-y-0.5 border border-red-300 object-center"
						>
							<ion-icon name="close-circle-outline" class="text-error text-5xl ml-px"></ion-icon>
							<span>Что-то пошло не так. Пожалуйста, попробуйте чуть позже.</span>
						</div>
					</div>
					<Toast
						v-if="showSuccessToast"
						class="bg-green-200 border-green-400"
						icon-name="checkmark-circle-outline"
						icon-props="text-green-800"
						:message="successToastMessage"
					/>
				</div>
				<NewOrderWithoutUserInfo ref="newOrderRef" :init-data-raw="initDataRaw!" @order-created="handleOrderCreated" />
				<EditOrderWithoutUserInfo
					ref="editOrderRef"
					:init-data-raw="initDataRaw!"
					@order-edited="handleSelectedOrderEdited"
				/>
				<ConfirmDeleteModal ref="confirmDeleteModalRef" @item-deleted="deleteSelectedOrder" />
			</div>
		</div>
	</div>
</template>

<style scoped>
.tab:is(.tab-active, [aria-selected='true']):not(.tab-disabled):not([disabled]),
.tab:is(input:checked) {
	color: theme('colors.accent');
	border-color: theme('colors.accent');
	font-weight: 600;
}

#profile-card {
	background-color: #5e7de3;
	background-image: linear-gradient(160deg, #819bff 0%, #214ad0 80%);
}
</style>
