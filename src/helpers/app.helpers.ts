import { CVData } from '@/types/database.types';
import { defaultLanguage } from '@/app.config';

export function apiURL(path: string, queryParams?: Record<string, string>): string {
   const baseURL = process.env.NEXT_PUBLIC_SERVER_HOST;
   const port = process.env.NEXT_PUBLIC_SERVER_HTTP_PORT;

   if (!baseURL) {
      throw new Error('NEXT_PUBLIC_SERVER_HOST is not defined');
   }

   if (!port) {
      throw new Error('NEXT_PUBLIC_SERVER_HTTP_PORT is not defined');
   }

   const url = new URL(baseURL);
   url.pathname = path;
   url.port = port;

   if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
         url.searchParams.append(key, value);
      });
   }

   return url.toString();
}

export function cvPDFDownloadLink(cv: CVData, locale: string = defaultLanguage): string {
   const cvId = cv.id;
   const userFullName = cv.user?.name?.replace(/ /g, '_');

   if (!cvId || !userFullName) {
      throw new Error('CV ID or user full name is missing');
   }

   return apiURL(`/cv/${userFullName}-CV_${cvId}_${locale}.pdf`);
}

export function downloadCVPDF(cv: CVData, locale: string): void {
   if (typeof window === 'undefined') {
      return;
   }

   if (!cv) {
      throw new Error('CV data is required to download the PDF');
   }

   const link = cvPDFDownloadLink(cv, locale);
   const a = document.createElement('a');
   const userFullName = cv.user?.name;
   const cvId = cv.id;

   a.href = link;
   a.download = `${userFullName}-${cvId}(${locale}).pdf`;

   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
}
