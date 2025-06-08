import { getCookie } from './auth';
import { apiFetch } from '../services/api';

export const getUserConfig = async () => {
  const token = getCookie('idToken');
  const res = await apiFetch('/user/objective', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('No se pudo obtener el objetivo');
  return await res.json(); // { objetivo: "fuerza" }
};
