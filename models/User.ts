import type Decimal from 'decimal.js'

export interface User {
  id: string
  first_name: string
  last_name: string
  phone_nr: string
  tg_username: string
  referral_code: string
  invited_by: string | null
  balance: Decimal
}

export interface UserRequest {
  first_name: string
  last_name: string
  phone_nr: string
  tg_username: string
  invited_by?: string | null
  balance?: Decimal
}

export interface UserSignupRequest {
  first_name: string
  last_name: string
  phone_nr: string
  invite_code?: string
}
