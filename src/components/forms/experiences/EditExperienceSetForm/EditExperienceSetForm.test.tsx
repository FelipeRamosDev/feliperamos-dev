import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditExperienceSetForm from './EditExperienceSetForm';
import { EditExperienceSetFormProps } from './EditExperienceSetForm.types';

// Mock modules to avoid require() statements
const mockUseExperienceDetails = jest.fn();
const mockUseAjax = jest.fn();
const mockUseTextResources = jest.fn();

// Mock dependencies
jest.mock('@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext', () => ({
   useExperienceDetails: () => mockUseExperienceDetails()
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => mockUseAjax()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: { children: React.ReactNode; initialValues?: Record<string, unknown>; submitLabel?: string; onSubmit?: (data: Record<string, unknown>) => void; editMode?: boolean }) => {
      const [error, setError] = React.useState<string | null>(null);
      const [success, setSuccess] = React.useState(false);
      
      const handleSubmit = async () => {
         if (onSubmit) {
            try {
               await onSubmit(initialValues || {});
               setSuccess(true);
               setError(null);
            } catch (error: unknown) {
               // Store error for testing instead of throwing
               setError((error as Error).message);
               setSuccess(false);
            }
         }
      };

      return (
         <form data-testid="form" data-edit-mode={editMode}>
            <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
            <div data-testid="submit-label">{submitLabel}</div>
            {error && <div data-testid="form-error">{error}</div>}
            {success && <div data-testid="form-success">Success</div>}
            {children}
            <button type="submit" onClick={handleSubmit}>
               {submitLabel}
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, multiline, minRows }: { fieldName: string; label?: string; placeholder?: string; multiline?: boolean; minRows?: number }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input
            id={fieldName}
            data-testid={`input-${fieldName}`}
            placeholder={placeholder}
            data-multiline={multiline}
            data-min-rows={minRows}
            aria-label={label}
         />
      </div>
   )
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

jest.mock('./EditExperienceSetForm.text', () => ({}));

// Mock window.location.reload
const mockReload = jest.fn();
const originalLocation = window.location;

beforeAll(() => {
   delete (window as any).location;
   window.location = { ...originalLocation, reload: mockReload };
});

afterAll(() => {
   window.location = originalLocation;
});

describe('EditExperienceSetForm', () => {
   const mockAjax = {
      post: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const mockExperience = {
      languageSets: [
         {
            id: 'set-123',
            language_set: 'en',
            position: 'Software Developer',
            slug: 'software-developer',
            summary: 'Test summary',
            description: 'Test description',
            responsibilities: 'Test responsibilities'
         },
         {
            id: 'set-456',
            language_set: 'pt',
            position: 'Desenvolvedor de Software',
            slug: 'desenvolvedor-software',
            summary: 'Resumo teste',
            description: 'Descrição teste',
            responsibilities: 'Responsabilidades teste'
         }
      ]
   };

   const defaultProps: EditExperienceSetFormProps = {
      language_set: 'en'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      mockReload.mockClear();

      mockUseExperienceDetails.mockReturnValue(mockExperience);
      mockUseAjax.mockReturnValue(mockAjax);
      mockUseTextResources.mockReturnValue({ textResources: mockTextResources });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'EditExperienceSetForm.submit.label': 'Save Changes',
            'EditExperienceSetForm.position.label': 'Position',
            'EditExperienceSetForm.position.placeholder': 'Enter your position',
            'EditExperienceSetForm.slug.label': 'Slug',
            'EditExperienceSetForm.slug.placeholder': 'Enter a unique slug',
            'EditExperienceSetForm.summary.label': 'Summary',
            'EditExperienceSetForm.summary.placeholder': 'Enter a brief summary',
            'EditExperienceSetForm.description.label': 'Description',
            'EditExperienceSetForm.description.placeholder': 'Describe your role and achievements',
            'EditExperienceSetForm.responsibilities.label': 'Responsibilities',
            'EditExperienceSetForm.responsibilities.placeholder': 'Enter your responsibilities'
         };
         return textMap[key] || key;
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should render with correct submit label', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Save Changes');
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render position field with correct props', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const positionField = screen.getByTestId('form-input-position');
         expect(positionField).toBeInTheDocument();
         expect(positionField).toHaveTextContent('Position');
         
         const positionInput = screen.getByTestId('input-position');
         expect(positionInput).toHaveAttribute('placeholder', 'Enter your position');
      });

      it('should render slug field with correct props', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const slugField = screen.getByTestId('form-input-slug');
         expect(slugField).toBeInTheDocument();
         expect(slugField).toHaveTextContent('Slug');
         
         const slugInput = screen.getByTestId('input-slug');
         expect(slugInput).toHaveAttribute('placeholder', 'Enter a unique slug');
      });

      it('should render summary field as multiline with correct rows', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const summaryField = screen.getByTestId('form-input-summary');
         expect(summaryField).toBeInTheDocument();
         expect(summaryField).toHaveTextContent('Summary');
         
         const summaryInput = screen.getByTestId('input-summary');
         expect(summaryInput).toHaveAttribute('placeholder', 'Enter a brief summary');
         expect(summaryInput).toHaveAttribute('data-multiline', 'true');
         expect(summaryInput).toHaveAttribute('data-min-rows', '5');
      });

      it('should render description field as multiline with correct rows', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const descriptionField = screen.getByTestId('form-input-description');
         expect(descriptionField).toBeInTheDocument();
         expect(descriptionField).toHaveTextContent('Description');
         
         const descriptionInput = screen.getByTestId('input-description');
         expect(descriptionInput).toHaveAttribute('placeholder', 'Describe your role and achievements');
         expect(descriptionInput).toHaveAttribute('data-multiline', 'true');
         expect(descriptionInput).toHaveAttribute('data-min-rows', '10');
      });

      it('should render responsibilities field as multiline with correct rows', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const responsibilitiesField = screen.getByTestId('form-input-responsibilities');
         expect(responsibilitiesField).toBeInTheDocument();
         expect(responsibilitiesField).toHaveTextContent('Responsibilities');
         
         const responsibilitiesInput = screen.getByTestId('input-responsibilities');
         expect(responsibilitiesInput).toHaveAttribute('placeholder', 'Enter your responsibilities');
         expect(responsibilitiesInput).toHaveAttribute('data-multiline', 'true');
         expect(responsibilitiesInput).toHaveAttribute('data-min-rows', '5');
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for submit label', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.submit.label');
      });

      it('should call getText for position field', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.position.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.position.placeholder');
      });

      it('should call getText for slug field', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.slug.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.slug.placeholder');
      });

      it('should call getText for summary field', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.summary.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.summary.placeholder');
      });

      it('should call getText for description field', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.description.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.description.placeholder');
      });

      it('should call getText for responsibilities field', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.responsibilities.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSetForm.responsibilities.placeholder');
      });
   });

   // Initial Values Tests
   describe('Initial Values', () => {
      it('should set correct initial values for English language set', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockExperience.languageSets[0]);
      });

      it('should set correct initial values for Portuguese language set', () => {
         render(<EditExperienceSetForm language_set="pt" />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockExperience.languageSets[1]);
      });

      it('should default to English when no language_set provided', () => {
         render(<EditExperienceSetForm />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockExperience.languageSets[0]);
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful form submission', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const submitButton = screen.getByRole('button');
         
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalledWith('/experience/update-set', {
               id: 'set-123',
               updates: mockExperience.languageSets[0]
            });
         });
         
         // Check that success indicator appears
         await waitFor(() => {
            expect(screen.getByTestId('form-success')).toBeInTheDocument();
         });
      });

      it('should handle form submission error', async () => {
         const mockError = new Error('Update failed');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const submitButton = screen.getByRole('button');
         
         // Handle error internally
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
         
         expect(mockReload).not.toHaveBeenCalled();
      });

      it('should handle null response from API', async () => {
         mockAjax.post.mockResolvedValue(null);
         
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const submitButton = screen.getByRole('button');
         
         // Click submit and wait for error to appear
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         // Check that error is displayed
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Failed to update experience set');
         });
         
         expect(mockReload).not.toHaveBeenCalled();
      });

      it('should throw error when language set not found', async () => {
         const experienceWithoutSets = { languageSets: [] };
         mockUseExperienceDetails.mockReturnValue(experienceWithoutSets);
         
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const submitButton = screen.getByRole('button');
         
         // Click submit and wait for error to appear
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         // Check that error is displayed
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Language set not found');
         });
         
         expect(mockAjax.post).not.toHaveBeenCalled();
         expect(mockReload).not.toHaveBeenCalled();
      });
   });

   // Language Set Tests
   describe('Language Set Handling', () => {
      it('should find correct language set by language_set prop', () => {
         render(<EditExperienceSetForm language_set="pt" />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues.language_set).toBe('pt');
         expect(initialValues.position).toBe('Desenvolvedor de Software');
      });

      it('should handle non-existent language set', () => {
         render(<EditExperienceSetForm language_set="fr" />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({});
      });
   });

   // Props Tests
   describe('Props Handling', () => {
      it('should handle missing language_set prop', () => {
         render(<EditExperienceSetForm />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should handle empty string language_set', () => {
         render(<EditExperienceSetForm language_set="" />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle Ajax error during submission', async () => {
         const mockError = new Error('Network error');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const submitButton = screen.getByRole('button');
         
         // Click submit and wait for error to appear
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         // Check that error is displayed
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Network error');
         });
      });

      it('should handle missing experience context', () => {
         mockUseExperienceDetails.mockReturnValue({ languageSets: [] });
         
         expect(() => {
            render(<EditExperienceSetForm {...defaultProps} />);
         }).not.toThrow();
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper form structure for screen readers', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         const fields = ['position', 'slug', 'summary', 'description', 'responsibilities'];
         fields.forEach(field => {
            expect(screen.getByTestId(`form-input-${field}`)).toBeInTheDocument();
         });
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditExperienceSetForm {...defaultProps} />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<EditExperienceSetForm {...defaultProps} />);
         
         // Text resources will be called again on re-render, but shouldn't double unnecessarily
         const finalCallCount = mockTextResources.getText.mock.calls.length;
         expect(finalCallCount).toBeGreaterThan(initialCallCount);
         expect(finalCallCount).toBeLessThan(initialCallCount * 3); // Reasonable upper bound
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditExperienceSetForm {...defaultProps} />);
         
         // Verify all mocked hooks are called
         expect(mockUseExperienceDetails).toHaveBeenCalled();
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockUseTextResources).toHaveBeenCalled();
      });
   });
});
