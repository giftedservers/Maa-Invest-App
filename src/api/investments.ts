import { apiRequest } from './client';
import { InvestmentProduct, Holding } from './types';

export async function listProducts() {
  const res = await apiRequest<{ products: InvestmentProduct[]; plan: any }>('/investments/products.php');
  return res;
}

export async function listHoldings() {
  return apiRequest<{
    holdings: Holding[];
    portfolio_value: number;
    portfolio_invested: number;
    unrealized_return: number;
  }>('/investments/holdings.php');
}

export async function buyInvestment(product_id: number, amount: number) {
  return apiRequest('/investments/buy.php', { method: 'POST', body: { product_id, amount } });
}
