import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const message = (await axios.post('http://localhost:3001/admin/api/messages', body)).data

  return message
})
