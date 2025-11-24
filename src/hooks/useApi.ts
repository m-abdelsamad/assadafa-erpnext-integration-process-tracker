// src/hooks/useApi.ts
import { useCallback, useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export type HttpMethod = 'GET' | 'POST';

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
}

interface ExecuteOptions<TBody> {
  body?: TBody;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

interface UseApiConfig {
  path: string;           // e.g. "/processes"
  method: HttpMethod;     // "GET" or "POST"
}

function buildUrl(path: string, query?: ExecuteOptions<unknown>['query']): string {
  if (!query || Object.keys(query).length === 0) {
    return path;
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }
    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: any = null;

    try {
      errorBody = await response.json();
    } catch {
      // ignore, maybe plain text
    }

    const apiError: ApiError = {
      statusCode: errorBody?.statusCode ?? response.status,
      error: errorBody?.error ?? response.statusText,
      message: errorBody?.message ?? 'An unexpected error occurred'
    };

    throw apiError;
  }

  if (response.status === 204) {
    // no content
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Generic hook for making API calls (GET/POST).
 * - You call `execute({ query, body })` whenever you need to.
 * - It returns the parsed JSON typed as TResponse.
 */
export function useApi<TResponse, TBody = unknown>(config: UseApiConfig) {
  const { path, method } = config;

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (options?: ExecuteOptions<TBody>): Promise<TResponse> => {
      const fullUrl = buildUrl(`${API_BASE_URL}${path}`, options?.query);

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(fullUrl, {
          method,
          headers:
            method === 'POST'
              ? { 'Content-Type': 'application/json' }
              : undefined,
          body:
            method === 'POST' && options?.body
              ? JSON.stringify(options.body)
              : undefined,
          signal: options?.signal
        });

        const result = await parseResponse<TResponse>(response);
        setData(result);
        return result;
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          // request was cancelled (optional handling)
          throw err;
        }

        const apiError: ApiError = (err as ApiError).statusCode
          ? (err as ApiError)
          : {
              statusCode: 0,
              error: 'Network Error',
              message:
                err instanceof Error ? err.message : 'Unknown network error'
            };

        setError(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [method, path]
  );

  return {
    data,
    loading,
    error,
    execute
  };
}
