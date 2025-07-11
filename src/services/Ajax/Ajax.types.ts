import type { AxiosRequestConfig } from 'axios';

export interface AjaxConfig {
   baseURL?: string;
   timeout?: number;
   headers?: Record<string, string>;
   withCredentials?: boolean;
}

export interface RequestOptions extends AxiosRequestConfig {
   retries?: number;
   retryDelay?: number;
}

export interface AjaxResponse<T = unknown> {
   data: T;
   status: number;
   statusText: string;
   headers: Record<string, unknown>;
   success: boolean;
   error?: string;
}
