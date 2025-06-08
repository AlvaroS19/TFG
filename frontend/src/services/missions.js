import axios from './axiosInstance';

const API_URL = '/missions';

export async function getMissions() {
  const res = await axios.get(`${API_URL}`, { withCredentials: true });
  return res.data;
};

export const completeMission = async (missionId) => {
  const res = await axios.post(`${API_URL}/complete`, { missionId }, {
    withCredentials: true
  });
  return res.data;
};

export const getCompletedMissions = async () => {
  const res = await axios.get(`${API_URL}/completed`, {
    withCredentials: true
  });
  return res.data;
};
