import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = getRouterParam(event, 'id')

  const order = (await axios.put(`http://localhost:3001/admin/api/orders/${id}`, body)).data

  return order
})
