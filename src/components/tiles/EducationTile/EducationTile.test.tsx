import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EducationTile from './EducationTile';
import { EducationData } from '@/types/database.types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: mockPush
   })
}));

// Mock Card component
jest.mock('@/components/common', () => ({
   Card: ({ children, className, padding, elevation, onClick, ...props }: any) => (
      <div 
         data-testid="education-card"
         className={className}
         onClick={onClick}
         data-padding={padding}
         data-elevation={elevation}
         {...props}
      >
         {children}
      </div>
   ),
   DateView: ({ date }: { date: string | Date }) => (
      <span data-testid="date-view">
         {new Date(date).toLocaleDateString()}
      </span>
   )
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (className: string | string[], defaultClasses: string[]) => 
      [className, ...defaultClasses].flat().filter(Boolean).join(' ')
}));

// Mock styles
jest.mock('./EducationTile.module.scss', () => ({
   EducationTile: 'education-tile',
   tileTitle: 'tile-title',
   educationDate: 'education-date',
   tileSubTitle: 'tile-subtitle'
}));

describe('EducationTile', () => {
   const mockEducationData: EducationData = {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'educations_schema',
      tableName: 'educations',
      education_id: 1,
      institution_name: 'Test University',
      field_of_study: 'Computer Science',
      degree: 'Bachelor of Science',
      start_date: new Date('2020-09-01'),
      end_date: new Date('2024-06-01'),
      is_current: false,
      student_id: 1,
      description: 'Test education description',
      language_set: 'en',
      user_id: 1,
      languageSets: []
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(
            <EducationTile education={mockEducationData} />
         )).not.toThrow();
      });

      test('renders education title correctly', () => {
         render(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Computer Science at Test University')).toBeInTheDocument();
      });

   test('renders education dates', () => {
         render(<EducationTile education={mockEducationData} />);

         const dateViews = screen.getAllByTestId('date-view');
         expect(dateViews).toHaveLength(2);

         const expectedStart = new Date(mockEducationData.start_date!).toLocaleDateString();
         const expectedEnd = new Date(mockEducationData.end_date!).toLocaleDateString();

         expect(dateViews[0].textContent).toBe(expectedStart);
         expect(dateViews[1].textContent).toBe(expectedEnd);
      });

      test('renders degree information', () => {
         render(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
      });

      test('renders with proper CSS classes', () => {
         render(<EducationTile education={mockEducationData} className="custom-class" />);
         
         const card = screen.getByTestId('education-card');
         expect(card).toHaveClass('custom-class education-tile EducationTile');
      });

      test('applies correct card props', () => {
         render(<EducationTile education={mockEducationData} />);
         
         const card = screen.getByTestId('education-card');
         expect(card).toHaveAttribute('data-padding', 's');
         expect(card).toHaveAttribute('data-elevation', 'none');
      });
   });

   describe('Navigation', () => {
      test('navigates to education details on click', () => {
         render(<EducationTile education={mockEducationData} />);
         
         const card = screen.getByTestId('education-card');
         fireEvent.click(card);
         
         expect(mockPush).toHaveBeenCalledWith('/admin/education/1');
      });

      test('navigates with correct education ID', () => {
         const educationWithDifferentId = { ...mockEducationData, id: 42 };
         render(<EducationTile education={educationWithDifferentId} />);
         
         const card = screen.getByTestId('education-card');
         fireEvent.click(card);
         
         expect(mockPush).toHaveBeenCalledWith('/admin/education/42');
      });
   });

   describe('Props Handling', () => {
      test('handles array className prop', () => {
         render(<EducationTile education={mockEducationData} className={['class1', 'class2']} />);
         const card = screen.getByTestId('education-card');
         // Classes should be applied individually (space separated)
         expect(card).toHaveClass('class1');
         expect(card).toHaveClass('class2');
         expect(card).toHaveClass('EducationTile');
         expect(card).toHaveClass('education-tile');
      });

      test('handles missing optional props', () => {
         render(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Computer Science at Test University')).toBeInTheDocument();
      });

      test('handles different education data', () => {
         const differentEducation = {
            ...mockEducationData,
            field_of_study: 'Software Engineering',
            institution_name: 'Tech Institute',
            degree: 'Master of Science'
         };
         
         render(<EducationTile education={differentEducation} />);
         
         expect(screen.getByText('Software Engineering at Tech Institute')).toBeInTheDocument();
         expect(screen.getByText('Master of Science')).toBeInTheDocument();
      });
   });

   describe('Date Handling', () => {
      test('handles Date objects', () => {
         const educationWithDateObjects = {
            ...mockEducationData,
            start_date: new Date('2020-09-01'),
            end_date: new Date('2024-06-01')
         };
         
         render(<EducationTile education={educationWithDateObjects as any} />);
         
         const dateViews = screen.getAllByTestId('date-view');
         expect(dateViews).toHaveLength(2);
      });

      test('handles null dates gracefully', () => {
         const educationWithNullDates = {
            ...mockEducationData,
            start_date: null,
            end_date: null
         };
         
         expect(() => render(
            <EducationTile education={educationWithNullDates as any} />
         )).not.toThrow();
      });
   });

   describe('Component Structure', () => {
      test('has correct component hierarchy', () => {
         render(<EducationTile education={mockEducationData} />);
         
         const card = screen.getByTestId('education-card');
         const title = screen.getByText('Computer Science at Test University');
         const degree = screen.getByText('Bachelor of Science');
         
         expect(card).toContainElement(title);
         expect(card).toContainElement(degree);
      });

      test('applies correct CSS module classes', () => {
         render(<EducationTile education={mockEducationData} />);
         
         const title = screen.getByText('Computer Science at Test University');
         const degree = screen.getByText('Bachelor of Science');
         
         expect(title).toHaveClass('tile-title');
         expect(degree).toHaveClass('tile-subtitle');
      });
   });

   describe('Accessibility', () => {
      test('tile is clickable', () => {
         render(<EducationTile education={mockEducationData} />);
         
         const card = screen.getByTestId('education-card');
         expect(card).toBeInTheDocument();
         
         fireEvent.click(card);
         expect(mockPush).toHaveBeenCalled();
      });

      test('displays meaningful content', () => {
         render(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Computer Science at Test University')).toBeInTheDocument();
         expect(screen.getByText('Bachelor of Science')).toBeInTheDocument();
      });
   });

   describe('Error Handling', () => {
      test('handles missing field_of_study', () => {
         const educationMissingField = { ...mockEducationData, field_of_study: '' };
         render(<EducationTile education={educationMissingField} />);
         expect(screen.getByText(/at Test University/)).toBeInTheDocument();
      });

      test('handles missing institution_name', () => {
         const educationMissingInstitution = { ...mockEducationData, institution_name: '' };
         render(<EducationTile education={educationMissingInstitution} />);
         expect(screen.getByText(/Computer Science at/)).toBeInTheDocument();
      });

      test('handles missing degree', () => {
         const educationMissingDegree = { ...mockEducationData, degree: '' };
         render(<EducationTile education={educationMissingDegree} />);
         const degreeElements = screen.getAllByTestId('education-card')[0].querySelectorAll('.tile-subtitle');
         expect(degreeElements[0]).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently', () => {
         const { rerender } = render(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Computer Science at Test University')).toBeInTheDocument();
         
         rerender(<EducationTile education={mockEducationData} />);
         
         expect(screen.getByText('Computer Science at Test University')).toBeInTheDocument();
      });
   });
});
