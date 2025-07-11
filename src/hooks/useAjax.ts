import { Ajax, AjaxConfig } from '@/services/Ajax';

const baseURL = new URL(process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost');
baseURL.port = process.env.NEXT_PUBLIC_SERVER_HTTP_PORT || '8000';

const ajax = new Ajax({
   baseURL: baseURL.toString(),
   withCredentials: true
});

export function useAjax(configs?: AjaxConfig) {
   const url = new URL(process.env.NEXT_PUBLIC_SERVER_HOST || 'http://localhost');
   url.port = process.env.NEXT_PUBLIC_SERVER_HTTP_PORT || '8000';

   return new Ajax({
      baseURL: url.toString(),
      withCredentials: true,
      ...configs
   });
}

export default ajax;
