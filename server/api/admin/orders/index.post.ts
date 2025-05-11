import axios from 'axios'
import { LogLevel } from '~/models/LogLevel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const order = (
      await axios.post(`${process.env.BEEZON_API_URL}/admin/orders`, body, {
        headers: { Authorization: `Bearer ${process.env.BEEZON_API_SECRET}` },
      })
    ).data

    return order
  } catch (ex) {
    const error = ex as Error

    const logExtra = {
      cause: error.cause,
      stack: error.stack,
    }

    log(event.context.correlationId, LogLevel.ERROR, error.message, logExtra)
    throw ex
  }
})
