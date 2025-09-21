import { CVData, LetterData } from '@/types/database.types';
import { defaultLanguage, languageLevels, languageLevelsPT } from '@/app.config';

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

export function cvPDFDownloadLink(cv?: CVData | null, locale: string = defaultLanguage): string {
   if (!cv) {
      throw new Error('CV data is required to generate the PDF link');
   }

   const cvId = cv.id;
   const userFullName = cv.user?.name?.replace(/ /g, '_');

   if (!cvId || !userFullName) {
      throw new Error('CV ID or user full name is missing');
   }

   return apiURL(`static/cv/${userFullName}-CV_${cvId}_${locale}.pdf`);
}

export function letterPDFDownloadLink(letter: LetterData, locale: string = defaultLanguage): string {
   return apiURL(`static/letter/${letter.from_name?.replace(/ /g, '_')}_cover_letter_${letter.id}_${locale}.pdf`);
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

   if (!userFullName || !cvId) {
      throw new Error('User full name or CV ID is missing');
   }

   a.href = link;
   a.download = `${userFullName}-${cvId}(${locale}).pdf`;

   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
}

export function displayProficiency(level: string, locale?: string): string {
   switch (locale) {
      case 'pt':
         const foundLevelPT = languageLevelsPT.find(lvl => lvl.value === level);
         return foundLevelPT ? foundLevelPT.label : 'Desconhecido';
      default:
         const foundLevel = languageLevels.find(lvl => lvl.value === level);
         return foundLevel ? foundLevel.label : 'Unknown';
   }
}
