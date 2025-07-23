import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WidgetHeader from './WidgetHeader';
import { WidgetHeaderProps } from './WidgetHeader.types';

// Mock the parseCSS helper
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn()
}));

// Mock function variable
let parseCSS: jest.MockedFunction<(classes?: string, merge?: string) => string>;

describe('WidgetHeader', () => {
   const defaultProps: WidgetHeaderProps = {
      title: 'Test Widget Header'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      parseCSS = require('@/helpers/parse.helpers').parseCSS;
      parseCSS.mockImplementation((classes?: string, merge?: string) => {
         const result = [];
         if (classes) result.push(classes);
         if (merge) result.push(merge);
         return result.join(' ').trim();
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<WidgetHeader {...defaultProps} />);
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });

      it('should render with correct basic structure', () => {
         const { container } = render(<WidgetHeader {...defaultProps} />);
         
         const widgetHeader = container.firstChild;
         expect(widgetHeader).toBeInTheDocument();
         
         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();
         
         const toolbar = container.querySelector('.toolbar');
         expect(toolbar).toBeInTheDocument();
      });

      it('should call parseCSS with correct parameters', () => {
         render(<WidgetHeader {...defaultProps} />);
         expect(parseCSS).toHaveBeenCalledWith(undefined, 'WidgetHeader');
      });
   });

   // Title Tests
   describe('Title Rendering', () => {
      it('should render title as h2 element', () => {
         render(<WidgetHeader {...defaultProps} />);
         const titleElement = screen.getByRole('heading', { level: 2 });
         expect(titleElement).toBeInTheDocument();
         expect(titleElement).toHaveTextContent('Test Widget Header');
      });

      it('should render different title text', () => {
         const customTitle = 'Custom Widget Title';
         render(<WidgetHeader title={customTitle} />);
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(customTitle);
      });

      it('should handle empty title', () => {
         render(<WidgetHeader title="" />);
         const titleElement = screen.getByRole('heading', { level: 2 });
         expect(titleElement).toBeInTheDocument();
         expect(titleElement).toHaveTextContent('');
      });

      it('should handle title with special characters', () => {
         const specialTitle = 'Widget Title with "quotes" & symbols! 🚀';
         render(<WidgetHeader title={specialTitle} />);
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(specialTitle);
      });

      it('should handle very long title', () => {
         const longTitle = 'A'.repeat(100);
         render(<WidgetHeader title={longTitle} />);
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(longTitle);
      });

      it('should handle numeric title', () => {
         const numericTitle = '12345';
         render(<WidgetHeader title={numericTitle} />);
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(numericTitle);
      });
   });

   // Children Tests
   describe('Children Rendering', () => {
      it('should render children in toolbar when provided', () => {
         const testButton = <button data-testid="test-button">Test Button</button>;
         render(<WidgetHeader title="Test">{testButton}</WidgetHeader>);
         
         expect(screen.getByTestId('test-button')).toBeInTheDocument();
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toContainElement(screen.getByTestId('test-button'));
      });

      it('should render multiple children', () => {
         const children = (
            <>
               <button data-testid="button-1">Button 1</button>
               <button data-testid="button-2">Button 2</button>
               <span data-testid="span-1">Span</span>
            </>
         );
         
         render(<WidgetHeader title="Test">{children}</WidgetHeader>);
         
         expect(screen.getByTestId('button-1')).toBeInTheDocument();
         expect(screen.getByTestId('button-2')).toBeInTheDocument();
         expect(screen.getByTestId('span-1')).toBeInTheDocument();
      });

      it('should render empty toolbar when no children provided', () => {
         render(<WidgetHeader title="Test" />);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toBeInTheDocument();
         expect(toolbar).toBeEmptyDOMElement();
      });

      it('should handle null children', () => {
         render(<WidgetHeader title="Test">{null}</WidgetHeader>);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toBeInTheDocument();
         expect(toolbar).toBeEmptyDOMElement();
      });

      it('should handle undefined children', () => {
         render(<WidgetHeader title="Test">{undefined}</WidgetHeader>);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toBeInTheDocument();
         expect(toolbar).toBeEmptyDOMElement();
      });

      it('should handle text children', () => {
         render(<WidgetHeader title="Test">Text child</WidgetHeader>);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toHaveTextContent('Text child');
      });

      it('should handle array of children', () => {
         const childrenArray = [
            <button key="1" data-testid="array-button-1">Button 1</button>,
            <span key="2" data-testid="array-span">Span</span>
         ];
         
         render(<WidgetHeader title="Test">{childrenArray}</WidgetHeader>);
         
         expect(screen.getByTestId('array-button-1')).toBeInTheDocument();
         expect(screen.getByTestId('array-span')).toBeInTheDocument();
      });
   });

   // CSS Class Tests
   describe('CSS Class Handling', () => {
      it('should apply default class when no className provided', () => {
         const { container } = render(<WidgetHeader title="Test" />);
         
         expect(parseCSS).toHaveBeenCalledWith(undefined, 'WidgetHeader');
         expect(container.firstChild).toHaveClass('WidgetHeader');
      });

      it('should merge custom className with default class', () => {
         parseCSS.mockReturnValue('custom-class WidgetHeader');
         
         const { container } = render(<WidgetHeader title="Test" className="custom-class" />);
         
         expect(parseCSS).toHaveBeenCalledWith('custom-class', 'WidgetHeader');
         expect(container.firstChild).toHaveClass('custom-class', 'WidgetHeader');
      });

      it('should handle multiple custom classes', () => {
         parseCSS.mockReturnValue('class1 class2 WidgetHeader');
         
         const { container } = render(<WidgetHeader title="Test" className="class1 class2" />);
         
         expect(parseCSS).toHaveBeenCalledWith('class1 class2', 'WidgetHeader');
         expect(container.firstChild).toHaveClass('class1', 'class2', 'WidgetHeader');
      });

      it('should handle empty className', () => {
         render(<WidgetHeader title="Test" className="" />);
         
         expect(parseCSS).toHaveBeenCalledWith('', 'WidgetHeader');
      });
   });

   // Structure Tests
   describe('DOM Structure', () => {
      it('should have correct DOM hierarchy', () => {
         const { container } = render(
            <WidgetHeader title="Test Title">
               <button>Test Button</button>
            </WidgetHeader>
         );
         
         const widgetHeader = container.firstChild as HTMLElement;
         const heading = screen.getByRole('heading', { level: 2 });
         const toolbar = container.querySelector('.toolbar') as HTMLElement;
         const button = screen.getByRole('button');
         
         expect(widgetHeader).toContainElement(heading);
         expect(widgetHeader).toContainElement(toolbar);
         expect(toolbar).toContainElement(button);
      });

      it('should have toolbar with correct class', () => {
         render(<WidgetHeader title="Test" />);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toBeInTheDocument();
         expect(toolbar).toHaveClass('toolbar');
      });
   });

   // Props Validation Tests
   describe('Props Handling', () => {
      it('should handle all props together', () => {
         const props = {
            title: 'Complete Widget',
            className: 'custom-widget',
            children: <button data-testid="complete-button">Complete Button</button>
         };
         
         render(<WidgetHeader {...props} />);
         
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(props.title);
         expect(screen.getByTestId('complete-button')).toBeInTheDocument();
         expect(parseCSS).toHaveBeenCalledWith(props.className, 'WidgetHeader');
      });

      it('should handle minimal props (title only)', () => {
         render(<WidgetHeader title="Minimal Widget" />);
         
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Minimal Widget');
         expect(document.querySelector('.toolbar')).toBeEmptyDOMElement();
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper heading structure', () => {
         render(<WidgetHeader title="Accessible Widget" />);
         
         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toHaveAccessibleName('Accessible Widget');
      });

      it('should be accessible to screen readers', () => {
         render(
            <WidgetHeader title="Widget Title">
               <button aria-label="Close widget">×</button>
            </WidgetHeader>
         );
         
         const heading = screen.getByRole('heading', { name: 'Widget Title' });
         const button = screen.getByRole('button', { name: 'Close widget' });
         
         expect(heading).toBeInTheDocument();
         expect(button).toBeInTheDocument();
      });

      it('should maintain proper heading hierarchy', () => {
         render(<WidgetHeader title="Main Widget" />);
         
         const headings = screen.getAllByRole('heading');
         expect(headings).toHaveLength(1);
         expect(headings[0]).toHaveProperty('tagName', 'H2');
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should work with parseCSS helper integration', () => {
         // Reset mock to use actual implementation behavior
         parseCSS.mockImplementation((classes?: string, merge?: string) => {
            const result = [];
            if (classes) result.push(classes);
            if (merge) result.push(merge);
            return result.join(' ').trim();
         });
         
         const { container } = render(<WidgetHeader title="Test" className="test-class" />);
         
         expect(parseCSS).toHaveBeenCalledWith('test-class', 'WidgetHeader');
         expect(container.firstChild).toHaveAttribute('class', 'test-class WidgetHeader');
      });
   });

   // Edge Cases
   describe('Edge Cases', () => {
      it('should handle complex children structures', () => {
         const complexChildren = (
            <div data-testid="complex-container">
               <button>Button</button>
               <div>
                  <span>Nested span</span>
                  <ul>
                     <li>List item</li>
                  </ul>
               </div>
            </div>
         );
         
         render(<WidgetHeader title="Complex">{complexChildren}</WidgetHeader>);
         
         expect(screen.getByTestId('complex-container')).toBeInTheDocument();
         expect(screen.getByRole('button')).toBeInTheDocument();
         expect(screen.getByText('Nested span')).toBeInTheDocument();
         expect(screen.getByText('List item')).toBeInTheDocument();
      });

      it('should handle boolean and number children', () => {
         render(<WidgetHeader title="Test">{42}</WidgetHeader>);
         
         const toolbar = document.querySelector('.toolbar');
         expect(toolbar).toHaveTextContent('42');
      });

      it('should handle whitespace in title', () => {
         const whitespaceTitle = '   Widget   Title   ';
         render(<WidgetHeader title={whitespaceTitle} />);
         
         const headingElement = screen.getByRole('heading', { level: 2 });
         expect(headingElement).toBeInTheDocument();
         // HTML normalizes whitespace, so check the actual textContent
         expect(headingElement.textContent).toBe(whitespaceTitle);
      });
   });

   // Snapshot Tests
   describe('Snapshot Tests', () => {
      it('should match snapshot with title only', () => {
         const { container } = render(<WidgetHeader title="Snapshot Widget" />);
         expect(container.firstChild).toMatchSnapshot();
      });

      it('should match snapshot with title, className, and children', () => {
         const { container } = render(
            <WidgetHeader title="Full Widget" className="snapshot-class">
               <button>Snapshot Button</button>
               <span>Snapshot Span</span>
            </WidgetHeader>
         );
         expect(container.firstChild).toMatchSnapshot();
      });
   });
});
