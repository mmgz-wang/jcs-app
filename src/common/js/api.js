import axios from 'axios'
import { baseURI } from './common'

axios.defaults.baseURL = baseURI().host


axios.interceptors.response.use(
  res => {
    return res.data
  }
)
export function get(url, param) {
  return axios.get(url, {
    params: param
  })
}

export function post(url, param) {
  return axios.get(url, param)
}

