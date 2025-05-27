// src/services/missions.js
import axios from 'axios'

const API_URL = '/missions'

export const getMissions = async () => {
  const res = await axios.get(API_URL, { withCredentials: true })
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
