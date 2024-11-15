import axios from 'axios'

export default defineEventHandler(async (event) => {
  const users = (await axios.get('http://localhost:3001/admin/api/users')).data

  return users
})
