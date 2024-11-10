import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const order = (await axios.post('http://localhost:3001/admin/api/orders', body)).data

  return order
})
