<script lang="ts" setup>
const modalRef = ref<HTMLDialogElement | null>(null)

defineExpose({ open })

function open() {
  modalRef.value?.showModal()
}
</script>

<template>
  <dialog class="modal" ref="modalRef">
    <div class="modal-box" tabindex="0">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="modalRef?.close()">✕</button>
      <p class="mt-5">СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</p>
      <br />
      <p>
        Я настоящим даю свое согласие компании <b>Beezon Logistics</b> (далее – «Компания»), зарегистрированной и
        осуществляющей деятельность в соответствии с законодательством Грузии, на обработку моих персональных данных в
        целях оказания услуг, предоставляемых через приложение <b>Beezon Online</b>.
      </p>
      <br />
      <ul class="list-decimal pl-5">
        <li>
          <b>Цели обработки персональных данных</b>
          <p>Компания осуществляет обработку моих персональных данных для следующих целей:</p>
          <ul class="list-disc pl-5">
            <li>Регистрация и авторизация в приложении Beezon Online;</li>
            <li>Обработка и выполнение заказов на логистические услуги;</li>
            <li>Связь со мной по вопросам доставки, статуса заказов, оплаты и других аспектов обслуживания;</li>
            <li>Улучшение качества услуг, аналитика и персонализация предложений;</li>
            <li>Соблюдение требований законодательства Грузии.</li>
          </ul>
        </li>
        <li>
          <b>Перечень обрабатываемых персональных данных</b>
          <p>В рамках предоставления услуг компания может обрабатывать следующие данные:</p>
          <ul class="list-disc pl-5">
            <li>Фамилия и Имя;</li>
            <li>Контактные данные (телефон, e-mail, адрес доставки);</li>
            <li>Платежные реквизиты (в случае необходимости обработки оплаты);</li>
            <li>Данные о заказах, история транзакций и предпочтения.</li>
          </ul>
        </li>
        <li>
          <b>Срок хранения персональных данных</b>
          <p>Персональные данные хранятся бессрочно, если только клиент не запросит их удаление.</p>
        </li>
        <li>
          <b>Права субъекта персональных данных</b>
          <p>Я имею право:</p>
          <ul class="list-disc pl-5">
            <li>
              Отозвать согласие на обработку персональных данных, направив запрос на e-mail
              <a class="text-blue-700 font-semibold" href="mailto:beezon.georgia@gmail.com">beezon.georgia@gmail.com</a>
              или связавшись с менеджером через Telegram:
              <a class="text-blue-700 font-semibold" href="https://t.me/Beezon_manager_ge">@beezon_manager_ge</a>;
            </li>
            <li>Запросить исправление или удаление своих персональных данных;</li>
          </ul>
        </li>
      </ul>
      <br />
      <p>Я подтверждаю, что ознакомлен(а) с условиями обработки персональных данных и даю свое согласие добровольно.</p>
      <div class="modal-action">
        <button class="btn btn-block rounded-xl" @click="modalRef?.close()">Закрыть</button>
      </div>
    </div>
  </dialog>
</template>
