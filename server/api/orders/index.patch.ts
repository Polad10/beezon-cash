import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const orders = (await axios.patch(`${process.env.BEEZON_ADMIN_API_URL}/orders`, body)).data

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
