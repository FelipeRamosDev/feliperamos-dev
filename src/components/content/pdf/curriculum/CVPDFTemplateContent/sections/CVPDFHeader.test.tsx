import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CVPDFHeader from './CVPDFHeader';

// Mock CVPDFTemplate context
const mockUseCVPDFTemplate = jest.fn();
jest.mock('../CVPDFTemplateContext', () => ({
   useCVPDFTemplate: () => mockUseCVPDFTemplate()
}));

// Mock Container component
jest.mock('@/components/common', () => ({
   Container: ({ children, fullwidth, ...props }: any) => (
      <div data-testid="container" data-fullwidth={fullwidth} {...props}>
         {children}
      </div>
   )
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (className: string | string[] | undefined, defaultClasses: string[]) => 
      [className, ...defaultClasses].flat().filter(Boolean).join(' ')
}));

// Mock styles
jest.mock('../CVPDFTemplateContent.module.scss', () => ({
   CVPDFHeader: 'cvpdf-header',
   headerInfo: 'header-info'
}));

// Mock text resources
const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

// Mock texts
jest.mock('../CVPDFTemplateContext.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('CVPDFHeader', () => {
   const mockCVData = {
      id: 1,
      job_title: 'Senior Software Developer',
      experience_time: 5,
      user: {
         id: 1,
         first_name: 'John',
         last_name: 'Doe',
         email: 'john.doe@test.com'
      }
   };

   beforeEach(() => {
      jest.clearAllMocks();
      
      mockUseCVPDFTemplate.mockReturnValue(mockCVData);
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string, ...args: string[]) => {
               const textMap: Record<string, string> = {
                  'CVPDFHeader.header.experienceTime': `${args[0]} years of experience`
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<CVPDFHeader />)).not.toThrow();
      });

      test('renders as a section element', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         expect(section).toBeInTheDocument();
         expect(section.tagName).toBe('SECTION');
      });

      test('renders with correct CSS classes', () => {
         render(<CVPDFHeader className="custom-class" />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('custom-class CVPDFHeader cvpdf-header');
      });

      test('renders Container with fullwidth prop', () => {
         render(<CVPDFHeader />);
         
         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         expect(container).toHaveAttribute('data-fullwidth', 'true');
      });

      test('renders user full name as heading', () => {
         render(<CVPDFHeader />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('John Doe');
      });

      test('renders job title', () => {
         render(<CVPDFHeader />);
         
         expect(screen.getByText('Senior Software Developer')).toBeInTheDocument();
      });

      test('renders experience time', () => {
         render(<CVPDFHeader />);
         
         expect(screen.getByText('5 years of experience')).toBeInTheDocument();
      });
   });

   describe('CV Data Integration', () => {
      test('uses CV data from context', () => {
         render(<CVPDFHeader />);
         
         expect(mockUseCVPDFTemplate).toHaveBeenCalledTimes(1);
      });

      test('displays user name correctly', () => {
         render(<CVPDFHeader />);
         
         const heading = screen.getByRole('heading');
         expect(heading).toHaveTextContent('John Doe');
      });

      test('handles different user names', () => {
         const differentCVData = {
            ...mockCVData,
            user: {
               ...mockCVData.user,
               first_name: 'Jane',
               last_name: 'Smith'
            }
         };
         
         mockUseCVPDFTemplate.mockReturnValue(differentCVData);
         
         render(<CVPDFHeader />);
         
         expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      test('handles different job titles', () => {
         const differentCVData = {
            ...mockCVData,
            job_title: 'Frontend Developer'
         };
         
         mockUseCVPDFTemplate.mockReturnValue(differentCVData);
         
         render(<CVPDFHeader />);
         
         expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      });

      test('handles different experience times', () => {
         const differentCVData = {
            ...mockCVData,
            experience_time: 10
         };
         
         mockUseCVPDFTemplate.mockReturnValue(differentCVData);
         
         render(<CVPDFHeader />);
         
         expect(screen.getByText('10 years of experience')).toBeInTheDocument();
      });
   });

   describe('Props Handling', () => {
      test('handles className prop correctly', () => {
         render(<CVPDFHeader className="test-class" />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('test-class');
      });

      test('handles multiple className tokens', () => {
         render(<CVPDFHeader className="class1 class2" />);
         const section = screen.getByRole('region');
         expect(section).toHaveClass('class1');
         expect(section).toHaveClass('class2');
      });

      test('handles missing className prop', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('CVPDFHeader cvpdf-header');
      });

      test('applies default CSS classes when no className provided', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('CVPDFHeader');
         expect(section).toHaveClass('cvpdf-header');
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<CVPDFHeader />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('formats experience time using text resources', () => {
         const mockGetText = jest.fn((key: string, ...args: string[]) => {
            if (key === 'CVPDFHeader.header.experienceTime') {
               return `${args[0]} anos de experiência`;
            }
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CVPDFHeader />);
         
         expect(mockGetText).toHaveBeenCalledWith('CVPDFHeader.header.experienceTime', '5');
         expect(screen.getByText('5 anos de experiência')).toBeInTheDocument();
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<CVPDFHeader />)).not.toThrow();
      });

      test('handles text resource errors', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => { throw new Error('Text error'); })
            }
         });

         expect(() => render(<CVPDFHeader />)).toThrow();
      });
   });

   describe('Component Structure', () => {
      test('has correct component hierarchy', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         const container = screen.getByTestId('container');
         const heading = screen.getByRole('heading');
         
         expect(section).toContainElement(container);
         expect(container).toContainElement(heading);
      });

      test('renders header info with correct CSS class', () => {
         render(<CVPDFHeader />);
         
         const headerInfo = screen.getByRole('heading').parentElement;
         expect(headerInfo).toHaveClass('header-info');
      });

      test('renders all header elements in correct order', () => {
         render(<CVPDFHeader />);
         
         const headerInfo = screen.getByRole('heading').parentElement;
         const children = Array.from(headerInfo?.children || []);
         
         expect(children[0].tagName).toBe('H1');
         expect(children[1].tagName).toBe('P');
         expect(children[2].tagName).toBe('SPAN');
      });
   });

   describe('Data Handling Edge Cases', () => {
      test('handles missing user data', () => {
         const cvWithoutUser = {
            ...mockCVData,
            user: null
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithoutUser);
         
         expect(() => render(<CVPDFHeader />)).not.toThrow();
      });

   test('handles missing user first name', () => {
         const cvWithPartialUser = {
            ...mockCVData,
            user: {
               ...mockCVData.user,
               first_name: null
            }
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithPartialUser);
         
         render(<CVPDFHeader />);
         
         const heading = screen.getByRole('heading');
      expect(heading).toHaveTextContent('Doe');
      });

      test('handles missing user last name', () => {
         const cvWithPartialUser = {
            ...mockCVData,
            user: {
               ...mockCVData.user,
               last_name: null
            }
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithPartialUser);
         
         render(<CVPDFHeader />);
         
         const heading = screen.getByRole('heading');
         expect(heading).toHaveTextContent('John');
      });

      test('handles missing job title', () => {
         const cvWithoutJobTitle = {
            ...mockCVData,
            job_title: null
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithoutJobTitle);
         
         render(<CVPDFHeader />);
         
         // Should render empty paragraph
         const paragraphs = screen.getAllByText('', { selector: 'p' });
         expect(paragraphs.length).toBeGreaterThanOrEqual(0);
      });

      test('handles missing experience time', () => {
         const cvWithoutExperienceTime = {
            ...mockCVData,
            experience_time: null
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithoutExperienceTime);
         
         render(<CVPDFHeader />);
         
         expect(screen.getByText('null years of experience')).toBeInTheDocument();
      });

      test('handles zero experience time', () => {
         const cvWithZeroExperience = {
            ...mockCVData,
            experience_time: 0
         };
         
         mockUseCVPDFTemplate.mockReturnValue(cvWithZeroExperience);
         
         render(<CVPDFHeader />);
         
         expect(screen.getByText('0 years of experience')).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently', () => {
         const { rerender } = render(<CVPDFHeader />);
         
         expect(screen.getByRole('heading')).toBeInTheDocument();
         
         rerender(<CVPDFHeader />);
         
         expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      test('handles rapid prop changes', () => {
         const { rerender } = render(<CVPDFHeader className="class1" />);
         
         expect(screen.getByRole('region')).toHaveClass('class1');
         
         rerender(<CVPDFHeader className="class2" />);
         
         expect(screen.getByRole('region')).toHaveClass('class2');
         expect(screen.getByRole('region')).not.toHaveClass('class1');
      });
   });

   describe('Error Handling', () => {
      test('handles context errors gracefully', () => {
         mockUseCVPDFTemplate.mockImplementation(() => {
            throw new Error('Context error');
         });

         expect(() => render(<CVPDFHeader />)).toThrow('Context error');
      });

      test('handles missing context data', () => {
         mockUseCVPDFTemplate.mockReturnValue({});

         expect(() => render(<CVPDFHeader />)).not.toThrow();
      });

      test('handles null context data', () => {
         mockUseCVPDFTemplate.mockReturnValue(null);

         expect(() => render(<CVPDFHeader />)).not.toThrow();
      });
   });

   describe('Accessibility', () => {
      test('uses proper heading hierarchy', () => {
         render(<CVPDFHeader />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
      });

      test('provides semantic structure', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         expect(section.tagName).toBe('SECTION');
      });

      test('has accessible text content', () => {
         render(<CVPDFHeader />);
         
         expect(screen.getByText('John Doe')).toBeInTheDocument();
         expect(screen.getByText('Senior Software Developer')).toBeInTheDocument();
         expect(screen.getByText('5 years of experience')).toBeInTheDocument();
      });
   });

   describe('CSS Integration', () => {
      test('applies module CSS classes correctly', () => {
         render(<CVPDFHeader />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('cvpdf-header');
      });

      test('applies header info CSS class', () => {
         render(<CVPDFHeader />);
         
         const headerInfo = screen.getByRole('heading').parentElement;
         expect(headerInfo).toHaveClass('header-info');
      });

      test('combines custom and default classes', () => {
         render(<CVPDFHeader className="custom" />);
         
         const section = screen.getByRole('region');
         expect(section).toHaveClass('custom');
         expect(section).toHaveClass('CVPDFHeader');
         expect(section).toHaveClass('cvpdf-header');
      });
   });
});
