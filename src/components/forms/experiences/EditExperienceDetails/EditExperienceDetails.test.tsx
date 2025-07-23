import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditExperienceDetails from './EditExperienceDetails';
import { handleExperienceLoadOptions } from '../CreateExperienceForm/CreateExperienceForm.config';
import { handleExperienceUpdate } from '@/helpers/database.helpers';

// Mock functions for require() statements - must be declared before jest.mock calls
const mockUseExperienceDetails = jest.fn();
const mockUseAjax = jest.fn();
const mockGetTextContent = jest.fn();

// Mock dependencies
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: { children: React.ReactNode; initialValues?: Record<string, unknown>; submitLabel?: string; onSubmit?: (data: Record<string, unknown>) => void; editMode?: boolean }) => {
      const [error, setError] = React.useState<string | null>(null);
      const [success, setSuccess] = React.useState(false);
      
      const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         if (onSubmit) {
            try {
               await onSubmit(initialValues || {});
               setSuccess(true);
               setError(null);
            } catch (error: unknown) {
               setError((error as Error).message);
               setSuccess(false);
            }
         }
      };

      return (
         <form data-testid="form" data-edit-mode={editMode} onSubmit={handleSubmit}>
            <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
            <div data-testid="submit-label">{submitLabel}</div>
            {error && <div data-testid="form-error">{error}</div>}
            {success && <div data-testid="form-success">Success</div>}
            {children}
            <button type="submit">
               {submitLabel}
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label }: { fieldName: string; label?: string }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label>{label}</label>
         <input data-testid={`input-${fieldName}`} aria-label={label} />
      </div>
   )
}));

jest.mock('@/hooks/Form/inputs/FormButtonSelect', () => {
   return function MockFormButtonSelect({ fieldName, label, options }: { fieldName: string; label?: string; options?: Array<{ value: string; label: string }> }) {
      return (
         <div data-testid={`form-button-select-${fieldName}`}>
            <label>{label}</label>
            <div data-testid="options">{JSON.stringify(options)}</div>
            {options?.map((option: { value: string; label: string }) => (
               <button key={option.value} data-testid={`option-${option.value}`}>
                  {option.label}
               </button>
            ))}
         </div>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormDatePicker', () => {
   return function MockFormDatePicker({ fieldName, label }: { fieldName: string; label?: string }) {
      return (
         <div data-testid={`form-date-picker-${fieldName}`}>
            <label>{label}</label>
            <input data-testid={`date-input-${fieldName}`} type="date" aria-label={label} />
         </div>
      );
   };
});

jest.mock('@/hooks/Form/inputs/FormSelect', () => {
   return function MockFormSelect({ fieldName, label, loadOptions }: { fieldName: string; label?: string; loadOptions?: () => Array<{ value: string; label: string }> }) {
      return (
         <div data-testid={`form-select-${fieldName}`}>
            <label>{label}</label>
            <select data-testid={`select-${fieldName}`} aria-label={label}>
               <option value="">Select...</option>
            </select>
            <button 
               data-testid="load-options-trigger"
               onClick={async () => {
                  if (loadOptions) {
                     try {
                        await loadOptions();
                     } catch (error) {
                        // Handle promise rejection silently for testing
                        console.warn('Load options failed:', error);
                     }
                  }
               }}
            >
               Load Options
            </button>
         </div>
      );
   };
});

jest.mock('../CreateExperienceForm/CreateExperienceForm.config', () => ({
   handleExperienceLoadOptions: jest.fn(),
   typeOptions: [
      { value: 'full-time', label: 'Full Time' },
      { value: 'part-time', label: 'Part Time' },
      { value: 'contract', label: 'Contract' },
      { value: 'freelance', label: 'Freelance' }
   ]
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => mockUseAjax()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockGetTextContent()
}));

jest.mock('@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext', () => ({
   useExperienceDetails: () => mockUseExperienceDetails()
}));

jest.mock('@/helpers/database.helpers', () => ({
   handleExperienceUpdate: jest.fn()
}));

jest.mock('./EditExperienceDetails.text', () => ({}));



describe('EditExperienceDetails', () => {
   const mockAjax = {
      post: jest.fn(),
      get: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const mockExperience = {
      id: 'exp-123',
      title: 'Software Developer',
      company_id: 'comp-1',
      type: 'full-time',
      start_date: '2023-01-01',
      end_date: '2024-01-01'
   };

   const mockHandleExperienceUpdate = handleExperienceUpdate as jest.MockedFunction<typeof handleExperienceUpdate>;

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseAjax.mockReturnValue(mockAjax);
      mockGetTextContent.mockReturnValue({ textResources: mockTextResources });
      mockUseExperienceDetails.mockReturnValue(mockExperience);
      mockHandleExperienceUpdate.mockResolvedValue({ success: true });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'EditExperienceDetails.title.label': 'Title',
            'EditExperienceDetails.company.label': 'Company',
            'EditExperienceDetails.type.label': 'Type',
            'EditExperienceDetails.startDate.label': 'Start Date',
            'EditExperienceDetails.endDate.label': 'End Date'
         };
         return textMap[key] || key;
      });

      (handleExperienceLoadOptions as jest.Mock).mockResolvedValue([
         { value: 'comp-1', label: 'Company 1' },
         { value: 'comp-2', label: 'Company 2' }
      ]);

      mockHandleExperienceUpdate.mockResolvedValue({ success: true });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<EditExperienceDetails />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode', () => {
         render(<EditExperienceDetails />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should render with hardcoded submit label', () => {
         render(<EditExperienceDetails />);
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Save');
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render title field with correct label', () => {
         render(<EditExperienceDetails />);
         
         const titleField = screen.getByTestId('form-input-title');
         expect(titleField).toBeInTheDocument();
         expect(titleField).toHaveTextContent('Title');
      });

      it('should render company select field with correct label', () => {
         render(<EditExperienceDetails />);
         
         const companyField = screen.getByTestId('form-select-company_id');
         expect(companyField).toBeInTheDocument();
         expect(companyField).toHaveTextContent('Company');
      });

      it('should render type button select field with correct label and options', () => {
         render(<EditExperienceDetails />);
         
         const typeField = screen.getByTestId('form-button-select-type');
         expect(typeField).toBeInTheDocument();
         expect(typeField).toHaveTextContent('Type');
         
         // Check type options
         expect(screen.getByTestId('option-full-time')).toHaveTextContent('Full Time');
         expect(screen.getByTestId('option-part-time')).toHaveTextContent('Part Time');
         expect(screen.getByTestId('option-contract')).toHaveTextContent('Contract');
         expect(screen.getByTestId('option-freelance')).toHaveTextContent('Freelance');
      });

      it('should render start date picker field with correct label', () => {
         render(<EditExperienceDetails />);
         
         const startDateField = screen.getByTestId('form-date-picker-start_date');
         expect(startDateField).toBeInTheDocument();
         expect(startDateField).toHaveTextContent('Start Date');
      });

      it('should render end date picker field with correct label', () => {
         render(<EditExperienceDetails />);
         
         const endDateField = screen.getByTestId('form-date-picker-end_date');
         expect(endDateField).toBeInTheDocument();
         expect(endDateField).toHaveTextContent('End Date');
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for title field', () => {
         render(<EditExperienceDetails />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceDetails.title.label');
      });

      it('should call getText for company field', () => {
         render(<EditExperienceDetails />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceDetails.company.label');
      });

      it('should call getText for type field', () => {
         render(<EditExperienceDetails />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceDetails.type.label');
      });

      it('should call getText for start date field', () => {
         render(<EditExperienceDetails />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceDetails.startDate.label');
      });

      it('should call getText for end date field', () => {
         render(<EditExperienceDetails />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceDetails.endDate.label');
      });
   });

   // Initial Values Tests
   describe('Initial Values', () => {
      it('should set correct initial values from experience data', () => {
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockExperience);
      });

      it('should handle experience with different data structure', () => {
         const differentExperience = {
            id: 'exp-456',
            title: 'Product Manager',
            company_id: 'comp-2',
            type: 'contract',
            start_date: '2024-01-01',
            end_date: null
         };
         
         mockUseExperienceDetails.mockReturnValue(differentExperience);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(differentExperience);
      });

      it('should handle partial experience data', () => {
         const partialExperience = {
            id: 'exp-789',
            title: 'Consultant'
         };
         
         mockUseExperienceDetails.mockReturnValue(partialExperience);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(partialExperience);
      });
   });

   // Company Load Options Tests
   describe('Company Load Options', () => {
      it('should call handleExperienceLoadOptions when triggered', async () => {
         render(<EditExperienceDetails />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalledWith(mockAjax, mockTextResources);
         });
      });

      it('should handle load options success', async () => {
         (handleExperienceLoadOptions as jest.Mock).mockResolvedValue([
            { value: 'comp-1', label: 'Company 1' },
            { value: 'comp-2', label: 'Company 2' }
         ]);
         
         render(<EditExperienceDetails />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalled();
         });
      });

      it('should handle load options error', async () => {
         (handleExperienceLoadOptions as jest.Mock).mockImplementation(() => {
            // Don't throw immediately, let the component handle gracefully
            return Promise.reject(new Error('Load failed'));
         });
         
         render(<EditExperienceDetails />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         
         await act(async () => {
            fireEvent.click(loadOptionsButton);
         });
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalled();
         });
      });
   });

   // Type Options Tests
   describe('Type Options', () => {
      it('should display all type options correctly', () => {
         render(<EditExperienceDetails />);
         
         const optionsData = JSON.parse(screen.getByTestId('options').textContent || '[]');
         expect(optionsData).toEqual([
            { value: 'full-time', label: 'Full Time' },
            { value: 'part-time', label: 'Part Time' },
            { value: 'contract', label: 'Contract' },
            { value: 'freelance', label: 'Freelance' }
         ]);
      });

      it('should render all type option buttons', () => {
         render(<EditExperienceDetails />);
         
         expect(screen.getByTestId('option-full-time')).toBeInTheDocument();
         expect(screen.getByTestId('option-part-time')).toBeInTheDocument();
         expect(screen.getByTestId('option-contract')).toBeInTheDocument();
         expect(screen.getByTestId('option-freelance')).toBeInTheDocument();
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful form submission', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceDetails />);
         
         const submitButton = screen.getByRole('button', { name: 'Save' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               mockExperience
            );
         });
      });

      it('should handle form submission error', async () => {
         mockHandleExperienceUpdate.mockRejectedValue(new Error('Update failed'));
         
         render(<EditExperienceDetails />);
         
         const submitButton = screen.getByRole('button', { name: 'Save' });
         
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Update failed');
         });
      });

      it('should pass correct parameters to handleExperienceUpdate', async () => {
         render(<EditExperienceDetails />);
         
         const submitButton = screen.getByRole('button', { name: 'Save' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               mockExperience
            );
         });
      });
   });

   // Experience Context Tests
   describe('Experience Context', () => {
      it('should use experience from context', () => {
         render(<EditExperienceDetails />);
         
         expect(mockUseExperienceDetails).toHaveBeenCalled();
      });

      it('should handle different experience types', () => {
         const freelanceExperience = {
            id: 'exp-freelance',
            title: 'Freelance Developer',
            company_id: 'comp-freelance',
            type: 'freelance',
            start_date: '2023-06-01',
            end_date: '2023-12-31'
         };
         
         mockUseExperienceDetails.mockReturnValue(freelanceExperience);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(freelanceExperience);
      });
   });

   // Ajax Integration Tests
   describe('Ajax Integration', () => {
      it('should use ajax from useAjax hook', () => {
         render(<EditExperienceDetails />);
         
         expect(mockUseAjax).toHaveBeenCalled();
      });

      it('should pass ajax to loadOptions and update functions', async () => {
         render(<EditExperienceDetails />);
         
         // Test loadOptions
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalledWith(mockAjax, expect.any(Object));
         });
         
         // Test update
         const submitButton = screen.getByRole('button', { name: 'Save' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(mockAjax, expect.any(Object), expect.any(Object));
         });
      });
   });

   // Date Fields Tests
   describe('Date Fields', () => {
      it('should render start date picker with correct type', () => {
         render(<EditExperienceDetails />);
         
         const startDateInput = screen.getByTestId('date-input-start_date');
         expect(startDateInput).toHaveAttribute('type', 'date');
      });

      it('should render end date picker with correct type', () => {
         render(<EditExperienceDetails />);
         
         const endDateInput = screen.getByTestId('date-input-end_date');
         expect(endDateInput).toHaveAttribute('type', 'date');
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle missing experience context', () => {
         mockUseExperienceDetails.mockReturnValue(null);
         
         expect(() => {
            render(<EditExperienceDetails />);
         }).not.toThrow();
      });

      it('should handle handleExperienceUpdate errors', async () => {
         mockHandleExperienceUpdate.mockRejectedValue(new Error('Database error'));
         
         render(<EditExperienceDetails />);
         
         const submitButton = screen.getByRole('button', { name: 'Save' });
         
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Database error');
         });
      });

      it('should handle company load options network errors', async () => {
         (handleExperienceLoadOptions as jest.Mock).mockImplementation(() => {
            // Don't throw immediately, let the component handle gracefully
            return Promise.reject(new Error('Network error'));
         });
         
         render(<EditExperienceDetails />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         
         await act(async () => {
            fireEvent.click(loadOptionsButton);
         });
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalled();
         });
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper form structure for screen readers', () => {
         render(<EditExperienceDetails />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         // Check all form fields are present
         expect(screen.getByTestId('form-input-title')).toBeInTheDocument();
         expect(screen.getByTestId('form-select-company_id')).toBeInTheDocument();
         expect(screen.getByTestId('form-button-select-type')).toBeInTheDocument();
         expect(screen.getByTestId('form-date-picker-start_date')).toBeInTheDocument();
         expect(screen.getByTestId('form-date-picker-end_date')).toBeInTheDocument();
      });

      it('should have proper labels for all form fields', () => {
         render(<EditExperienceDetails />);
         
         expect(screen.getByTestId('form-input-title')).toHaveTextContent('Title');
         expect(screen.getByTestId('form-select-company_id')).toHaveTextContent('Company');
         expect(screen.getByTestId('form-button-select-type')).toHaveTextContent('Type');
         expect(screen.getByTestId('form-date-picker-start_date')).toHaveTextContent('Start Date');
         expect(screen.getByTestId('form-date-picker-end_date')).toHaveTextContent('End Date');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditExperienceDetails />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<EditExperienceDetails />);
         
         // Text resources might be called again but should not exceed double the initial count
         expect(mockTextResources.getText.mock.calls.length).toBeLessThanOrEqual(initialCallCount * 2);
      });

      it('should handle multiple load options calls efficiently', async () => {
         render(<EditExperienceDetails />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         
         // Multiple rapid clicks
         fireEvent.click(loadOptionsButton);
         fireEvent.click(loadOptionsButton);
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalledTimes(3);
         });
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditExperienceDetails />);
         
         // Verify all mocked hooks are called
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockGetTextContent).toHaveBeenCalled();
         expect(mockUseExperienceDetails).toHaveBeenCalled();
      });

      it('should work with complete workflow', async () => {
         render(<EditExperienceDetails />);
         
         // Load company options first
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect((handleExperienceLoadOptions as jest.Mock)).toHaveBeenCalled();
         });
         
         // Then submit form
         const submitButton = screen.getByRole('button', { name: 'Save' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalled();
         });
      });
   });

   // Edge Cases Tests
   describe('Edge Cases', () => {
      it('should handle experience with missing dates', () => {
         const experienceWithoutDates = {
            id: 'exp-no-dates',
            title: 'Current Position',
            company_id: 'comp-current',
            type: 'full-time'
         };
         
         mockUseExperienceDetails.mockReturnValue(experienceWithoutDates);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(experienceWithoutDates);
      });

      it('should handle experience with null company_id', () => {
         const experienceWithoutCompany = {
            ...mockExperience,
            company_id: null
         };
         
         mockUseExperienceDetails.mockReturnValue(experienceWithoutCompany);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues.company_id).toBeNull();
      });

      it('should handle unknown experience type', () => {
         const experienceWithUnknownType = {
            ...mockExperience,
            type: 'unknown-type'
         };
         
         mockUseExperienceDetails.mockReturnValue(experienceWithUnknownType);
         
         render(<EditExperienceDetails />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues.type).toBe('unknown-type');
      });
   });
});
