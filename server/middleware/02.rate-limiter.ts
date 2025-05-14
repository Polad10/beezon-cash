import { RateLimiterMemory } from 'rate-limiter-flexible'

const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
})

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event) || ''

  try {
    await rateLimiter.consume(ip)
  } catch {
    setResponseStatus(event, 429)
    return send(event, 'Too many requests')
  }
})
