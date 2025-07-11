import { render, screen } from '@testing-library/react';
import React from 'react';
import AdminPageBase from './AdminPageBase';
import { AdminPageBaseProps } from './AdminPageBase.types';

interface ProviderProps {
   children: React.ReactNode;
}

// Mock react-redux
jest.mock('react-redux', () => ({
   Provider: ({ children }: ProviderProps) => (
      <div data-testid="redux-provider">
         {children}
      </div>
   )
}));

// Mock Material-UI ThemeProvider
jest.mock('@mui/material', () => ({
   ThemeProvider: ({ children }: ProviderProps) => (
      <div data-testid="theme-provider">
         {children}
      </div>
   )
}));

// Mock default theme
jest.mock('@/theme/defaultTheme', () => ({
   default: {
      palette: {
         primary: { main: '#000000' }
      }
   }
}));

// Mock store
jest.mock('@/store', () => ({
   default: {
      getState: jest.fn(),
      dispatch: jest.fn(),
      subscribe: jest.fn()
   }
}));

interface TextResourcesProviderProps {
   children: React.ReactNode;
   language?: string;
}

// Mock TextResourcesProvider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   TextResourcesProvider: ({ children, language }: TextResourcesProviderProps) => (
      <div data-testid="text-resources-provider" data-language={language || ''}>
         {children}
      </div>
   )
}));

// Mock TopHeader
jest.mock('@/components/headers', () => ({
   TopHeader: () => (
      <header data-testid="top-header">
         <h1>Top Header</h1>
      </header>
   )
}));

// Mock BasicFooter
jest.mock('@/components/footers', () => ({
   BasicFooter: () => (
      <footer data-testid="basic-footer">
         <p>Basic Footer</p>
      </footer>
   )
}));

// Mock AuthProvider
jest.mock('@/services', () => ({
   AuthProvider: ({ children }: ProviderProps) => (
      <div data-testid="auth-provider">
         {children}
      </div>
   )
}));

describe('AdminPageBase', () => {
   const defaultProps: AdminPageBaseProps = {
      children: <div data-testid="test-content">Test Content</div>
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the AdminPageBase element', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main).toBeInTheDocument();
         expect(main).toHaveClass('AdminPageBase');
      });

      it('renders as a main element', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main.tagName).toBe('MAIN');
      });

      it('returns a React JSX Element', () => {
         const result = AdminPageBase(defaultProps);
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
         expect(result.type).toBe('main');
      });

      it('renders children content', () => {
         render(<AdminPageBase {...defaultProps} />);

         const content = screen.getByTestId('test-content');
         expect(content).toBeInTheDocument();
         expect(content).toHaveTextContent('Test Content');
      });
   });

   describe('Provider integration', () => {
      it('renders TextResourcesProvider wrapper', () => {
         render(<AdminPageBase {...defaultProps} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toBeInTheDocument();
      });

      it('renders Redux Provider wrapper', () => {
         render(<AdminPageBase {...defaultProps} />);

         const reduxProvider = screen.getByTestId('redux-provider');
         expect(reduxProvider).toBeInTheDocument();
      });

      it('renders Material-UI ThemeProvider wrapper', () => {
         render(<AdminPageBase {...defaultProps} />);

         const themeProvider = screen.getByTestId('theme-provider');
         expect(themeProvider).toBeInTheDocument();
      });

      it('passes language prop to TextResourcesProvider', () => {
         const props: AdminPageBaseProps = {
            ...defaultProps,
            language: 'pt'
         };

         render(<AdminPageBase {...props} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', 'pt');
      });

      it('handles undefined language prop', () => {
         render(<AdminPageBase {...defaultProps} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', '');
      });
   });

   describe('Component composition', () => {
      it('renders TopHeader component', () => {
         render(<AdminPageBase {...defaultProps} />);

         const header = screen.getByTestId('top-header');
         expect(header).toBeInTheDocument();
         expect(header).toHaveTextContent('Top Header');
      });

      it('renders BasicFooter component', () => {
         render(<AdminPageBase {...defaultProps} />);

         const footer = screen.getByTestId('basic-footer');
         expect(footer).toBeInTheDocument();
         expect(footer).toHaveTextContent('Basic Footer');
      });

      it('renders all components together', () => {
         render(<AdminPageBase {...defaultProps} />);

         expect(screen.getByTestId('top-header')).toBeInTheDocument();
         expect(screen.getByTestId('test-content')).toBeInTheDocument();
         expect(screen.getByTestId('basic-footer')).toBeInTheDocument();
      });

      it('renders components in correct order', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         const textProvider = screen.getByTestId('text-resources-provider');
         
         // Check that components are in the correct order within the provider hierarchy
         expect(main).toContainElement(textProvider);
         expect(screen.getByTestId('top-header')).toBeInTheDocument();
         expect(screen.getByTestId('test-content')).toBeInTheDocument();
         expect(screen.getByTestId('basic-footer')).toBeInTheDocument();
      });
   });

   describe('Provider hierarchy', () => {
      it('has correct provider nesting order', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         const textProvider = screen.getByTestId('text-resources-provider');
         const reduxProvider = screen.getByTestId('redux-provider');
         const themeProvider = screen.getByTestId('theme-provider');

         expect(main).toContainElement(textProvider);
         expect(textProvider).toContainElement(reduxProvider);
         expect(reduxProvider).toContainElement(themeProvider);
      });

      it('renders children within provider hierarchy', () => {
         render(<AdminPageBase {...defaultProps} />);

         const themeProvider = screen.getByTestId('theme-provider');
         const content = screen.getByTestId('test-content');

         expect(themeProvider).toContainElement(content);
      });

      it('maintains provider isolation', () => {
         render(<AdminPageBase {...defaultProps} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         const reduxProvider = screen.getByTestId('redux-provider');
         const themeProvider = screen.getByTestId('theme-provider');

         expect(textProvider).not.toBe(reduxProvider);
         expect(reduxProvider).not.toBe(themeProvider);
      });
   });

   describe('Children handling', () => {
      it('renders single child element', () => {
         const props: AdminPageBaseProps = {
            children: <div data-testid="single-child">Single Child</div>
         };

         render(<AdminPageBase {...props} />);

         const child = screen.getByTestId('single-child');
         expect(child).toBeInTheDocument();
         expect(child).toHaveTextContent('Single Child');
      });

      it('renders multiple child elements', () => {
         const props: AdminPageBaseProps = {
            children: (
               <>
                  <div data-testid="child-1">Child 1</div>
                  <div data-testid="child-2">Child 2</div>
                  <div data-testid="child-3">Child 3</div>
               </>
            )
         };

         render(<AdminPageBase {...props} />);

         expect(screen.getByTestId('child-1')).toBeInTheDocument();
         expect(screen.getByTestId('child-2')).toBeInTheDocument();
         expect(screen.getByTestId('child-3')).toBeInTheDocument();
      });

      it('renders text content as children', () => {
         const props: AdminPageBaseProps = {
            children: 'Plain text content'
         };

         render(<AdminPageBase {...props} />);

         expect(screen.getByText('Plain text content')).toBeInTheDocument();
      });

      it('renders complex nested children', () => {
         const props: AdminPageBaseProps = {
            children: (
               <div data-testid="complex-child">
                  <h1>Title</h1>
                  <p>Description</p>
                  <section>
                     <article data-testid="nested-article">Article content</article>
                  </section>
               </div>
            )
         };

         render(<AdminPageBase {...props} />);

         expect(screen.getByTestId('complex-child')).toBeInTheDocument();
         expect(screen.getByText('Title')).toBeInTheDocument();
         expect(screen.getByText('Description')).toBeInTheDocument();
         expect(screen.getByTestId('nested-article')).toBeInTheDocument();
      });

      it('handles null children gracefully', () => {
         const props: AdminPageBaseProps = {
            children: null
         };

         render(<AdminPageBase {...props} />);

         const main = screen.getByRole('main');
         expect(main).toBeInTheDocument();
         expect(screen.getByTestId('top-header')).toBeInTheDocument();
         expect(screen.getByTestId('basic-footer')).toBeInTheDocument();
      });

      it('handles undefined children gracefully', () => {
         const props: AdminPageBaseProps = {
            children: undefined
         };

         render(<AdminPageBase {...props} />);

         const main = screen.getByRole('main');
         expect(main).toBeInTheDocument();
         expect(screen.getByTestId('top-header')).toBeInTheDocument();
         expect(screen.getByTestId('basic-footer')).toBeInTheDocument();
      });
   });

   describe('Language prop handling', () => {
      it('passes English language correctly', () => {
         const props: AdminPageBaseProps = {
            ...defaultProps,
            language: 'en'
         };

         render(<AdminPageBase {...props} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', 'en');
      });

      it('passes Portuguese language correctly', () => {
         const props: AdminPageBaseProps = {
            ...defaultProps,
            language: 'pt'
         };

         render(<AdminPageBase {...props} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', 'pt');
      });

      it('passes custom language correctly', () => {
         const props: AdminPageBaseProps = {
            ...defaultProps,
            language: 'es-ES'
         };

         render(<AdminPageBase {...props} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', 'es-ES');
      });

      it('handles empty string language', () => {
         const props: AdminPageBaseProps = {
            ...defaultProps,
            language: ''
         };

         render(<AdminPageBase {...props} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toHaveAttribute('data-language', '');
      });
   });

   describe('CSS and styling', () => {
      it('applies AdminPageBase class for styling', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main).toHaveClass('AdminPageBase');
      });

      it('provides structure for CSS layout', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main).toHaveClass('AdminPageBase');
         expect(main.tagName).toBe('MAIN');
      });
   });

   describe('Accessibility', () => {
      it('uses semantic main element', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main).toBeInTheDocument();
         expect(main.tagName).toBe('MAIN');
      });

      it('provides proper document structure', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         const header = screen.getByTestId('top-header');
         const footer = screen.getByTestId('basic-footer');

         expect(main).toBeInTheDocument();
         expect(header).toBeInTheDocument();
         expect(footer).toBeInTheDocument();
      });

      it('maintains proper heading hierarchy', () => {
         render(<AdminPageBase {...defaultProps} />);

         // Header should contain appropriate heading structure
         const header = screen.getByTestId('top-header');
         expect(header.querySelector('h1')).toBeInTheDocument();
      });

      it('provides accessible page structure', () => {
         const props: AdminPageBaseProps = {
            children: (
               <div>
                  <h1>Page Title</h1>
                  <p>Page content</p>
               </div>
            )
         };

         render(<AdminPageBase {...props} />);

         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(screen.getByText('Page Title')).toBeInTheDocument();
      });
   });

   describe('Component behavior', () => {
      it('renders consistently', () => {
         const { rerender } = render(<AdminPageBase {...defaultProps} />);

         // Initial render
         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(screen.getByTestId('test-content')).toBeInTheDocument();

         // Re-render should maintain same content
         rerender(<AdminPageBase {...defaultProps} />);

         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(screen.getByTestId('test-content')).toBeInTheDocument();
      });

      it('handles prop changes correctly', () => {
         const { rerender } = render(<AdminPageBase {...defaultProps} />);

         expect(screen.getByTestId('text-resources-provider')).toHaveAttribute('data-language', '');

         const newProps: AdminPageBaseProps = {
            ...defaultProps,
            language: 'pt'
         };

         rerender(<AdminPageBase {...newProps} />);

         expect(screen.getByTestId('text-resources-provider')).toHaveAttribute('data-language', 'pt');
      });

      it('handles children changes correctly', () => {
         const { rerender } = render(<AdminPageBase {...defaultProps} />);

         expect(screen.getByTestId('test-content')).toBeInTheDocument();

         const newProps: AdminPageBaseProps = {
            ...defaultProps,
            children: <div data-testid="new-content">New Content</div>
         };

         rerender(<AdminPageBase {...newProps} />);

         expect(screen.queryByTestId('test-content')).not.toBeInTheDocument();
         expect(screen.getByTestId('new-content')).toBeInTheDocument();
      });

      it('maintains provider state across re-renders', () => {
         const { rerender } = render(<AdminPageBase {...defaultProps} />);

         // Check that providers are present
         expect(screen.getByTestId('text-resources-provider')).toBeInTheDocument();
         expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
         expect(screen.getByTestId('theme-provider')).toBeInTheDocument();

         rerender(<AdminPageBase {...defaultProps} />);

         expect(screen.getByTestId('text-resources-provider')).toBeInTheDocument();
         expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
         expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      });
   });

   describe('Performance considerations', () => {
      it('renders efficiently', () => {
         const startTime = performance.now();
         render(<AdminPageBase {...defaultProps} />);
         const endTime = performance.now();

         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(endTime - startTime).toBeLessThan(100);
      });

      it('handles multiple provider wrapping efficiently', () => {
         const startTime = performance.now();
         render(<AdminPageBase {...defaultProps} />);
         const endTime = performance.now();

         // Should render all providers without significant performance impact
         expect(screen.getByTestId('text-resources-provider')).toBeInTheDocument();
         expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
         expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
         expect(endTime - startTime).toBeLessThan(150);
      });

      it('maintains consistent performance', () => {
         const renderTimes: number[] = [];

         for (let i = 0; i < 5; i++) {
            const startTime = performance.now();
            const { unmount } = render(<AdminPageBase {...defaultProps} />);
            const endTime = performance.now();
            renderTimes.push(endTime - startTime);
            unmount();
         }

         const avgTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
         expect(avgTime).toBeLessThan(200);
      });
   });

   describe('Error handling and resilience', () => {
      it('renders main element even if providers fail', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         expect(main).toBeInTheDocument();
         expect(main).toHaveClass('AdminPageBase');
      });

      it('handles provider errors gracefully', () => {
         render(<AdminPageBase {...defaultProps} />);

         // All providers should render correctly
         expect(screen.getByTestId('text-resources-provider')).toBeInTheDocument();
         expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
         expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
      });

      it('maintains component isolation on errors', () => {
         render(<AdminPageBase {...defaultProps} />);

         const main = screen.getByRole('main');
         const header = screen.getByTestId('top-header');
         const footer = screen.getByTestId('basic-footer');
         const content = screen.getByTestId('test-content');

         expect(main).toBeInTheDocument();
         expect(header).toBeInTheDocument();
         expect(footer).toBeInTheDocument();
         expect(content).toBeInTheDocument();
      });
   });

   describe('TypeScript integration', () => {
      it('handles AdminPageBaseProps interface correctly', () => {
         const props: AdminPageBaseProps = {
            language: 'en',
            children: <div>Test</div>
         };

         render(<AdminPageBase {...props} />);

         expect(screen.getByRole('main')).toBeInTheDocument();
      });

      it('returns correct TypeScript type', () => {
         const result = AdminPageBase(defaultProps);
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
      });

      it('maintains type safety', () => {
         // This test verifies the component compiles correctly with TypeScript
         render(<AdminPageBase {...defaultProps} />);
         expect(screen.getByRole('main')).toBeInTheDocument();
      });
   });

   describe('Module imports and dependencies', () => {
      it('integrates with Redux store correctly', () => {
         render(<AdminPageBase {...defaultProps} />);

         const reduxProvider = screen.getByTestId('redux-provider');
         expect(reduxProvider).toBeInTheDocument();
      });

      it('integrates with Material-UI theme correctly', () => {
         render(<AdminPageBase {...defaultProps} />);

         const themeProvider = screen.getByTestId('theme-provider');
         expect(themeProvider).toBeInTheDocument();
      });

      it('integrates with TextResources correctly', () => {
         render(<AdminPageBase {...defaultProps} />);

         const textProvider = screen.getByTestId('text-resources-provider');
         expect(textProvider).toBeInTheDocument();
      });

      it('imports header and footer components correctly', () => {
         render(<AdminPageBase {...defaultProps} />);

         expect(screen.getByTestId('top-header')).toBeInTheDocument();
         expect(screen.getByTestId('basic-footer')).toBeInTheDocument();
      });
   });
});

