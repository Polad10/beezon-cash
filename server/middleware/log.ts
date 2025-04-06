import { randomUUID } from 'crypto'
import { LogLevel } from '~/models/LogLevel'

export default defineEventHandler(async (event) => {
  const correlationId = randomUUID()
  event.context.correlationId = correlationId

  let extra = {
    headers: getHeaders(event),
    ip: getRequestIP(event),
    body: null,
  }

  if (isMethod(event, ['POST', 'PUT'])) {
    extra.body = await readBody(event)
  }

  await log(correlationId, LogLevel.INFO, event.toString(), extra)
})
