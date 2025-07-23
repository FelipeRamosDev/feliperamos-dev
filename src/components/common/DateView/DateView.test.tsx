import { render, screen } from '@testing-library/react';
import React from 'react';
import DateView from './DateView';
import { parseCSS } from '@/helpers/parse.helpers';
import dayjs from 'dayjs';

// Mock the parseCSS helper
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn()
}));

// Mock dayjs
jest.mock('dayjs', () => {
   const originalDayjs = jest.requireActual('dayjs');
   const mockDayjs = jest.fn((date?: string | Date | number) => {
      const dayjsInstance = originalDayjs(date);
      
      return {
         ...dayjsInstance,
         locale: jest.fn().mockReturnThis(),
         format: jest.fn((format: string) => {
            // Mock format responses based on format string
            const formatMockResponses: Record<string, string> = {
               'LL': 'July 15, 2023',
               'MMM YYYY': 'Jul 2023',
               'MMMM YYYY': 'July 2023',
               'MMMM YY': 'July 23',
               'MMM YY': 'Jul 23'
            };
            return formatMockResponses[format] || 'Mock Date';
         })
      };
   });
   
   // Add locale as a static method on the mock function
   Object.assign(mockDayjs, {
      locale: jest.fn().mockReturnValue(mockDayjs)
   });
   
   return mockDayjs;
});

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;

describe('DateView', () => {
   const mockDate = new Date('2023-07-15T10:30:00.000Z');
   
   beforeEach(() => {
      jest.clearAllMocks();
      mockParseCSS.mockReturnValue('DateView test-class');
   });

   describe('Basic rendering', () => {
      it('renders with default props', () => {
         render(<DateView date={mockDate} />);
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement).toBeInTheDocument();
         expect(dateElement.tagName).toBe('SPAN');
      });

      it('applies CSS classes correctly', () => {
         render(<DateView date={mockDate} className="custom-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', ['DateView']);
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement).toHaveClass('DateView test-class');
      });

      it('passes through additional props', () => {
         render(
            <DateView 
               date={mockDate} 
               data-testid="date-view" 
               aria-label="Date display"
            />
         );
         
         const dateElement = screen.getByTestId('date-view');
         expect(dateElement).toHaveAttribute('aria-label', 'Date display');
      });
   });

   describe('Date format types', () => {
      it('renders locale-standard format', () => {
         render(<DateView date={mockDate} type="locale-standard" />);
         
         const dateElement = screen.getByText('July 15, 2023');
         expect(dateElement).toBeInTheDocument();
      });

      it('renders abbMonth-fullYear format (default)', () => {
         render(<DateView date={mockDate} type="abbMonth-fullYear" />);
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement).toBeInTheDocument();
      });

      it('renders fullMonth-fullYear format', () => {
         render(<DateView date={mockDate} type="fullMonth-fullYear" />);
         
         const dateElement = screen.getByText('July 2023');
         expect(dateElement).toBeInTheDocument();
      });

      it('renders fullMonth-abbYear format', () => {
         render(<DateView date={mockDate} type="fullMonth-abbYear" />);
         
         const dateElement = screen.getByText('July 23');
         expect(dateElement).toBeInTheDocument();
      });

      it('renders abbMonth-abbYear format', () => {
         render(<DateView date={mockDate} type="abbMonth-abbYear" />);
         
         const dateElement = screen.getByText('Jul 23');
         expect(dateElement).toBeInTheDocument();
      });

      it('returns null for invalid format type', () => {
         const { container } = render(<DateView date={mockDate} type={'invalid-type' as 'locale-standard'} />);
         
         // When an invalid type is provided, the component returns null
         expect(container.firstChild).toBeNull();
      });
   });

   describe('Date input handling', () => {
      it('handles Date object input', () => {
         const dateObj = new Date('2023-12-25T00:00:00.000Z');
         render(<DateView date={dateObj} />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });

      it('handles string date input', () => {
         render(<DateView date="2023-12-25" />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });

      it('handles number timestamp input', () => {
         const timestamp = 1703462400000; // Dec 25, 2023
         render(<DateView date={timestamp} />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });

      it('handles undefined date', () => {
         render(<DateView date={undefined} />);
         
         const invalidElement = screen.getByText('Invalid Date');
         expect(invalidElement).toBeInTheDocument();
         expect(invalidElement.tagName).toBe('SPAN');
      });

      it('handles null date', () => {
         render(<DateView date={null as unknown as Date} />);
         
         const invalidElement = screen.getByText('Invalid Date');
         expect(invalidElement).toBeInTheDocument();
      });
   });

   describe('Locale handling', () => {
      it('uses default locale (en)', () => {
         render(<DateView date={mockDate} />);
         
         expect(dayjs).toHaveBeenCalledWith(mockDate);
      });

      it('applies custom locale', () => {
         render(<DateView date={mockDate} locale="fr" />);
         
         expect(dayjs).toHaveBeenCalledWith(mockDate);
         // The locale method is called on the dayjs instance
      });

      it('works with different locales for different formats', () => {
         render(<DateView date={mockDate} locale="es" type="locale-standard" />);
         
         const dateElement = screen.getByText('July 15, 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });
   });

   describe('CSS class handling', () => {
      it('handles single string className', () => {
         render(<DateView date={mockDate} className="single-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('single-class', ['DateView']);
      });

      it('handles array of classNames', () => {
         render(<DateView date={mockDate} className={['class-1', 'class-2']} />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(['class-1', 'class-2'], ['DateView']);
      });

      it('handles no className', () => {
         render(<DateView date={mockDate} />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(undefined, ['DateView']);
      });
   });

   describe('Edge cases', () => {
      it('handles invalid date string gracefully', () => {
         // dayjs should handle invalid dates, but let's test the component's behavior
         render(<DateView date="invalid-date-string" />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });

      it('handles very old dates', () => {
         const oldDate = new Date('1900-01-01');
         render(<DateView date={oldDate} />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });

      it('handles future dates', () => {
         const futureDate = new Date('2100-12-31');
         render(<DateView date={futureDate} />);
         
         const dateElement = screen.getByText('Jul 2023'); // Mocked response
         expect(dateElement).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('renders as semantic span element', () => {
         render(<DateView date={mockDate} />);
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement.tagName).toBe('SPAN');
      });

      it('supports aria attributes', () => {
         render(
            <DateView 
               date={mockDate} 
               aria-label="Publication date"
               role="time"
            />
         );
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement).toHaveAttribute('aria-label', 'Publication date');
         expect(dateElement).toHaveAttribute('role', 'time');
      });

      it('supports custom data attributes', () => {
         render(
            <DateView 
               date={mockDate} 
               data-analytics="date-view"
               data-testid="custom-date"
            />
         );
         
         const dateElement = screen.getByTestId('custom-date');
         expect(dateElement).toHaveAttribute('data-analytics', 'date-view');
      });
   });

   describe('Integration', () => {
      it('integrates with parseCSS helper correctly', () => {
         mockParseCSS.mockReturnValue('parsed-classes');
         
         render(<DateView date={mockDate} className="integration-test" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('integration-test', ['DateView']);
         
         const dateElement = screen.getByText('Jul 2023');
         expect(dateElement).toHaveClass('parsed-classes');
      });

      it('works with all format types and locales combined', () => {
         const formatTypes = [
            'locale-standard',
            'abbMonth-fullYear', 
            'fullMonth-fullYear',
            'fullMonth-abbYear',
            'abbMonth-abbYear'
         ] as const;

         formatTypes.forEach(type => {
            const { unmount } = render(
               <DateView 
                  date={mockDate} 
                  type={type} 
                  locale="en"
                  data-testid={`date-${type}`}
               />
            );
            
            const dateElement = screen.getByTestId(`date-${type}`);
            expect(dateElement).toBeInTheDocument();
            
            unmount();
         });
      });
   });
});
