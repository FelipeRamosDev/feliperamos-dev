import { allowedLanguages } from "@/app.config";

export function parseAcceptLanguage(acceptLanguage: string | null): string | undefined {
   if (!acceptLanguage) return;

   // Parse Accept-Language header
   const languages = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase())
      .map(lang => lang.split('-')[0]); // Get base language (en from en)

   // Find first supported language
   for (const lang of languages) {
      if (allowedLanguages.includes(lang)) {
         return lang;
      }
   }

   return;
}
