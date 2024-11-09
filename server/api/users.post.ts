import axios from 'axios'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = (await axios.post('http://localhost:3001/admin/api/users', body)).data

  return user
})
