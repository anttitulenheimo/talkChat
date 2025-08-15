import axios from 'axios'
const baseUrl = '/api/users'

const search = async (username) => {
    const url = `${baseUrl}/username/${username}`
    const response = await axios.get(url, username)
    return response.data
}

const searchByUserId = async (usersId) => {
    const url = `${baseUrl}/id/${usersId}`
    const response = await axios.get(url, usersId)
    return response.data
}

export default { search,  searchByUserId }