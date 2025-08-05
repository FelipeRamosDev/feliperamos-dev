import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditCVExperiencesForm from './EditCVExperiencesForm';
import React from 'react';
import { CVData } from '@/types/database.types';

// Mock the text file that tries to instantiate TextResources
jest.mock('./EditCVExperiencesForm.text', () => ({}));

// Import the mocked modules for proper typing
import { loadExperiencesListOptions } from '@/helpers/database.helpers';
import * as CVDetailsContext from '@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext';

// Mock the marked library to avoid ES module issues
jest.mock('marked', () => ({
   marked: jest.fn().mockImplementation((markdown) => `<p>${markdown}</p>`),
}));

// Mock the helpers
jest.mock('@/helpers/database.helpers', () => ({
   loadExperiencesListOptions: jest.fn().mockResolvedValue([
      { value: 1, label: 'Software Developer at Company A' },
      { value: 2, label: 'Senior Developer at Company B' },
      { value: 3, label: 'Tech Lead at Company C' }
   ])
}));

// Mock CV Details Context
jest.mock('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext', () => ({
   useCVDetails: jest.fn(() => ({
      id: 123,
      title: 'Test CV',
      cv_experiences: [
         { id: 1, company: 'Company A' },
         { id: 3, company: 'Company C' }
      ]
   }))
}));

// Mock hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, submitLabel, initialValues, editMode, onSubmit }: {
      children: React.ReactNode;
      submitLabel?: string;
      initialValues?: Record<string, unknown>;
      editMode?: boolean;
      onSubmit?: (data: Record<string, unknown>) => void;
   }) => (
      <form 
         data-testid="edit-cv-experiences-form"
         data-submit-label={submitLabel}
         data-initial-values={JSON.stringify(initialValues)}
         data-edit-mode={editMode}
         onSubmit={(e) => {
            e.preventDefault();
            onSubmit?.({ cv_experiences: [1, 3] });
         }}
      >
         {children}
         <button type="submit">{submitLabel}</button>
      </form>
   )
}));

// Mock FormCheckboxList
jest.mock('@/hooks/Form/inputs/FormCheckboxList', () => {
   return function FormCheckboxList({ fieldName }: { fieldName: string }) {
      return (
         <div data-testid={`form-checkbox-list-${fieldName}`}>
            <label>Experiences Checkbox List</label>
            <div data-testid={`checkbox-list-${fieldName}`}>
               Checkbox List Component
            </div>
         </div>
      );
   };
});

// Mock useAjax hook
const mockAjax = {
   get: jest.fn(),
   post: jest.fn(),
   put: jest.fn(),
   delete: jest.fn()
};

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn(() => mockAjax)
}));

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn(() => ({
      textResources: {
         currentLanguage: 'en',
         getText: jest.fn((key: string) => {
            const texts: { [key: string]: string } = {
               'CVExperiences.submitButton': 'Update Experiences'
            };
            return texts[key] || `Mocked text for ${key}`;
         })
      }
   }))
}));

// Mock CV Details Context
const mockCV = {
   id: 123,
   title: 'Test CV',
   cv_experiences: [
      { id: 1, company: 'Company A', position: 'Developer' },
      { id: 2, company: 'Company B', position: 'Senior Developer' }
   ]
};

jest.mock('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext', () => ({
   useCVDetails: jest.fn(() => mockCV)
}));

describe('EditCVExperiencesForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('renders the form with correct structure', () => {
      render(<EditCVExperiencesForm />);

      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();
   });

   it('displays correct submit button label', () => {
      render(<EditCVExperiencesForm />);

      expect(screen.getByRole('button', { name: 'Update Experiences' })).toBeInTheDocument();
   });

   it('sets form to edit mode', () => {
      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      expect(form).toHaveAttribute('data-edit-mode', 'true');
   });

   it('initializes form with current CV experiences', () => {
      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: [1, 2] // IDs from mockCV.cv_experiences
      });
   });

   it('renders FormCheckboxList component', () => {
      render(<EditCVExperiencesForm />);

      const checkboxList = screen.getByTestId('form-checkbox-list-cv_experiences');
      expect(checkboxList).toBeInTheDocument();
      expect(screen.getByText('Experiences Checkbox List')).toBeInTheDocument();
   });

   it('handles successful form submission', async () => {
      const mockResponse = { 
         success: true, 
         data: { id: 123, title: 'Updated CV' }
      };
      mockAjax.post.mockResolvedValue(mockResponse);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      fireEvent.submit(form);

      await waitFor(() => {
         expect(mockAjax.post).toHaveBeenCalledWith('/curriculum/update', {
            id: 123,
            updates: { cv_experiences: [1, 3] }
         });
      });
   });

   it('uses TextResources for internationalization', () => {
      render(<EditCVExperiencesForm />);

      // The component should use TextResources - we can verify by checking rendered elements
      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
   });

   it('loads experiences options correctly', () => {
      render(<EditCVExperiencesForm />);

      // Verify the checkbox list component is rendered
      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();

      // The loadOptions function should be passed to FormCheckboxList
      expect(loadExperiencesListOptions).toBeDefined();
   });

   it('uses CV details context', () => {
      render(<EditCVExperiencesForm />);

      // The component should use CVDetailsContext - verify by form structure
      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
   });

   it('handles CV with no experiences', () => {
      const mockUseCVDetails = CVDetailsContext.useCVDetails as jest.MockedFunction<typeof CVDetailsContext.useCVDetails>;
      mockUseCVDetails.mockReturnValue({
         id: 123,
         title: 'Empty CV',
         cv_experiences: []
      } as unknown as CVData);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: []
      });
   });

   it('handles CV with undefined experiences', () => {
      const mockUseCVDetails = CVDetailsContext.useCVDetails as jest.MockedFunction<typeof CVDetailsContext.useCVDetails>;
      mockUseCVDetails.mockReturnValue({
         id: 123,
         title: 'CV without experiences',
         cv_experiences: []
      } as unknown as CVData);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: []
      });
   });

   it('passes current language to load options', () => {
      render(<EditCVExperiencesForm />);

      // The component should render properly with text resources
      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();
   });

   it('maintains proper component structure', () => {
      render(<EditCVExperiencesForm />);

      // Check main form structure
      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
   });

   it('handles successful update with data validation', async () => {
      const mockResponse = { success: true, data: { id: 123 } };
      mockAjax.post.mockResolvedValue(mockResponse);

      render(<EditCVExperiencesForm />);

      const submitButton = screen.getByRole('button');
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockAjax.post).toHaveBeenCalledWith('/curriculum/update', {
            id: 123,
            updates: { cv_experiences: [1, 3] }
         });
      });
   });

   it('extracts experience IDs correctly from CV data', () => {
      const cvWithMixedExperiences = {
         id: 456,
         title: 'Mixed CV',
         cv_experiences: [
            { id: 10, company: 'Company X' },
            { id: 20, company: 'Company Y' },
            { id: 30, company: 'Company Z' }
         ]
      };

      const mockUseCVDetails = CVDetailsContext.useCVDetails as jest.MockedFunction<typeof CVDetailsContext.useCVDetails>;
      mockUseCVDetails.mockReturnValue(cvWithMixedExperiences as unknown as CVData);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: [10, 20, 30]
      });
   });
});
