import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const messages = (await axios.get(`${process.env.BEEZON_ADMIN_API_URL}/messages`)).data
    return messages
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
