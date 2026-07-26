import { apiRequest } from './client';
import { User } from './types';

export async function getProfile() {
  return apiRequest<{ user: User; badges: any[] }>('/profile/get.php');
}

export async function updateProfile(input: { full_name?: string; email?: string }) {
  return apiRequest<{ user: User }>('/profile/update.php', { method: 'POST', body: input });
}

export async function changePassword(current_password: string, new_password: string) {
  return apiRequest('/profile/change_password.php', {
    method: 'POST',
    body: { current_password, new_password },
  });
}
