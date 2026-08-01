const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/auth';

export async function registerUser({ name, lastName, email, password, objetivo }) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lastName, email, password, objetivo })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registro fallido');
  }

  return await res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login fallido');
  }

  return await res.json();
}