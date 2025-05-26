const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/auth'// Ajusta el puerto si tu backend usa otro

export async function registerUser(email, password) {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
}

export async function loginUser(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

    if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Login fallido')
}
  return res.json()
}

