import { getCookie } from './auth';

export const getUserConfig = async () => {
  const token = getCookie('idToken');
  const res = await fetch('http://localhost:5000/user/objective', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('No se pudo obtener el objetivo');
  return await res.json(); // { objetivo: "fuerza" }
};
