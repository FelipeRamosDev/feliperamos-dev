import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CVPDFTemplate from './CVPDFTemplate';

// Mock PageBase component
jest.mock('../PageBase/PageBase', () => {
   return function MockPageBase({ children, language, fullwidth, hideFooter, hideHeader, ...props }: any) {
      return (
         <div 
            data-testid="page-base"
            data-language={language}
            data-fullwidth={fullwidth}
            data-hide-footer={hideFooter}
            data-hide-header={hideHeader}
            {...props}
         >
            {children}
         </div>
      );
   };
});

describe('CVPDFTemplate', () => {
   const mockChildren = <div data-testid="test-content">Test Content</div>;

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         )).not.toThrow();
      });

      test('renders children content', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('test-content')).toBeInTheDocument();
         expect(screen.getByText('Test Content')).toBeInTheDocument();
      });

      test('renders PageBase with correct props', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toBeInTheDocument();
         expect(pageBase).toHaveAttribute('data-language', 'en');
         expect(pageBase).toHaveAttribute('data-fullwidth', 'true');
         expect(pageBase).toHaveAttribute('data-hide-footer', 'true');
         expect(pageBase).toHaveAttribute('data-hide-header', 'true');
      });
   });

   describe('Language Prop Handling', () => {
      test('passes language prop to PageBase', () => {
         render(
            <CVPDFTemplate language="es">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-language', 'es');
      });

      test('handles different language codes', () => {
         const languages = ['en', 'es', 'fr', 'de', 'pt'];
         
         languages.forEach(lang => {
            const { unmount } = render(
               <CVPDFTemplate language={lang}>
                  {mockChildren}
               </CVPDFTemplate>
            );
            
            const pageBase = screen.getByTestId('page-base');
            expect(pageBase).toHaveAttribute('data-language', lang);
            
            unmount();
         });
      });

      test('handles undefined language', () => {
         render(
            <CVPDFTemplate language={undefined as any}>
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-language', 'undefined');
      });
   });

   describe('Children Handling', () => {
      test('renders single child component', () => {
         render(
            <CVPDFTemplate language="en">
               <div data-testid="single-child">Single Child</div>
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('single-child')).toBeInTheDocument();
         expect(screen.getByText('Single Child')).toBeInTheDocument();
      });

      test('renders multiple child components', () => {
         render(
            <CVPDFTemplate language="en">
               <div data-testid="child-1">Child 1</div>
               <div data-testid="child-2">Child 2</div>
               <div data-testid="child-3">Child 3</div>
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('child-1')).toBeInTheDocument();
         expect(screen.getByTestId('child-2')).toBeInTheDocument();
         expect(screen.getByTestId('child-3')).toBeInTheDocument();
      });

      test('renders complex child structure', () => {
         render(
            <CVPDFTemplate language="en">
               <section data-testid="cv-section">
                  <h1>CV Title</h1>
                  <article>
                     <h2>Experience</h2>
                     <p>Job description</p>
                  </article>
               </section>
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('cv-section')).toBeInTheDocument();
         expect(screen.getByText('CV Title')).toBeInTheDocument();
         expect(screen.getByText('Experience')).toBeInTheDocument();
         expect(screen.getByText('Job description')).toBeInTheDocument();
      });

      test('handles empty children', () => {
         render(
            <CVPDFTemplate language="en">
               {null}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toBeInTheDocument();
      });

      test('handles children as string', () => {
         render(
            <CVPDFTemplate language="en">
               Simple text content
            </CVPDFTemplate>
         );
         
         expect(screen.getByText('Simple text content')).toBeInTheDocument();
      });
   });

   describe('PageBase Configuration', () => {
      test('always sets fullwidth to true', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-fullwidth', 'true');
      });

      test('always sets hideFooter to true', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-hide-footer', 'true');
      });

      test('always sets hideHeader to true', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-hide-header', 'true');
      });

      test('maintains consistent configuration across re-renders', () => {
         const { rerender } = render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toHaveAttribute('data-fullwidth', 'true');
         expect(pageBase).toHaveAttribute('data-hide-footer', 'true');
         expect(pageBase).toHaveAttribute('data-hide-header', 'true');
         
         rerender(
            <CVPDFTemplate language="es">
               <div>New Content</div>
            </CVPDFTemplate>
         );
         
         const updatedPageBase = screen.getByTestId('page-base');
         expect(updatedPageBase).toHaveAttribute('data-fullwidth', 'true');
         expect(updatedPageBase).toHaveAttribute('data-hide-footer', 'true');
         expect(updatedPageBase).toHaveAttribute('data-hide-header', 'true');
      });
   });

   describe('Component Structure', () => {
      test('has correct component hierarchy', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         const testContent = screen.getByTestId('test-content');
         
         expect(pageBase).toContainElement(testContent);
      });

      test('is a wrapper around PageBase', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         // Should have only one PageBase element
         expect(screen.getAllByTestId('page-base')).toHaveLength(1);
      });
   });

   describe('PDF Template Specific Behavior', () => {
      test('provides PDF-optimized layout configuration', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         
         // PDF templates should be fullwidth without headers/footers
         expect(pageBase).toHaveAttribute('data-fullwidth', 'true');
         expect(pageBase).toHaveAttribute('data-hide-header', 'true');
         expect(pageBase).toHaveAttribute('data-hide-footer', 'true');
      });

      test('maintains clean layout for PDF generation', () => {
         render(
            <CVPDFTemplate language="en">
               <div data-testid="pdf-content">
                  <header>CV Header</header>
                  <main>CV Main Content</main>
                  <footer>CV Footer</footer>
               </div>
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         const pdfContent = screen.getByTestId('pdf-content');
         
         expect(pageBase).toContainElement(pdfContent);
         
         // Should hide page headers/footers but allow content headers/footers
         expect(screen.getByText('CV Header')).toBeInTheDocument();
         expect(screen.getByText('CV Main Content')).toBeInTheDocument();
         expect(screen.getByText('CV Footer')).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently', () => {
         const { rerender } = render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('page-base')).toBeInTheDocument();
         
         rerender(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('page-base')).toBeInTheDocument();
      });

      test('handles rapid prop changes', () => {
         const { rerender } = render(
            <CVPDFTemplate language="en">
               <div>Original Content</div>
            </CVPDFTemplate>
         );
         
         expect(screen.getByText('Original Content')).toBeInTheDocument();
         
         rerender(
            <CVPDFTemplate language="es">
               <div>Updated Content</div>
            </CVPDFTemplate>
         );
         
         expect(screen.getByText('Updated Content')).toBeInTheDocument();
         expect(screen.queryByText('Original Content')).not.toBeInTheDocument();
      });
   });

   describe('Error Handling', () => {
      test('handles null children gracefully', () => {
         expect(() => render(
            <CVPDFTemplate language="en">
               {null}
            </CVPDFTemplate>
         )).not.toThrow();
      });

      test('handles undefined children gracefully', () => {
         expect(() => render(
            <CVPDFTemplate language="en">
               {undefined}
            </CVPDFTemplate>
         )).not.toThrow();
      });

      test('handles invalid language prop', () => {
         expect(() => render(
            <CVPDFTemplate language={123 as any}>
               {mockChildren}
            </CVPDFTemplate>
         )).not.toThrow();
      });

      test('handles missing required props', () => {
         expect(() => render(
            <CVPDFTemplate>
               {mockChildren}
            </CVPDFTemplate>
         )).not.toThrow();
      });
   });

   describe('TypeScript Type Safety', () => {
      test('accepts PageBaseProps interface', () => {
         // This test ensures the component accepts the correct prop types
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         expect(screen.getByTestId('page-base')).toBeInTheDocument();
      });

      test('returns React element', () => {
         const result = CVPDFTemplate({ 
            language: 'en', 
            children: mockChildren 
         });
         
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
      });
   });

   describe('Integration', () => {
      test('integrates properly with PageBase component', () => {
         render(
            <CVPDFTemplate language="en">
               {mockChildren}
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         expect(pageBase).toBeInTheDocument();
         expect(pageBase).toHaveAttribute('data-language', 'en');
      });

      test('preserves PageBase functionality', () => {
         render(
            <CVPDFTemplate language="pt">
               <div data-testid="cv-content">CV Content</div>
            </CVPDFTemplate>
         );
         
         const pageBase = screen.getByTestId('page-base');
         const content = screen.getByTestId('cv-content');
         
         expect(pageBase).toContainElement(content);
         expect(pageBase).toHaveAttribute('data-language', 'pt');
      });
   });
});
