import { log } from '../utils/log'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await log(body.level, body.message)
})
