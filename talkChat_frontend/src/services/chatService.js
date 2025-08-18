import axios from 'axios'
const baseUrl = '/api/getAllChats/'

const getChats = async (userId) => {
    const url = `${baseUrl}/${userId}`
    const response = await axios.get(url)
    return response.data
}

export default { getChats }