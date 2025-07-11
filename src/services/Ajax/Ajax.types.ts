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

export interface AjaxResponse<T = any> {
   data: T;
   status: number;
   statusText: string;
   headers: any;
   success: boolean;
   error?: string;
}
