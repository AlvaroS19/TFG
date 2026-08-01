import { apiFetch } from '../services/api';

export const getUserConfig = async () => {
  const res = await apiFetch('/user/objective'
);

  if (!res.ok) throw new Error('No se pudo obtener el objetivo');
  return await res.json(); // { objetivo: "fuerza" }
};
