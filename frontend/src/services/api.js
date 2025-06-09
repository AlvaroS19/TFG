const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.131:5000';

export async function apiFetch(path, options = {}) {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include' // Envía cookies de sesión
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };

  const response = await fetch(`${BASE_URL}${path}`, finalOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Error desconocido');
  }

  return await response.json();
}