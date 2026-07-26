import { apiRequest } from './client';
import { Group } from './types';

export async function listGroups() {
  const res = await apiRequest<{ groups: Group[] }>('/groups/list.php');
  return res.groups;
}

export async function createGroup(input: { name: string; target_amount?: number; description?: string }) {
  return apiRequest<{ group: Group }>('/groups/create.php', { method: 'POST', body: input });
}

export async function joinGroup(invite_code: string) {
  return apiRequest<{ group: Group }>('/groups/join.php', { method: 'POST', body: { invite_code } });
}

export async function contributeToGroup(group_id: number, amount: number) {
  return apiRequest<{ wallet_balance: number }>('/groups/contribute.php', {
    method: 'POST',
    body: { group_id, amount },
  });
}
