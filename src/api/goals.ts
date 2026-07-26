import { apiRequest } from './client';
import { Goal } from './types';

export async function listGoals() {
  const res = await apiRequest<{ goals: Goal[] }>('/goals/list.php');
  return res.goals;
}

export async function createGoal(input: {
  name: string;
  target_amount: number;
  deadline?: string;
  priority?: 'low' | 'medium' | 'high';
  lock_type?: 'flexible' | 'locked';
  notes?: string;
}) {
  const res = await apiRequest<{ goal: Goal }>('/goals/create.php', { method: 'POST', body: input });
  return res.goal;
}

export async function fundGoal(goal_id: number, amount: number) {
  return apiRequest<{ goal: Goal; goal_completed: boolean; wallet_balance: number }>('/goals/fund.php', {
    method: 'POST',
    body: { goal_id, amount },
  });
}
