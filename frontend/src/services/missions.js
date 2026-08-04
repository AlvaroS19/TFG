import axios from './axiosInstance';

const API_URL = '/missions';

export async function getMissions() {
  const res = await axios.get(`${API_URL}`);
  return res.data;
};

export const completeMission = async (missionId) => {
  const res = await axios.post(`${API_URL}/complete`, { missionId });
  return res.data;
};

export const getCompletedMissions = async () => {
  const res = await axios.get(`${API_URL}/completed`);
  return res.data;
};