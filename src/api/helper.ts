import { API_BASE_URL } from '@/constants';

class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`HTTP ${status}`);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function request<T = unknown>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { headers, body, signal, ...rest } = options;

  const finalHeaders = new Headers(headers);
  let reqBody = body;

  if (body && !(body instanceof FormData)) {
    finalHeaders.set('Content-Type', 'application/json');
    reqBody = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: finalHeaders,
    body: reqBody as BodyInit,
    signal,
    ...rest,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}
