import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    await axios.delete(`${process.env.BEEZON_ADMIN_API_URL}/messages/${id}`)
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
