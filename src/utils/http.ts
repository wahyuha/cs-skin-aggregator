import axios from 'axios';

export async function httpGet<T>(url: string, options?: {
  timeout?: number;
  headers?: Record<string, string>;
}): Promise<T> {
  const response = await axios.get<T>(url, {
    timeout: options?.timeout || 10000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      ...options?.headers,
    },
  });

  return response.data;
}

export function matchesSkinName(itemName: string, query: string): boolean {
  return itemName.startsWith(`${query} |`);
}

export function buildQueryParams(params: Record<string, string | number>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
}
