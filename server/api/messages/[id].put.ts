import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = getRouterParam(event, 'id')

  const message = (await axios.put(`http://localhost:3001/admin/api/messages/${id}`, body)).data

  return message
})
