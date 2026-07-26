import { apiRequest } from './client';
import { Transaction } from './types';

export async function fetchWalletBalance() {
  const res = await apiRequest<{ wallet: { balance: string; currency: string; updated_at: string } }>(
    '/wallet/balance.php'
  );
  return res.wallet;
}

export async function fetchTransactions(page = 1) {
  return apiRequest<{
    transactions: Transaction[];
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }>(`/wallet/transactions.php?page=${page}`);
}

export async function deposit(amount: number, channel: 'mpesa' | 'bank' | 'card' = 'mpesa', phone?: string) {
  return apiRequest<{ status: string; reference: string; redirect_url?: string }>('/wallet/deposit.php', {
    method: 'POST',
    body: { amount, channel, phone },
  });
}

export async function withdraw(
  amount: number,
  channel: 'mpesa' | 'bank' = 'mpesa',
  extra?: { phone?: string; bank_account?: string; bank_code?: string }
) {
  return apiRequest<{ status: string; reference: string; wallet_balance: number }>('/wallet/withdraw.php', {
    method: 'POST',
    body: { amount, channel, ...extra },
  });
}
