const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/auth'// Ajusta el puerto si tu backend usa otro

export async function registerUser({ name, lastName, email, password, objetivo }) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lastName, email, password, objetivo })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registro fallido');
  }}

export async function loginUser(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login fallido');
  }

  return await res.json();
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export function isAuthenticated() {
  return !!getCookie('idToken');
}

export function logout() {
  document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  localStorage.clear();
  window.location.href = '/login';
}


