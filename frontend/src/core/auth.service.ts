export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export function isAuthenticated() {
  return !!getCookie('idToken');
}

export function getToken(): string | null {
  return getCookie('idToken');
}

export function logout(): void {
  document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  localStorage.clear();
  window.location.href = '/login';
}