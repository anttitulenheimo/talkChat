import axios from 'axios'
const baseUrl = '/api/messages'

const getMessages = async (chatId) => {
    const url = `${baseUrl}/${chatId}`
    const response = await axios.get(url)
    return response.data
}

export default { getMessages }