export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  kyc_status: string;
  status: string;
  xp: number;
  level: number;
  coins: number;
  current_streak: number;
  longest_streak: number;
  referral_code: string;
  created_at: string;
}

export interface Goal {
  id: number;
  name: string;
  target_amount: string | number;
  saved_amount: string | number;
  deadline: string | null;
  priority: 'low' | 'medium' | 'high';
  status: string;
  lock_type?: string;
  category_name?: string;
}

export interface Transaction {
  id: number;
  type: string;
  channel: string;
  amount: string | number;
  balance_after: string | number;
  description: string;
  created_at: string;
}

export interface InvestmentProduct {
  id: number;
  name: string;
  type: string;
  annual_return_rate: string | number;
  risk_level: 'low' | 'medium' | 'high';
  min_investment: string | number;
  is_premium: number | boolean;
  locked: boolean;
  description?: string;
}

export interface Holding {
  id: number;
  product_id: number;
  product_name: string;
  type: string;
  annual_return_rate: string | number;
  amount_invested: string | number;
  current_value: string | number;
  invested_at: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  target_amount?: string | number;
  saved_amount: string | number;
  invite_code?: string;
  my_role: string;
  member_count: number;
}

export interface DashboardData {
  user: User;
  wallet_balance: number;
  currency: string;
  total_saved: number;
  active_goals_count: number;
  investment_balance: number;
  xp_progress_pct: number;
  goals: Goal[];
  recent_transactions: Transaction[];
  badges: { name: string; description: string; icon: string; earned_at: string }[];
}
