import { apiRequest } from './client';

export async function listNotifications() {
  return apiRequest<{ notifications: any[]; unread_count: number }>('/notifications/list.php');
}

export async function markNotificationsRead(notification_id?: number) {
  return apiRequest('/notifications/mark_read.php', { method: 'POST', body: { notification_id } });
}
