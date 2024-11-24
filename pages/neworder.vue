<script lang="ts" setup>
import type { City } from '~/models/City'
import { DeliveryProvider, toDisplayString as deliveryProviderToDisplayString } from '~/models/OrderTrack'
import { OrderType } from '~/models/OrderTypeMapping'

const firstName = ref('')
const lastName = ref('')
const phoneNr = ref('')
const tgUserName = ref('')
const description = ref('')
const cdekTrackNumber = ref('')
const postTrackNumber = ref('')
const boxberryTrackNumber = ref('')
const post5TrackNumber = ref('')
const hasPromoCode = ref(false)

const showFirstNameInputError = ref(false)
const showLastNameInputError = ref(false)
const showPhoneNrInputError = ref(false)
const showTgUsernameInputError = ref(false)
const city = ref<City | null>(null)
const deliveryProviders = ref<DeliveryProvider[]>([])
const orderTypes = ref<OrderType[]>()
</script>

<template>
  <div data-theme="cmyk">
    <dialog class="modal modal-open" ref="modalRef">
      <div class="modal-box">
        <p class="text-2xl text-center">Доставка из РФ в Грузию</p>
        <div class="divider"></div>
        <div class="flex flex-col gap-2">
          <Input
            type="text"
            label="Имя *"
            placeholder="Alex"
            v-model="firstName"
            :class="{ 'input-error': showFirstNameInputError }"
          />
          <Input
            type="text"
            label="Фамилия *"
            placeholder="Smith"
            v-model="lastName"
            :class="{ 'input-error': showLastNameInputError }"
          />
          <Input
            type="text"
            label="Номер телефона *"
            placeholder="+995 599 12 34 56"
            v-model="phoneNr"
            :class="{ 'input-error': showPhoneNrInputError }"
          />
          <Input
            type="text"
            label="Телеграм *"
            placeholder="username"
            v-model="tgUserName"
            :class="{ 'input-error': showTgUsernameInputError }"
          />
          <CityDropdown label="В какой город Грузии требуется доставка?" placeholder="Выберите город" v-model="city" />
          <div>
            <div class="label">
              <span class="label-text">Где нам нужно будет получить заказ? *</span>
            </div>
            <div class="flex flex-row gap-3">
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.Ozon"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.Ozon) }}</span>
              </label>
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.Wilbderries"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.Wilbderries) }}</span>
              </label>
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.CDEK"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.CDEK) }}</span>
              </label>
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.PostRussia"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.PostRussia) }}</span>
              </label>
            </div>
            <div class="flex flex-row gap-3">
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.POST5"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.POST5) }}</span>
              </label>
              <label class="label cursor-pointer justify-normal gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :value="DeliveryProvider.Boxberry"
                  v-model="deliveryProviders"
                />
                <span class="label-text">{{ deliveryProviderToDisplayString(DeliveryProvider.Boxberry) }}</span>
              </label>
            </div>
          </div>
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.CDEK)"
            label="Трек-номер CDEK"
            type="text"
            placeholder="123456789"
            v-model="cdekTrackNumber"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.PostRussia)"
            label="Трек-номер Почты России"
            type="text"
            placeholder="123456789"
            v-model="postTrackNumber"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.POST5)"
            label="Трек-номер 5POST"
            type="text"
            placeholder="123456789"
            v-model="post5TrackNumber"
          />
          <Input
            v-if="deliveryProviders.includes(DeliveryProvider.Boxberry)"
            label="Трек-номер Boxberry"
            type="text"
            placeholder="123456789"
            v-model="boxberryTrackNumber"
          />
          <Textarea
            label="Краткая опись заказа *"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            v-model="description"
          />
          <div>
            <div>
              <label class="label cursor-pointer justify-normal gap-2">
                <input type="checkbox" class="checkbox checkbox-sm" v-model="hasPromoCode" />
                <span class="label-text">У меня есть промокод друга</span>
              </label>
              <Input v-if="hasPromoCode" type="text" placeholder="Введите промокод" v-model="tgUserName" />
            </div>
            <label class="label cursor-pointer justify-normal gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Drugs" v-model="orderTypes" />
              <span class="label-text">В заказе лекарства или БАДы</span>
            </label>
            <label class="label cursor-pointer justify-normal gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Electronics" v-model="orderTypes" />
              <span class="label-text">В заказе электронные товары дороже 300 лари</span>
            </label>
            <label class="label cursor-pointer justify-normal gap-2">
              <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Commercial" v-model="orderTypes" />
              <span class="label-text">В заказе 5 и более штук одинаковых товаров</span>
            </label>
          </div>
        </div>
        <div class="modal-action">
          <button class="btn btn-success">
            Отправить
            <ion-icon name="chevron-forward"></ion-icon>
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>
