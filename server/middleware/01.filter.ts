import { HttpStatusCode } from 'axios'

export default defineEventHandler(async (event) => {
  const url = (event.node.req.url || '').toLowerCase()
  const blockPatterns = ['.php', '.js', '.css', '../', '.env']

  if (blockPatterns.some((pattern) => url.includes(pattern))) {
    event.node.res.statusCode = HttpStatusCode.Forbidden
    return send(event, 'Forbidden')
  }
})
