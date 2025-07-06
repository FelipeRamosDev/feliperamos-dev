import type { TextResourcesMap, TextResourceValue } from './TextResources.types';

export default class TextResources {
   public languages: string[];
   public defaultLanguage: string;

   private _resources: TextResourcesMap;
   private _currentLanguage: string;

   static allowedLanguages: string[] = ['en-US'];
   static defaultLanguage: string | undefined;

   constructor (languages: string[] = TextResources.allowedLanguages, defaultLanguage?: string) {
      this._resources = {};
      
      this.languages = languages;
      this.defaultLanguage = defaultLanguage || languages[0];
      this._currentLanguage = this.defaultLanguage;

      languages.forEach(language => {
         this.initLanguage(language)
      });
   }

   initLanguage(language: string) {
      if (!this.languages.includes(language)) {
         throw new Error(`Language "${language}" is not supported.`);
      }

      this._resources[language] = new Map();
   }

   getLanguageSet(language: string = this._currentLanguage): Map<string, TextResourceValue> | undefined {
      if (!this._resources[language]) {
         return;
      }

      return this._resources[language];
   }

   setLanguage(language?: string): void {
      if (!language || !this.languages.includes(language)) {
         console.warn(`Language "${language}" is not supported. Defaulting to "${this.defaultLanguage}".`);
         language = this.defaultLanguage;
      }

      this._currentLanguage = language;
   }

   create(path: string, value: TextResourceValue, language: string = this.defaultLanguage): void {
      if (!this._resources[language]) {
         throw new Error(`Language "${language}" is not supported.`);
      }

      this._resources[language].set(path, value);
   }

   getText(path: string, ...params: string[]): string {
      const resourceDefault = this._resources[this.defaultLanguage].get(path);
      const resource = this._resources[this._currentLanguage].get(path) || resourceDefault;

      if (!resource) {
         console.warn(`Resource with path "${path}" does not exist.`);
         return '';
      }

      if (typeof resource === 'function') {
         return resource(...params);
      }

      return resource;
   }

   merge(resourcesToMerge: TextResources): TextResources {
      resourcesToMerge.languages.forEach(language => {
         const languageSet = this.getLanguageSet(language);

         if (!languageSet) {
            this.initLanguage(language);
         }

         const langSet = resourcesToMerge.getLanguageSet(language);
         langSet?.forEach((value, key) => {
            this.create(key, value, language);
         });
      });

      return this;
   }
}
