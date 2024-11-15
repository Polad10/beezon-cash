import axios from 'axios'

export default defineEventHandler(async (event) => {
  const messages = (await axios.get('http://localhost:3001/admin/api/messages')).data

  return messages
})
