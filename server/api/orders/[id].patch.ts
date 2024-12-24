import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const id = getRouterParam(event, 'id')

    const order = (await axios.patch(`${process.env.BEEZON_ADMIN_API_URL}/orders/${id}`, body)).data

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
