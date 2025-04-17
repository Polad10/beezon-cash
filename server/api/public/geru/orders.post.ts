import axios, { AxiosError, HttpStatusCode } from 'axios'
import { LogLevel } from '~/models/LogLevel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    await axios.post(`${process.env.BEEZON_PUBLIC_API_URL}/geru/orders`, body)
  } catch (ex: any) {
    const error = ex as AxiosError

    const logExtra = {
      cause: error.cause,
      stack: error.stack,
      data: error.response?.data,
    }

    log(event.context.correlationId, LogLevel.ERROR, error.message, logExtra)

    throw createError({
      statusCode: error.response?.status || HttpStatusCode.InternalServerError,
      statusMessage: error.response?.statusText || 'Something went wrong',
      message: error.message,
      data: error.response?.data,
    })
  }
})
