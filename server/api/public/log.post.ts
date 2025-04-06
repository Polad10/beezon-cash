import { LogLevel } from '~/models/LogLevel'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  log(event.context.correlationId, body.logLevel as LogLevel, body.message, body.extra)
})
