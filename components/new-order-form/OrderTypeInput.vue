<script lang="ts" setup>
import { OrderType } from '~/models/OrderTypeMapping'

const model = defineModel()
</script>

<template>
  <div>
    <label class="label cursor-pointer justify-normal items-start gap-2">
      <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Drugs" v-model="model" />
      <div class="flex flex-col">
        <span class="font-medium">В заказе лекарства или БАДы</span>
        <span class="text-sm font-light leading-4">Для лекарств и БАДов действует наценка 10 лари/упаковка </span>
      </div>
    </label>
    <label class="label cursor-pointer justify-normal items-start gap-2">
      <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Electronics" v-model="model" />
      <div class="flex flex-col">
        <span class="font-medium">В заказе электронные товары дороже 300 лари</span>
        <span class="text-sm font-light leading-4"
          >На провоз электронных товаров дороже 300 лари без растаможивания действует наценка +10% от стоимости
          товара</span
        >
      </div>
    </label>
    <label class="label cursor-pointer justify-normal items-start gap-2">
      <input type="checkbox" class="checkbox checkbox-sm" :value="OrderType.Commercial" v-model="model" />
      <div class="flex flex-col">
        <span class="font-medium">В заказе 5 и более штук одинаковых товаров</span>
        <span class="text-sm font-light leading-4"
          >Такой заказ попадает под понятие “коммерческая партия”, будет действовать наценка от 15 лари и выше в
          зависимости от кол-ва повторяющихся товаров</span
        >
      </div>
    </label>
  </div>
</template>
