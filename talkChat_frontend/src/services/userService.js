import axios from 'axios'
const baseUrl = '/api/users'

const search = async (username) => {
    const url = `${baseUrl}/${username}`
    const response = await axios.get(url, username)
    return response.data
}

export default { search }