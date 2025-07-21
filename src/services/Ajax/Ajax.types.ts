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
   code?: string;
   statusText: string;
   headers: Record<string, unknown>;
   success: boolean;
   message?: string;
}

export interface AjaxResponseError {
   data: unknown;
   status: number;
   statusText: string;
   code?: string;
   headers: Record<string, unknown>;
   success: false;
   error: true;
   message?: string;
}
