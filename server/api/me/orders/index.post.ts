import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    return (await axios.post(`${process.env.BEEZON_API_URL}/orders`, body, { headers: event.node.req.headers })).data
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
