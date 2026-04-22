import { API_BASE_URL } from '@/constants';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown>;
};

export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers, body, ...rest } = options;
  const finalHeaders = new Headers(headers);

  if (body) {
    finalHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : body,
    ...rest,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text);
}
