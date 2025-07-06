interface TextResourcesMap {
   [key: string]: Map<string, string | Function>;
}

export default class TextResources {
   public languages: string[];
   public defaultLanguage: string;

   private _resources: TextResourcesMap;
   private _currentLanguage: string;

   constructor (languages: string[] = ['en-US']) {
      this._resources = {};
      
      this.languages = languages;
      this.defaultLanguage = languages[0];
      this._currentLanguage = this.defaultLanguage;

      languages.forEach(language => {
         this._resources[language] = new Map();
      });
   }

   setLanguage(language?: string): void {
      if (!language || !this.languages.includes(language)) {
         console.warn(`Language "${language}" is not supported. Defaulting to "${this.defaultLanguage}".`);
         language = this.defaultLanguage;
      }

      this._currentLanguage = language;
   }

   create(path: string, value: string | Function, language: string = this.defaultLanguage): void {
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
}
