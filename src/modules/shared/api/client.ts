const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL;
const DEFAULT_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

export type ApiClientConfig = {
  baseURL?: string;
  headers?: HeadersInit;
  timeout?: number;
};

export class ApiError extends Error {
  status: number;
  statusText: string;
  data?: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    super(`${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

/**
 * Основная функция для запросов
 * @param endpoint - относительный путь
 * @param options - параметры запроса: метод, тело, заголовки, params, сигнал
 * @param config - глобальная конфигурация клиента (baseURL, общие заголовки)
 */
export async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: any;
    headers?: HeadersInit;
    params?: Record<string, any>;
    signal?: AbortSignal;
  } = {},
  config: ApiClientConfig = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, params, signal } = options;

  const baseURL = config.baseURL ?? DEFAULT_BASE_URL;
  const defaultHeaders = { ...DEFAULT_HEADERS, ...(config.headers ?? {}) };
  const mergedHeaders = { ...defaultHeaders, ...headers };

  const url = new URL(`${baseURL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const fetchOptions: RequestInit = {
    method,
    headers: mergedHeaders,
    signal,
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    fetchOptions.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(url.toString(), fetchOptions);
  } catch (err) {
    const error = err as Error;
    throw new Error(`Network error: ${error.message}`);
  }

  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch (e) {}
  } else {
    responseData = await response.text();
  }

  // Cтатус не 2xx
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText, responseData);
  }

  return responseData as T;
}
