import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorContent from './ErrorContent';
import { ErrorContentProps } from './ErrorContent.types';
import { parseCSS } from '@/helpers/parse.helpers';

// Mock the parseCSS helper
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn()
}));

// Mock the SCSS module
jest.mock('./ErrorContent.module.scss', () => ({
   ErrorContent: 'ErrorContent-module'
}));

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;

describe('ErrorContent', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockParseCSS.mockReturnValue('ErrorContent test-class');
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<ErrorContent />)).not.toThrow();
      });

      test('renders with default values', () => {
         render(<ErrorContent />);
         
         const statusElement = screen.getByRole('heading', { level: 1 });
         expect(statusElement).toHaveTextContent('500 | Internal Server Error');
         
         const messageElement = screen.getByText(/An unexpected error occurred/);
         expect(messageElement).toBeInTheDocument();
         expect(messageElement).toHaveTextContent('An unexpected error occurred (UNKNOWN_ERROR)');
      });

      test('renders main container with correct class from parseCSS', () => {
         render(<ErrorContent className="custom-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', ['ErrorContent', 'ErrorContent-module']);
         
         const container = document.querySelector('.ErrorContent.test-class');
         expect(container).toBeInTheDocument();
      });

      test('renders error-data and error-dynamic-content sections', () => {
         render(<ErrorContent />);
         
         const errorData = document.querySelector('.error-data');
         const errorDynamicContent = document.querySelector('.error-dynamic-content');
         
         expect(errorData).toBeInTheDocument();
         expect(errorDynamicContent).toBeInTheDocument();
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<ErrorContent />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(ErrorContent.name).toBe('ErrorContent');
      });
   });

   describe('Props Handling', () => {
      test('renders custom status and statusText', () => {
         render(<ErrorContent status={404} statusText="Page Not Found" />);
         
         const statusElement = screen.getByRole('heading', { level: 1 });
         expect(statusElement).toHaveTextContent('404 | Page Not Found');
      });

      test('renders custom code and message', () => {
         render(<ErrorContent code="NOT_FOUND" message="The requested resource was not found" />);
         
         const messageElement = screen.getByText(/The requested resource was not found/);
         expect(messageElement).toHaveTextContent('The requested resource was not found (NOT_FOUND)');
      });

      test('uses title instead of statusText when provided', () => {
         render(<ErrorContent status={403} statusText="Forbidden" title="Access Denied" />);
         
         const statusElement = screen.getByRole('heading', { level: 1 });
         expect(statusElement).toHaveTextContent('403 | Access Denied');
         expect(statusElement).not.toHaveTextContent('Forbidden');
      });

      test('falls back to status 500 when status is falsy', () => {
         render(<ErrorContent status={0} statusText="Zero Status" />);
         
         const statusElement = screen.getByRole('heading', { level: 1 });
         expect(statusElement).toHaveTextContent('500 | Zero Status');
      });

      test('handles undefined status gracefully', () => {
         render(<ErrorContent status={undefined} statusText="Undefined Status" />);
         
         const statusElement = screen.getByRole('heading', { level: 1 });
         expect(statusElement).toHaveTextContent('500 | Undefined Status');
      });
   });

   describe('Children Rendering', () => {
      test('renders children in error-dynamic-content section', () => {
         const childContent = <div data-testid="child-content">Additional Error Info</div>;
         render(<ErrorContent>{childContent}</ErrorContent>);
         
         const dynamicContent = document.querySelector('.error-dynamic-content');
         const childElement = screen.getByTestId('child-content');
         
         expect(dynamicContent).toContainElement(childElement);
         expect(childElement).toHaveTextContent('Additional Error Info');
      });

      test('renders multiple children', () => {
         render(
            <ErrorContent>
               <div data-testid="child-1">First Child</div>
               <div data-testid="child-2">Second Child</div>
            </ErrorContent>
         );
         
         const dynamicContent = document.querySelector('.error-dynamic-content');
         const child1 = screen.getByTestId('child-1');
         const child2 = screen.getByTestId('child-2');
         
         expect(dynamicContent).toContainElement(child1);
         expect(dynamicContent).toContainElement(child2);
      });

      test('renders empty dynamic content when no children provided', () => {
         render(<ErrorContent />);
         
         const dynamicContent = document.querySelector('.error-dynamic-content');
         expect(dynamicContent).toBeInTheDocument();
         expect(dynamicContent).toBeEmptyDOMElement();
      });

      test('handles complex children components', () => {
         const ComplexChild = () => (
            <div data-testid="complex-child">
               <h2>Error Details</h2>
               <ul>
                  <li>Check network connection</li>
                  <li>Refresh the page</li>
               </ul>
            </div>
         );

         render(<ErrorContent><ComplexChild /></ErrorContent>);
         
         const complexChild = screen.getByTestId('complex-child');
         expect(complexChild).toBeInTheDocument();
         expect(screen.getByText('Error Details')).toBeInTheDocument();
         expect(screen.getByText('Check network connection')).toBeInTheDocument();
      });
   });

   describe('CSS Class Integration', () => {
      test('calls parseCSS with string className', () => {
         render(<ErrorContent className="custom-error" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom-error', ['ErrorContent', 'ErrorContent-module']);
      });

      test('calls parseCSS with array className', () => {
         render(<ErrorContent className={['error-class-1', 'error-class-2']} />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(['error-class-1', 'error-class-2'], ['ErrorContent', 'ErrorContent-module']);
      });

      test('calls parseCSS with undefined className', () => {
         render(<ErrorContent />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(undefined, ['ErrorContent', 'ErrorContent-module']);
      });

      test('applies parseCSS result to main container', () => {
         mockParseCSS.mockReturnValue('ErrorContent custom-class module-class');
         render(<ErrorContent className="custom-class" />);
         
         const container = document.querySelector('.ErrorContent.custom-class.module-class');
         expect(container).toBeInTheDocument();
      });

      test('handles empty parseCSS result', () => {
         mockParseCSS.mockReturnValue('');
         render(<ErrorContent />);
         
         const container = document.querySelector('div');
         expect(container).toBeInTheDocument();
         expect(container?.className).toBe('');
      });
   });

   describe('Component Structure', () => {
      test('has correct HTML structure', () => {
         render(<ErrorContent />);
         
         const mainContainer = document.querySelector('.ErrorContent.test-class');
         const errorData = document.querySelector('.error-data');
         const errorDynamicContent = document.querySelector('.error-dynamic-content');
         
         expect(mainContainer).toContainElement(errorData as HTMLElement);
         expect(mainContainer).toContainElement(errorDynamicContent as HTMLElement);
         expect(mainContainer?.children).toHaveLength(2);
      });

      test('error-data section contains h1 and p elements', () => {
         render(<ErrorContent />);
         
         const errorData = document.querySelector('.error-data');
         const heading = errorData?.querySelector('h1');
         const paragraph = errorData?.querySelector('p');
         
         expect(heading).toBeInTheDocument();
         expect(paragraph).toBeInTheDocument();
         expect(errorData?.children).toHaveLength(2);
      });

      test('h1 element has correct text format', () => {
         render(<ErrorContent status={401} statusText="Unauthorized" />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toHaveTextContent('401 | Unauthorized');
      });

      test('p element contains message and code', () => {
         render(<ErrorContent message="Custom error message" code="CUSTOM_ERROR" />);
         
         const paragraph = screen.getByText(/Custom error message/);
         const codeElement = paragraph.querySelector('small');
         
         expect(paragraph).toHaveTextContent('Custom error message (CUSTOM_ERROR)');
         expect(codeElement).toHaveTextContent('CUSTOM_ERROR');
      });
   });

   describe('Text Content Variations', () => {
      test('handles long error messages', () => {
         const longMessage = 'This is a very long error message that explains in detail what went wrong and provides comprehensive information about the error condition that occurred in the system.';
         
         render(<ErrorContent message={longMessage} />);
         
         const messageElement = screen.getByText(new RegExp(longMessage));
         expect(messageElement).toBeInTheDocument();
      });

      test('handles special characters in text', () => {
         render(
            <ErrorContent 
               statusText="Errör & Spëcial Châracters" 
               message={'Message with <>&"\' characters'}
               code="SPECIAL_CHARS"
            />
         );
         
         const heading = screen.getByRole('heading', { level: 1 });
         const messageElement = screen.getByText(/Message with <>&"' characters/);
         
         expect(heading).toHaveTextContent('500 | Errör & Spëcial Châracters');
         expect(messageElement).toBeInTheDocument();
      });

      test('handles empty strings', () => {
         render(
            <ErrorContent 
               statusText="" 
               message=""
               code=""
            />
         );
         
         const heading = screen.getByRole('heading', { level: 1 });
         const messageElement = document.querySelector('.error-data p');
         
         expect(heading).toHaveTextContent('500 |');
         expect(messageElement).toHaveTextContent('()');
      });
   });

   describe('Error Scenarios', () => {
      test('handles null values gracefully', () => {
         expect(() => render(
            <ErrorContent 
               status={null as unknown as number}
               statusText={null as unknown as string}
               message={null as unknown as string}
               code={null as unknown as string}
               title={null as unknown as string}
            />
         )).not.toThrow();
      });

      test('handles parseCSS throwing error', () => {
         mockParseCSS.mockImplementation(() => {
            throw new Error('parseCSS error');
         });

         expect(() => render(<ErrorContent />)).toThrow('parseCSS error');
      });

      test('handles invalid children gracefully', () => {
         expect(() => render(
            <ErrorContent>
               {null}
               {undefined}
               {false}
               {'valid text'}
            </ErrorContent>
         )).not.toThrow();
         
         expect(screen.getByText('valid text')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      test('has proper heading hierarchy', () => {
         render(<ErrorContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
      });

      test('provides meaningful error information', () => {
         render(
            <ErrorContent 
               status={404}
               statusText="Not Found"
               message="The page you are looking for does not exist"
               code="PAGE_NOT_FOUND"
            />
         );
         
         const heading = screen.getByRole('heading', { level: 1 });
         const messageElement = screen.getByText(/The page you are looking for does not exist/);
         
         expect(heading).toHaveAccessibleName('404 | Not Found');
         expect(messageElement).toBeInTheDocument();
      });

      test('maintains semantic structure', () => {
         render(<ErrorContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         const paragraph = document.querySelector('.error-data p');
         
         expect(heading.tagName).toBe('H1');
         expect(paragraph?.tagName).toBe('P');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<ErrorContent status={404} />);
         
         const initialHeading = screen.getByRole('heading', { level: 1 });
         rerender(<ErrorContent status={404} />);
         const rerenderedHeading = screen.getByRole('heading', { level: 1 });
         
         expect(initialHeading).toBeInTheDocument();
         expect(rerenderedHeading).toBeInTheDocument();
      });

      test('handles prop changes efficiently', () => {
         const { rerender } = render(<ErrorContent status={404} statusText="Not Found" />);
         
         expect(screen.getByText('404 | Not Found')).toBeInTheDocument();
         
         rerender(<ErrorContent status={500} statusText="Server Error" />);
         
         expect(screen.getByText('500 | Server Error')).toBeInTheDocument();
         expect(screen.queryByText('404 | Not Found')).not.toBeInTheDocument();
      });
   });

   describe('Integration Tests', () => {
      test('works with all props together', () => {
         const childComponent = <button data-testid="retry-button">Retry</button>;
         
         render(
            <ErrorContent
               className={['error-page', 'critical']}
               status={503}
               statusText="Service Unavailable"
               title="Server Maintenance"
               code="MAINTENANCE_MODE"
               message="The service is temporarily unavailable due to maintenance"
            >
               {childComponent}
            </ErrorContent>
         );
         
         expect(mockParseCSS).toHaveBeenCalledWith(['error-page', 'critical'], ['ErrorContent', 'ErrorContent-module']);
         expect(screen.getByText('503 | Server Maintenance')).toBeInTheDocument();
         expect(screen.getByText(/The service is temporarily unavailable due to maintenance/)).toBeInTheDocument();
         expect(screen.getByText('MAINTENANCE_MODE')).toBeInTheDocument();
         expect(screen.getByTestId('retry-button')).toBeInTheDocument();
      });

      test('maintains consistency across multiple renders', () => {
         const props: ErrorContentProps = {
            status: 403,
            statusText: 'Forbidden',
            message: 'Access denied',
            code: 'ACCESS_DENIED'
         };

         const { rerender } = render(<ErrorContent {...props} />);
         
         expect(screen.getByText('403 | Forbidden')).toBeInTheDocument();
         
         rerender(<ErrorContent {...props} />);
         
         expect(screen.getByText('403 | Forbidden')).toBeInTheDocument();
         expect(screen.getByText(/Access denied/)).toBeInTheDocument();
         expect(screen.getByText('ACCESS_DENIED')).toBeInTheDocument();
      });
   });
});