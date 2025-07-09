import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';
import { TextResourcesProvider, useTextResources } from '../TextResourcesProvider';
import TextResources from '../TextResources';
import type { TextResourcesProviderProps, TextResourcesContextValue } from '../TextResources.types';

// Mock app config
jest.mock('@/app.config', () => ({
   allowedLanguages: ['en', 'es', 'fr'],
   defaultLanguage: 'en'
}));

// Mock TextResources
jest.mock('../TextResources');

describe('TextResourcesProvider', () => {
   const MockedTextResources = TextResources as jest.MockedClass<typeof TextResources>;
   let mockTextResourcesInstance: jest.Mocked<TextResources>;

   beforeEach(() => {
      mockTextResourcesInstance = {
         getText: jest.fn(),
         setLanguage: jest.fn(),
         currentLanguage: 'en',
         create: jest.fn(),
         merge: jest.fn(),
         getLanguageSet: jest.fn(),
         initLanguage: jest.fn(),
         languages: ['en', 'es', 'fr'],
         defaultLanguage: 'en',
         _resources: {},
         _currentLanguage: 'en'
      } as any;

      MockedTextResources.mockImplementation(() => mockTextResourcesInstance);

      // Default mock implementations
      mockTextResourcesInstance.getText.mockReturnValue('mock text');
      mockTextResourcesInstance.getLanguageSet.mockReturnValue(new Map());
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('Provider Setup', () => {
      it('should render children with TextResources context', () => {
         const TestComponent = () => <div>Test Child</div>;
         
         render(
            <TextResourcesProvider>
               <TestComponent />
            </TextResourcesProvider>
         );

         expect(screen.getByText('Test Child')).toBeInTheDocument();
         expect(MockedTextResources).toHaveBeenCalledWith(['en', 'es', 'fr'], 'en');
      });

      it('should create TextResources instance with default configuration', () => {
         render(
            <TextResourcesProvider>
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(MockedTextResources).toHaveBeenCalledWith(['en', 'es', 'fr'], 'en');
         expect(MockedTextResources).toHaveBeenCalledTimes(1);
      });

      it('should create TextResources instance with custom configuration', () => {
         const customAllowedLanguages = ['en', 'de'];
         const customDefaultLanguage = 'de';

         render(
            <TextResourcesProvider 
               allowedLanguages={customAllowedLanguages} 
               defaultLanguage={customDefaultLanguage}
            >
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(MockedTextResources).toHaveBeenCalledWith(customAllowedLanguages, customDefaultLanguage);
      });

      it('should handle TextResources constructor errors gracefully', () => {
         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
         MockedTextResources.mockImplementation(() => {
            throw new Error('TextResources initialization failed');
         });

         expect(() => {
            render(
               <TextResourcesProvider>
                  <div>Test</div>
               </TextResourcesProvider>
            );
         }).toThrow('TextResources initialization failed');

         consoleErrorSpy.mockRestore();
      });
   });

   describe('Language Prop Handling', () => {
      it('should set language when language prop is provided', () => {
         render(
            <TextResourcesProvider language="es">
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.setLanguage).toHaveBeenCalledWith('es');
      });

      it('should update language when language prop changes', () => {
         const { rerender } = render(
            <TextResourcesProvider language="en">
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.setLanguage).toHaveBeenCalledWith('en');

         rerender(
            <TextResourcesProvider language="es">
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.setLanguage).toHaveBeenCalledWith('es');
         expect(mockTextResourcesInstance.setLanguage).toHaveBeenCalledTimes(2);
      });

      it('should not call setLanguage when language prop is undefined', () => {
         render(
            <TextResourcesProvider>
               <div>Test</div>
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.setLanguage).not.toHaveBeenCalled();
      });

      it('should handle setLanguage errors gracefully', () => {
         const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
         mockTextResourcesInstance.setLanguage.mockImplementation(() => {
            throw new Error('Invalid language');
         });

         expect(() => {
            render(
               <TextResourcesProvider language="invalid">
                  <div>Test</div>
               </TextResourcesProvider>
            );
         }).toThrow('Invalid language');

         consoleErrorSpy.mockRestore();
      });
   });

   describe('Merge Functionality', () => {
      it('should handle merge when initResources is provided', () => {
         const mockInitResources = {
            languages: ['en', 'es'],
            defaultLanguage: 'en'
         } as TextResources;

         const TestComponent = () => {
            const context = useTextResources(mockInitResources);
            return <div>Test</div>;
         };

         render(
            <TextResourcesProvider>
               <TestComponent />
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.merge).toHaveBeenCalledWith(mockInitResources);
      });

      it('should not call merge when initResources is not provided', () => {
         const TestComponent = () => {
            const context = useTextResources();
            return <div>Test</div>;
         };

         render(
            <TextResourcesProvider>
               <TestComponent />
            </TextResourcesProvider>
         );

         expect(mockTextResourcesInstance.merge).not.toHaveBeenCalled();
      });
   });
});

