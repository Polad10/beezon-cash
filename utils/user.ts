import type { User } from '~/models/User'

export function getUserNameAndTelegram(user: User) {
  return `${user.first_name} ${user.last_name} (@${user.tg_username})`
}
