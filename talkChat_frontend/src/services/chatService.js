import axios from 'axios'

const baseUrl = '/api/chats'

const getChats = async (userId) => {
  const url = `${baseUrl}/${userId}`
  const response = await axios.get(url)
  return response.data
}

const newChat = async (chatObject) => {
  const response = await axios.post('/api/chats', chatObject)
  return response.data
}

const remove = async (id) => {
  const url = `${baseUrl}/${id}`
  const response = await axios.delete(url)
  return response.data
}

export default { getChats, newChat, remove }