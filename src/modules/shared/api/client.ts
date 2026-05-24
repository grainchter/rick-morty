const DEFAULT_BASE_URL = import.meta.env.VITE_API_URL;

export type ApiClientConfig = {
  baseURL?: string;
  headers?: HeadersInit;
};

export class ApiError extends Error {
  response: Response;
  data?: unknown;

  constructor(response: Response, data?: unknown) {
    super(`${response.status} ${response.statusText}`);
    this.name = 'ApiError';
    this.response = response;
    this.data = data;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: Record<string, unknown> | unknown[] | string | number | boolean | null;
    headers?: HeadersInit;
    params?: Record<string, unknown>;
    signal?: AbortSignal;
  } = {},
  config: ApiClientConfig = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, params, signal } = options;
  const baseURL = config.baseURL ?? DEFAULT_BASE_URL;

  const finalHeaders: Record<string, string> = {};

  if (config.headers) {
    if (Array.isArray(config.headers)) {
      for (const [key, value] of config.headers) {
        finalHeaders[key] = value;
      }
    } else {
      Object.assign(finalHeaders, config.headers);
    }
  }

  if (headers) {
    if (Array.isArray(headers)) {
      for (const [key, value] of headers) {
        finalHeaders[key] = value;
      }
    } else {
      Object.assign(finalHeaders, headers);
    }
  }

  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  if (body && methodsWithBody.includes(method)) {
    finalHeaders['Content-Type'] = 'application/json';
  }

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
    headers: finalHeaders,
    signal,
  };

  if (body && methodsWithBody.includes(method)) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response: Response = await fetch(url.toString(), fetchOptions);

  let responseData: unknown = null;
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = await response.text();
    }
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(response, responseData);
  }

  return responseData as T;
}
