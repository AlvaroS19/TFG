import axios from 'axios'
import { getCookie } from './auth'

const API_URL = '/missions'

export const getMissions = async () => {
  const res = await axios.get('http://localhost:5000/missions', {
    withCredentials: true
  })
  return res.data
}

export const completeMission = async (id) => {
  const res = await axios.post(`${API_URL}/complete`, { id }, { withCredentials: true })
  return res.data
}

export const getCompletedMissions = async () => {
  const res = await axios.get(`${API_URL}/completed`, { withCredentials: true })
  return res.data
}