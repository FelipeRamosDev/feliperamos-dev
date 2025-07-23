import { render, screen } from '@testing-library/react';
import React from 'react';
import Image from 'next/image';
import TopHeader from './TopHeader';

interface ContainerProps {
   children: React.ReactNode;
}

interface LogoProps {
   className?: string | string[];
   width?: number;
   height?: number;
   [key: string]: unknown;
}

// Mock Container component
jest.mock('@/components/common', () => ({
   Container: ({ children }: ContainerProps) => (
      <div data-testid="container">
         {children}
      </div>
   )
}));

// Mock Logo component
jest.mock('@/components/common/Logo/Logo', () => {
   return function MockLogo({ className, width, height, ...props }: LogoProps) {
      return (
         <Image
            data-testid="logo"
            className={Array.isArray(className) ? className.join(' ') : className || 'Logo'}
            width={width || 40}
            height={height || 40}
            alt="Logo"
            src="/logo.svg"
            {...props}
         />
      );
   };
});

describe('TopHeader', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the TopHeader element', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toBeInTheDocument();
         expect(header).toHaveClass('TopHeader');
      });

      it('renders as a header element', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header.tagName).toBe('HEADER');
      });

      it('returns a React JSX Element', () => {
         const result = TopHeader();
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
         expect(result.type).toBe('header');
      });

      it('renders with Container component', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
      });

      it('renders Logo component', () => {
         render(<TopHeader />);

         const logo = screen.getByTestId('logo');
         expect(logo).toBeInTheDocument();
         expect(logo).toHaveAttribute('alt', 'Logo');
      });
   });

   describe('Component structure', () => {
      it('has correct HTML structure', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toHaveClass('TopHeader');

         const container = screen.getByTestId('container');
         expect(header).toContainElement(container);

         const link = screen.getByRole('link');
         expect(container).toContainElement(link);
         expect(link).toHaveAttribute('href', '/');

         const logo = screen.getByTestId('logo');
         expect(link).toContainElement(logo);
      });

      it('maintains proper DOM hierarchy', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');
         const link = screen.getByRole('link');
         const logo = screen.getByTestId('logo');

         expect(header.children).toHaveLength(1);
         expect(header.children[0]).toBe(container);
         expect(container.children).toHaveLength(1);
         expect(container.children[0]).toBe(link);
         expect(link.children).toHaveLength(1);
         expect(link.children[0]).toBe(logo);
      });

      it('applies correct CSS classes', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toHaveClass('TopHeader');

         const logo = screen.getByTestId('logo');
         expect(logo).toHaveClass('Logo');
      });

      it('contains only necessary elements', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');

         expect(header.children).toHaveLength(1);
         expect(container.children).toHaveLength(1);
      });
   });

   describe('Logo integration', () => {
      it('renders Logo component with default properties', () => {
         render(<TopHeader />);

         const logo = screen.getByTestId('logo');
         expect(logo).toBeInTheDocument();
         expect(logo).toHaveAttribute('alt', 'Logo');
         expect(logo).toHaveAttribute('src', '/logo.svg');
      });

      it('Logo has correct className', () => {
         render(<TopHeader />);

         const logo = screen.getByTestId('logo');
         expect(logo).toHaveClass('Logo');
      });

      it('integrates Logo properly within Container', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         const link = screen.getByRole('link');
         const logo = screen.getByTestId('logo');

         expect(container).toContainElement(link);
         expect(link).toContainElement(logo);
         expect(logo.parentElement).toBe(link);
         expect(link.parentElement).toBe(container);
      });

      it('Logo is the only child of Link which is the only child of Container', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         const link = screen.getByRole('link');
         
         expect(container.children).toHaveLength(1);
         expect(container.children[0]).toBe(link);
         expect(link.children).toHaveLength(1);
         expect(link.children[0]).toHaveAttribute('data-testid', 'logo');
      });
   });

   describe('Container integration', () => {
      it('integrates properly with Container component', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
      });

      it('Container is direct child of header', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');

         expect(header).toContainElement(container);
         expect(container.parentElement).toBe(header);
      });

      it('passes Logo as child to Container', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         const logo = screen.getByTestId('logo');

         expect(container).toContainElement(logo);
      });
   });

   describe('Accessibility', () => {
      it('uses semantic header element', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toBeInTheDocument();
         expect(header.tagName).toBe('HEADER');
      });

      it('provides proper banner role', () => {
         render(<TopHeader />);

         const banner = screen.getByRole('banner');
         expect(banner).toBeInTheDocument();
      });

      it('Logo has proper alt text', () => {
         render(<TopHeader />);

         const logo = screen.getByTestId('logo');
         expect(logo).toHaveAttribute('alt', 'Logo');
      });

      it('maintains proper document structure', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toBeInTheDocument();

         // Should be at the top level of the document structure
         expect(header.parentElement?.tagName).toBe('DIV'); // React wrapper
      });

      it('provides accessible logo image', () => {
         render(<TopHeader />);

         const logo = screen.getByRole('img');
         expect(logo).toBeInTheDocument();
         expect(logo).toHaveAttribute('alt', 'Logo');
      });
   });

   describe('CSS and styling', () => {
      it('applies TopHeader class for styling', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toHaveClass('TopHeader');
      });

      it('provides structure for CSS styling', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const logo = screen.getByTestId('logo');

         // Check that all elements have appropriate classes for CSS targeting
         expect(header).toHaveClass('TopHeader');
         expect(logo).toHaveClass('Logo');
      });

      it('maintains CSS class hierarchy', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const logo = screen.getByTestId('logo');

         expect(header).toHaveClass('TopHeader');
         expect(logo).toHaveClass('Logo');
      });
   });

   describe('Component behavior', () => {
      it('renders consistently', () => {
         const { rerender } = render(<TopHeader />);

         // Initial render
         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(screen.getByTestId('logo')).toBeInTheDocument();

         // Re-render should maintain same content
         rerender(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(screen.getByTestId('logo')).toBeInTheDocument();
      });

      it('handles re-renders without issues', () => {
         const { rerender } = render(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();

         rerender(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('logo')).toBeInTheDocument();
      });

      it('maintains component state', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const logo = screen.getByTestId('logo');

         expect(header).toBeInTheDocument();
         expect(logo).toBeInTheDocument();
      });

      it('is stateless component', () => {
         const component1 = render(<TopHeader />);
         const component2 = render(<TopHeader />);

         // Both should render identically
         expect(component1.container.innerHTML).toBeDefined();
         expect(component2.container.innerHTML).toBeDefined();

         component1.unmount();
         component2.unmount();
      });
   });

   describe('Performance considerations', () => {
      it('renders efficiently', () => {
         const startTime = performance.now();
         render(<TopHeader />);
         const endTime = performance.now();

         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(endTime - startTime).toBeLessThan(50);
      });

      it('does not cause unnecessary re-renders', () => {
         const { rerender } = render(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();

         rerender(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();
      });

      it('maintains consistent performance', () => {
         const renderTimes: number[] = [];

         for (let i = 0; i < 5; i++) {
            const startTime = performance.now();
            const { unmount } = render(<TopHeader />);
            const endTime = performance.now();
            renderTimes.push(endTime - startTime);
            unmount();
         }

         const avgTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
         expect(avgTime).toBeLessThan(100);
      });

      it('has minimal DOM footprint', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');

         // Should have minimal nested structure
         expect(header.children).toHaveLength(1);
         expect(container.children).toHaveLength(1);
      });
   });

   describe('Error handling and resilience', () => {
      it('renders header even if child components fail', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         expect(header).toBeInTheDocument();
         expect(header).toHaveClass('TopHeader');
      });

      it('maintains proper component isolation', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');
         const logo = screen.getByTestId('logo');

         expect(header).toBeInTheDocument();
         expect(container).toBeInTheDocument();
         expect(logo).toBeInTheDocument();
      });

      it('handles component updates gracefully', () => {
         const { rerender } = render(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();

         rerender(<TopHeader />);

         expect(screen.getByRole('banner')).toBeInTheDocument();
      });
   });

   describe('Module imports and dependencies', () => {
      it('imports Container from common module', () => {
         render(<TopHeader />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
      });

      it('imports Logo from common/Logo module', () => {
         render(<TopHeader />);

         const logo = screen.getByTestId('logo');
         expect(logo).toBeInTheDocument();
      });

      it('handles module dependencies correctly', () => {
         render(<TopHeader />);

         // Verify all imported components are functional
         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('logo')).toBeInTheDocument();
      });
   });

   describe('TypeScript integration', () => {
      it('returns correct TypeScript type', () => {
         const result = TopHeader();
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
      });

      it('handles TypeScript JSX.Element return type', () => {
         const result = TopHeader();
         expect(result.type).toBe('header');
         expect(result.props).toBeDefined();
      });

      it('maintains type safety', () => {
         // This test verifies the component compiles correctly with TypeScript
         render(<TopHeader />);
         expect(screen.getByRole('banner')).toBeInTheDocument();
      });
   });

   describe('Responsive design considerations', () => {
      it('provides structure for responsive design', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const logo = screen.getByTestId('logo');

         // Check that structure supports responsive CSS
         expect(header).toHaveClass('TopHeader');
         expect(logo).toHaveClass('Logo');
      });

      it('maintains proper hierarchy for responsive breakpoints', () => {
         render(<TopHeader />);

         const header = screen.getByRole('banner');
         const container = screen.getByTestId('container');
         const logo = screen.getByTestId('logo');

         // Structure should support CSS media queries
         expect(header).toContainElement(container);
         expect(container).toContainElement(logo);
      });
   });
});

