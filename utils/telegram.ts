import { mockTelegramEnv } from '@telegram-apps/sdk'

export function mockTgEnv() {
  mockTelegramEnv({
    themeParams: {},
    initData: {
      user: {
        id: 1220167578,
        firstName: 'Andrew',
        lastName: 'Rogue',
        username: 'rikapiu',
        languageCode: 'en',
        isPremium: true,
        allowsWriteToPm: true,
      },
      hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
      authDate: new Date(1716922846000),
      startParam: 'debug',
      chatType: 'sender',
      chatInstance: '8428209589180549439',
    },
    initDataRaw: new URLSearchParams([
      [
        'user',
        JSON.stringify({
          id: 1220167578,
          first_name: 'Andrew',
          last_name: 'Rogue',
          username: 'rikapiu',
          language_code: 'en',
          is_premium: true,
          allows_write_to_pm: true,
        }),
      ],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', Date.now().toString()],
      ['start_param', 'debug'],
      ['chat_type', 'sender'],
      ['chat_instance', '8428209589180549439'],
    ]).toString(),
    version: '7.2',
    platform: 'tdesktop',
  })
}
