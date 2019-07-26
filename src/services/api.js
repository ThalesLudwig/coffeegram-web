import axios from 'axios'
import hostPath from '../env'

const api = axios.create({
    baseURL: hostPath
})

export default api