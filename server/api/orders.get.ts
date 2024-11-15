import axios from 'axios'

export default defineEventHandler(async (event) => {
  const orders = (await axios.get('http://localhost:3001/admin/api/orders')).data

  return orders
})
