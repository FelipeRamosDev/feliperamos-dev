import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AjaxConfig, AjaxResponse, AjaxResponseError, RequestOptions } from './Ajax.types';

export default class Ajax {
   private client: AxiosInstance;
   private defaultRetries: number = 0;
   private defaultRetryDelay: number = 1000;

   constructor(config: AjaxConfig = {}) {
      this.client = axios.create({
         baseURL: config.baseURL || '',
         timeout: config.timeout || 10000,
         headers: {
            'Content-Type': 'application/json',
            ...config.headers
         },
         withCredentials: config.withCredentials || true
      });

      this.setupInterceptors();
   }

   private setupInterceptors(): void {
      // Request interceptor
      this.client.interceptors.request.use(
         (config) => {
            // Add any request preprocessing here
            console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
            return config;
         },
         (error) => {
            console.error('Request error:', error);
            return Promise.reject(error);
         }
      );

      // Response interceptor
      this.client.interceptors.response.use(
         (response: AxiosResponse) => {
            return response;
         },
         (error: AxiosError) => {
            console.error('Response error:', error.response?.status, error.message);
            return Promise.reject(error);
         }
      );
   }

   private async makeRequest<T = unknown>(
      config: AxiosRequestConfig,
      options: RequestOptions = {}
   ): Promise<AjaxResponse<T> | AjaxResponseError> {
      const { retries = this.defaultRetries, retryDelay = this.defaultRetryDelay, ...axiosConfig } = options;

      for (let attempt = 0; attempt <= retries; attempt++) {
         try {
            const response: AxiosResponse<T> = await this.client.request({
               ...config,
               ...axiosConfig
            });

            return {
               data: response.data,
               status: response.status,
               statusText: response.statusText,
               headers: response.headers,
               success: true
            };
         } catch (error) {
            if (attempt === retries) {
               const axiosError = error as AxiosError;
               const errorResponse = axiosError.response;
               const errorData = errorResponse?.data as AjaxResponseError;

               return {
                  data: errorData,
                  status: axiosError.response?.status || 0,
                  statusText: axiosError.response?.statusText || 'Network Error',
                  headers: axiosError.response?.headers || {},
                  success: false,
                  error: true,
                  code: errorData?.code || 'UNKNOWN_ERROR',
                  message: errorData?.message || 'Unknown error occurred'
               };
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
         }
      }

      // This should never be reached, but TypeScript needs it
      throw new Error('Unexpected error in request handling');
   }

   public async get<T = unknown>(url: string, options: RequestOptions = {}): Promise<AjaxResponse<T> | AjaxResponseError> {
      return this.makeRequest<T>({ method: 'GET', url }, options);
   }

   public async post<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<AjaxResponse<T> | AjaxResponseError> {
      return this.makeRequest<T>({ method: 'POST', url, data }, options);
   }

   public async put<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<AjaxResponse<T> | AjaxResponseError> {
      return this.makeRequest<T>({ method: 'PUT', url, data }, options);
   }

   public async patch<T = unknown>(url: string, data?: unknown, options: RequestOptions = {}): Promise<AjaxResponse<T> | AjaxResponseError> {
      return this.makeRequest<T>({ method: 'PATCH', url, data }, options);
   }

   public async delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<AjaxResponse<T> | AjaxResponseError> {
      return this.makeRequest<T>({ method: 'DELETE', url }, options);
   }

   public setAuthToken(token: string): void {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   }

   public removeAuthToken(): void {
      delete this.client.defaults.headers.common['Authorization'];
   }

   public setHeader(key: string, value: string): void {
      this.client.defaults.headers.common[key] = value;
   }

   public removeHeader(key: string): void {
      delete this.client.defaults.headers.common[key];
   }

   public setBaseURL(baseURL: string): void {
      this.client.defaults.baseURL = baseURL;
   }

   public setTimeout(timeout: number): void {
      this.client.defaults.timeout = timeout;
   }

   public getClient(): AxiosInstance {
      return this.client;
   }

   // Utility method for file uploads
   public async uploadFile<T = unknown>(
      url: string,
      file: File | Blob,
      fieldName: string = 'file',
      additionalData?: Record<string, string | Blob>,
      options: RequestOptions = {}
   ): Promise<AjaxResponse<T> | AjaxResponseError> {
      const formData = new FormData();
      formData.append(fieldName, file);

      if (additionalData) {
         Object.keys(additionalData).forEach(key => {
            const value = additionalData[key];
            if (typeof value === 'string' || value instanceof Blob) {
               formData.append(key, value);
            }
         });
      }

      return this.makeRequest<T>({
         method: 'POST',
         url,
         data: formData,
         headers: {
            'Content-Type': 'multipart/form-data'
         }
      }, options);
   }

   // Utility method for downloading files
   public async downloadFile(url: string, options: RequestOptions = {}): Promise<Blob> {
      const response = await this.makeRequest<Blob>({
         method: 'GET',
         url,
         responseType: 'blob'
      }, options);

      if (response.success) {
         return response.data;
      } else {
         throw new Error(response.message || 'Failed to download file');
      }
   }
}
