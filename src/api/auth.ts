import { apiRequest, setToken, clearToken } from './client';
import { User } from './types';

export async function register(input: {
  full_name: string;
  email: string;
  phone: string;
  password: string;
}) {
  const res = await apiRequest<{ token: string; user: User }>('/auth/register.php', {
    method: 'POST',
    body: { ...input, device_label: 'MAA Invest App' },
    auth: false,
  });
  await setToken(res.token);
  return res.user;
}

export async function login(identity: string, password: string) {
  const res = await apiRequest<{ token: string; user: User }>('/auth/login.php', {
    method: 'POST',
    body: { identity, password, device_label: 'MAA Invest App' },
    auth: false,
  });
  await setToken(res.token);
  return res.user;
}

export async function fetchMe() {
  const res = await apiRequest<{ user: User }>('/auth/me.php');
  return res.user;
}

export async function logout() {
  try {
    await apiRequest('/auth/logout.php', { method: 'POST' });
  } finally {
    await clearToken();
  }
}
