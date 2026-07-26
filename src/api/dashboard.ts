import { apiRequest } from './client';
import { DashboardData } from './types';

export async function fetchDashboard() {
  return apiRequest<DashboardData>('/dashboard.php');
}
