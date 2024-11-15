import { HTTPMethod } from 'h3'

export default defineEventHandler(async (event) => {
  let extra = {
    headers: getHeaders(event),
    ip: getRequestIP(event),
    body: null,
  }

  if (isMethod(event, ['POST', 'PUT'])) {
    extra.body = await readBody(event)
  }

  log(LogLevel.INFO, event.toString(), extra)
})
