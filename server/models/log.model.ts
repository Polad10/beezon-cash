import { Schema, model } from 'mongoose'

export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const LogSchema = new Schema({
  level: {
    type: String,
    enum: Object.values(LogLevel),
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  app: {
    type: String,
    default: 'beezon-cash',
  },
})

export const Log = model('Log', LogSchema)
