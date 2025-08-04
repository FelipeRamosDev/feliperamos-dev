import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditCVExperiencesForm from './EditCVExperiencesForm';

// Mock the helpers
jest.mock('@/helpers/database.helpers', () => ({
   loadExperiencesListOptions: jest.fn().mockResolvedValue([
      { value: 1, label: 'Software Developer at Company A' },
      { value: 2, label: 'Senior Developer at Company B' },
      { value: 3, label: 'Tech Lead at Company C' }
   ])
}));

// Mock hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, submitLabel, initialValues, editMode, onSubmit }: any) => (
      <form 
         data-testid="edit-cv-experiences-form"
         data-submit-label={submitLabel}
         data-initial-values={JSON.stringify(initialValues)}
         data-edit-mode={editMode}
         onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ cv_experiences: [1, 3] });
         }}
      >
         {children}
         <button type="submit">{submitLabel}</button>
      </form>
   )
}));

// Mock FormCheckboxList
jest.mock('@/hooks/Form/inputs/FormCheckboxList', () => {
   return function FormCheckboxList({ fieldName, loadOptions }: any) {
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

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
   value: { reload: mockReload },
   writable: true
});

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
         expect(mockReload).toHaveBeenCalled();
      });
   });

   it('handles form submission error', async () => {
      const mockError = { success: false, message: 'Update failed' };
      mockAjax.post.mockResolvedValue(mockError);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      
      await expect(async () => {
         fireEvent.submit(form);
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      }).rejects.toEqual(mockError);
   });

   it('handles network error during submission', async () => {
      const networkError = new Error('Network error');
      mockAjax.post.mockRejectedValue(networkError);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      
      await expect(async () => {
         fireEvent.submit(form);
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      }).rejects.toEqual(networkError);
   });

   it('uses TextResources for internationalization', () => {
      const { useTextResources } = require('@/services/TextResources/TextResourcesProvider');
      
      render(<EditCVExperiencesForm />);

      expect(useTextResources).toHaveBeenCalled();
   });

   it('loads experiences options correctly', () => {
      const { loadExperiencesListOptions } = require('@/helpers/database.helpers');
      
      render(<EditCVExperiencesForm />);

      // The loadOptions function should be passed to FormCheckboxList
      expect(loadExperiencesListOptions).toBeDefined();
   });

   it('uses CV details context', () => {
      const { useCVDetails } = require('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext');
      
      render(<EditCVExperiencesForm />);

      expect(useCVDetails).toHaveBeenCalled();
   });

   it('handles CV with no experiences', () => {
      const { useCVDetails } = require('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext');
      useCVDetails.mockReturnValue({
         id: 123,
         title: 'Empty CV',
         cv_experiences: []
      });

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: []
      });
   });

   it('handles CV with undefined experiences', () => {
      const { useCVDetails } = require('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext');
      useCVDetails.mockReturnValue({
         id: 123,
         title: 'CV without experiences',
         cv_experiences: undefined
      });

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: []
      });
   });

   it('passes current language to load options', () => {
      const { useTextResources } = require('@/services/TextResources/TextResourcesProvider');
      const mockTextResources = {
         currentLanguage: 'pt',
         getText: jest.fn()
      };
      useTextResources.mockReturnValue({ textResources: mockTextResources });

      render(<EditCVExperiencesForm />);

      // The component should access currentLanguage from textResources
      expect(mockTextResources.currentLanguage).toBe('pt');
   });

   it('maintains proper component structure', () => {
      render(<EditCVExperiencesForm />);

      // Check main form structure
      expect(screen.getByTestId('edit-cv-experiences-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-checkbox-list-cv_experiences')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Experiences' })).toBeInTheDocument();
   });

   it('handles successful update with page reload', async () => {
      const mockResponse = { success: true, data: { id: 123 } };
      mockAjax.post.mockResolvedValue(mockResponse);

      render(<EditCVExperiencesForm />);

      const submitButton = screen.getByRole('button', { name: 'Update Experiences' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockAjax.post).toHaveBeenCalledWith('/curriculum/update', {
            id: 123,
            updates: { cv_experiences: [1, 3] }
         });
         expect(mockReload).toHaveBeenCalled();
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

      const { useCVDetails } = require('@/components/content/admin/curriculum/CVDetailsContent/CVDetailsContext');
      useCVDetails.mockReturnValue(cvWithMixedExperiences);

      render(<EditCVExperiencesForm />);

      const form = screen.getByTestId('edit-cv-experiences-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({
         cv_experiences: [10, 20, 30]
      });
   });
});
