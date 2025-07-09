import TextResources from '../TextResources';
import type { TextResourceFunction, TextResourceValue } from '../TextResources.types';

// Mock app config
jest.mock('@/app.config', () => ({
   allowedLanguages: ['en', 'es', 'fr'],
   defaultLanguage: 'en'
}));

describe('TextResources', () => {
   let textResources: TextResources;

   beforeEach(() => {
      textResources = new TextResources();
   });

   describe('Constructor', () => {
      it('should initialize with default configuration', () => {
         expect(textResources.languages).toEqual(['en', 'es', 'fr']);
         expect(textResources.defaultLanguage).toBe('en');
         expect(textResources.currentLanguage).toBe('en');
      });

      it('should initialize with custom languages', () => {
         const customLanguages = ['de', 'it'];
         const customTextResources = new TextResources(customLanguages, 'de');
         
         expect(customTextResources.languages).toEqual(['de', 'it']);
         expect(customTextResources.defaultLanguage).toBe('de');
         expect(customTextResources.currentLanguage).toBe('de');
      });

      it('should use first language as default when no default language provided', () => {
         const customLanguages = ['pt', 'ru'];
         const customTextResources = new TextResources(customLanguages, '');
         
         expect(customTextResources.defaultLanguage).toBe('pt');
         expect(customTextResources.currentLanguage).toBe('pt');
      });

      it('should initialize language maps for all languages', () => {
         const customLanguages = ['ja', 'ko'];
         const customTextResources = new TextResources(customLanguages, 'ja');
         
         expect(customTextResources.getLanguageSet('ja')).toBeInstanceOf(Map);
         expect(customTextResources.getLanguageSet('ko')).toBeInstanceOf(Map);
         expect(customTextResources.getLanguageSet('zh')).toBeUndefined();
      });
   });

   describe('Static Properties', () => {
      it('should have correct static properties', () => {
         expect(TextResources.allowedLanguages).toEqual(['en', 'es', 'fr']);
         expect(TextResources.defaultLanguage).toBe('en');
      });
   });

   describe('initLanguage', () => {
      it('should initialize a supported language', () => {
         const customTextResources = new TextResources(['en'], 'en');
         customTextResources.initLanguage('en');
         
         expect(customTextResources.getLanguageSet('en')).toBeInstanceOf(Map);
      });

      it('should throw error for unsupported language', () => {
         expect(() => {
            textResources.initLanguage('unsupported');
         }).toThrow('Language "unsupported" is not supported.');
      });

      it('should not throw error for already initialized language', () => {
         expect(() => {
            textResources.initLanguage('en');
         }).not.toThrow();
      });
   });

   describe('getLanguageSet', () => {
      it('should return language set for current language by default', () => {
         const languageSet = textResources.getLanguageSet();
         expect(languageSet).toBeInstanceOf(Map);
      });

      it('should return language set for specified language', () => {
         const esLanguageSet = textResources.getLanguageSet('es');
         expect(esLanguageSet).toBeInstanceOf(Map);
      });

      it('should return undefined for non-existent language', () => {
         const nonExistentSet = textResources.getLanguageSet('nonexistent');
         expect(nonExistentSet).toBeUndefined();
      });
   });

   describe('setLanguage', () => {
      it('should set a supported language', () => {
         textResources.setLanguage('es');
         expect(textResources.currentLanguage).toBe('es');
      });

      it('should warn and default to default language for unsupported language', () => {
         const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
         
         textResources.setLanguage('unsupported');
         expect(textResources.currentLanguage).toBe('en');
         expect(consoleSpy).toHaveBeenCalledWith('Language "unsupported" is not supported. Defaulting to "en".');
         
         consoleSpy.mockRestore();
      });

      it('should warn and default to default language when no language provided', () => {
         const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
         
         textResources.setLanguage();
         expect(textResources.currentLanguage).toBe('en');
         expect(consoleSpy).toHaveBeenCalledWith('Language "undefined" is not supported. Defaulting to "en".');
         
         consoleSpy.mockRestore();
      });

      it('should handle empty string language', () => {
         const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
         
         textResources.setLanguage('');
         expect(textResources.currentLanguage).toBe('en');
         expect(consoleSpy).toHaveBeenCalledWith('Language "" is not supported. Defaulting to "en".');
         
         consoleSpy.mockRestore();
      });
   });

   describe('create', () => {
      it('should create a text resource with string value', () => {
         textResources.create('test.key', 'Test Value');
         
         expect(textResources.getText('test.key')).toBe('Test Value');
      });

      it('should create a text resource with function value', () => {
         const testFunction: TextResourceFunction = (name: string) => `Hello, ${name}!`;
         textResources.create('test.greeting', testFunction);
         
         expect(textResources.getText('test.greeting', 'World')).toBe('Hello, World!');
      });

      it('should create a text resource in specified language', () => {
         textResources.create('test.key', 'Valor de Prueba', 'es');
         
         textResources.setLanguage('es');
         expect(textResources.getText('test.key')).toBe('Valor de Prueba');
      });

      it('should throw error for unsupported language', () => {
         expect(() => {
            textResources.create('test.key', 'Test Value', 'unsupported');
         }).toThrow('Language "unsupported" is not supported.');
      });

      it('should overwrite existing resource', () => {
         textResources.create('test.key', 'Original Value');
         textResources.create('test.key', 'New Value');
         
         expect(textResources.getText('test.key')).toBe('New Value');
      });
   });

   describe('getText', () => {
      it('should return text for current language', () => {
         textResources.create('test.key', 'English Text');
         expect(textResources.getText('test.key')).toBe('English Text');
      });

      it('should return text for current language when switched', () => {
         textResources.create('test.key', 'English Text', 'en');
         textResources.create('test.key', 'Texto en Español', 'es');
         
         textResources.setLanguage('es');
         expect(textResources.getText('test.key')).toBe('Texto en Español');
      });

      it('should return text from function resource', () => {
         const testFunction: TextResourceFunction = (name: string) => `Hello, ${name}!`;
         textResources.create('test.greeting', testFunction);
         
         expect(textResources.getText('test.greeting', 'Alice')).toBe('Hello, Alice!');
      });

      it('should return text from function resource with multiple parameters', () => {
         const testFunction: TextResourceFunction = (first: string, second: string) => `${first} and ${second}`;
         textResources.create('test.multiple', testFunction);
         
         expect(textResources.getText('test.multiple', 'John', 'Jane')).toBe('John and Jane');
      });

      it('should fall back to default language when resource not found in current language', () => {
         textResources.create('test.key', 'Default Text', 'en');
         textResources.setLanguage('es');
         
         expect(textResources.getText('test.key')).toBe('Default Text');
      });

      it('should return empty string and warn when resource not found', () => {
         const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
         
         const result = textResources.getText('nonexistent.key');
         expect(result).toBe('');
         expect(consoleSpy).toHaveBeenCalledWith('Resource with path "nonexistent.key" does not exist.');
         
         consoleSpy.mockRestore();
      });

      it('should handle function resources with no parameters', () => {
         const testFunction: TextResourceFunction = () => 'No params needed';
         textResources.create('test.noparams', testFunction);
         
         expect(textResources.getText('test.noparams')).toBe('No params needed');
      });

      it('should handle function resources with extra parameters', () => {
         const testFunction: TextResourceFunction = (name: string) => `Hello, ${name}!`;
         textResources.create('test.extra', testFunction);
         
         expect(textResources.getText('test.extra', 'Alice', 'Bob', 'Charlie')).toBe('Hello, Alice!');
      });
   });

   describe('merge', () => {
      it('should merge resources from another TextResources instance', () => {
         const otherResources = new TextResources(['en'], 'en');
         otherResources.create('merged.key', 'Merged Value');
         
         textResources.merge(otherResources);
         
         expect(textResources.getText('merged.key')).toBe('Merged Value');
      });

      it('should initialize new languages when merging', () => {
         const customTextResources = new TextResources(['en'], 'en');
         const otherResources = new TextResources(['en'], 'en');
         otherResources.create('merged.key', 'Merged Value', 'en');
         
         customTextResources.merge(otherResources);
         
         expect(customTextResources.getLanguageSet('en')).toBeInstanceOf(Map);
         expect(customTextResources.getText('merged.key')).toBe('Merged Value');
      });

      it('should overwrite existing resources', () => {
         textResources.create('test.key', 'Original');
         
         const otherResources = new TextResources(['en'], 'en');
         otherResources.create('test.key', 'Overwritten');
         
         textResources.merge(otherResources);
         
         expect(textResources.getText('test.key')).toBe('Overwritten');
      });

      it('should handle empty source resources', () => {
         const originalSize = textResources.getLanguageSet('en')!.size;
         const emptyResources = new TextResources(['en'], 'en');
         
         textResources.merge(emptyResources);
         
         expect(textResources.getLanguageSet('en')!.size).toBe(originalSize);
      });

      it('should handle function resources during merge', () => {
         const testFunction: TextResourceFunction = (name: string) => `Merged: ${name}`;
         const otherResources = new TextResources(['en'], 'en');
         otherResources.create('merged.function', testFunction);
         
         textResources.merge(otherResources);
         
         expect(textResources.getText('merged.function', 'Test')).toBe('Merged: Test');
      });

      it('should maintain language consistency after merge', () => {
         const otherResources = new TextResources(['en'], 'en');
         otherResources.create('test.key', 'English', 'en');
         
         textResources.merge(otherResources);
         
         expect(textResources.getText('test.key')).toBe('English');
      });
   });

   describe('currentLanguage getter', () => {
      it('should return current language', () => {
         expect(textResources.currentLanguage).toBe('en');
      });

      it('should reflect language changes', () => {
         textResources.setLanguage('es');
         expect(textResources.currentLanguage).toBe('es');
      });
   });

   describe('Complex scenarios', () => {
      it('should handle nested path-like keys', () => {
         textResources.create('user.profile.name', 'John Doe');
         textResources.create('user.profile.email', 'john@example.com');
         
         expect(textResources.getText('user.profile.name')).toBe('John Doe');
         expect(textResources.getText('user.profile.email')).toBe('john@example.com');
      });

      it('should handle multiple function parameters correctly', () => {
         const formatter: TextResourceFunction = (template: string, ...values: string[]) => {
            return template.replace(/{(\d+)}/g, (match, index) => values[index] || match);
         };
         textResources.create('formatter', formatter);
         
         expect(textResources.getText('formatter', 'Hello {0}, welcome to {1}!', 'Alice', 'Wonderland')).toBe('Hello Alice, welcome to Wonderland!');
      });

      it('should handle language switching with mixed resource types', () => {
         textResources.create('static.text', 'Static English');
         textResources.create('static.text', 'Texto Estático', 'es');
         
         const dynamicFunction: TextResourceFunction = (name: string) => `Dynamic: ${name}`;
         const dynamicFunctionEs: TextResourceFunction = (name: string) => `Dinámico: ${name}`;
         
         textResources.create('dynamic.text', dynamicFunction);
         textResources.create('dynamic.text', dynamicFunctionEs, 'es');
         
         expect(textResources.getText('static.text')).toBe('Static English');
         expect(textResources.getText('dynamic.text', 'Test')).toBe('Dynamic: Test');
         
         textResources.setLanguage('es');
         expect(textResources.getText('static.text')).toBe('Texto Estático');
         expect(textResources.getText('dynamic.text', 'Test')).toBe('Dinámico: Test');
      });

      it('should handle chain merging', () => {
         const source1 = new TextResources(['en'], 'en');
         source1.create('key1', 'Value 1');
         
         const source2 = new TextResources(['en'], 'en');
         source2.create('key2', 'Value 2');
         
         const result = textResources.merge(source1).merge(source2);
         
         expect(result).toBe(textResources);
         expect(textResources.getText('key1')).toBe('Value 1');
         expect(textResources.getText('key2')).toBe('Value 2');
      });
   });

   describe('Error handling', () => {
      it('should handle malformed function resources gracefully', () => {
         const malformedFunction = (() => {
            throw new Error('Malformed function');
         }) as TextResourceFunction;
         
         textResources.create('malformed', malformedFunction);
         
         expect(() => {
            textResources.getText('malformed');
         }).toThrow('Malformed function');
      });

      it('should handle null and undefined values gracefully', () => {
         const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
         
         // The implementation should handle null/undefined by treating them as falsy
         textResources.create('null', null as any, 'en');
         textResources.create('undefined', undefined as any, 'en');
         
         // Since the implementation doesn't have special handling for null/undefined,
         // it will try to set them as values, but getText will return empty string
         // because the resource won't be found (null/undefined are falsy in the resource check)
         expect(textResources.getText('null')).toBe('');
         expect(textResources.getText('undefined')).toBe('');
         
         consoleSpy.mockRestore();
      });

      it('should handle empty string keys', () => {
         textResources.create('', 'Empty key value');
         expect(textResources.getText('')).toBe('Empty key value');
      });
   });
});
