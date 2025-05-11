import axios from 'axios'
import { LogLevel } from '~/models/LogLevel'

export default defineEventHandler(async (event) => {
  try {
    const orders = (await axios.get(`${process.env.BEEZON_API_URL}/client/orders`, { headers: event.node.req.headers }))
      .data
    return orders
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
