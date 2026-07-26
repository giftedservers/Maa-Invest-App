import * as SecureStore from 'expo-secure-store';

/**
 * Point this at your deployed MAA INVEST backend.
 * Matches invest.maawebhost.co.ke/api (see api/API_REFERENCE.md in the PHP repo).
 */
export const API_BASE_URL = 'https://invest.maawebhost.co.ke/api';

const TOKEN_KEY = 'maa_invest_token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  upgradeRequired: boolean;
  constructor(message: string, status: number, upgradeRequired = false) {
    super(message);
    this.status = status;
    this.upgradeRequired = upgradeRequired;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  auth?: boolean;
}

export async function apiRequest<T = any>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new ApiError('Could not reach the server. Check your connection.', 0);
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    throw new ApiError('Unexpected response from server.', res.status);
  }

  if (!res.ok || json.success === false) {
    throw new ApiError(json?.message || 'Something went wrong.', res.status, !!json?.upgrade_required);
  }

  return json as T;
}
