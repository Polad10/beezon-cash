import axios from 'axios'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  await axios.delete(`http://localhost:3001/admin/api/messages/${id}`)
})
