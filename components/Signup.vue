<template>
  <div class="h-full flex flex-col px-5 py-5">
    <div class="flex flex-col items-center px-8">
      <p class="text-3xl font-bold text-blue-700">BEEZON LOGISTICS</p>
      <p class="text-xl font-bold mt-5">Зарегистрируйтесь</p>
      <p class="text-center font-semibold mt-2">
        Чтобы оформлять новые заказы, отслеживать статус посылок, а также участвовать в программе лояльности
      </p>
    </div>
    <div class="flex flex-col mt-3">
      <Input
        type="text"
        label="Ваше имя"
        placeholder="Иван"
        v-model="firstName"
        :class="{ 'input-error': showFirstNameInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Ваша фамилия"
        placeholder="Иванов"
        v-model="lastName"
        :class="{ 'input-error': showLastNameInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Номер телефона"
        placeholder="+995 999 99 99 99"
        v-model="phoneNr"
        :class="{ 'input-error': showPhoneNrInputError }"
        label-class="font-medium pb-1"
      />
      <Input
        type="text"
        label="Промокод друга (если есть)"
        placeholder="Введите промокод"
        v-model="inviteCode"
        :class="{ 'input-error': showTgUsernameInputError }"
        label-class="font-medium pb-1"
      />
    </div>
    <div class="flex flex-col flex-grow justify-end gap-2">
      <label class="label cursor-pointer justify-normal items-start gap-2">
        <input type="checkbox" class="checkbox checkbox-sm" v-model="hasReferralCode" />
        <span class="text-sm"
          >Я согласен с условиями <a href="#" class="text-blue-700 font-semibold">Политики конфиденциальности</a> и даю
          <a class="text-blue-700 font-semibold" href="#">Согласие на обработку персональных данных</a></span
        >
      </label>
      <button class="btn btn-block self-center bg-blue-700 text-white rounded-xl">Зарегистрироваться</button>
    </div>
  </div>
</template>
