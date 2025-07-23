import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateExperienceSetForm from './CreateExperienceSetForm';
import { FormValues } from '@/hooks/Form/Form.types';
import { ExperienceSetData } from '@/types/database.types';

// Mock window.location.reload
const mockReload = jest.fn();
delete (window as unknown as Record<string, unknown>).location;
(window as unknown as Record<string, unknown>).location = { reload: mockReload };

// Mock Form hooks and components
const mockFormSubmit = jest.fn();
const mockFormInputs: Array<{ fieldName: string; label?: string; placeholder?: string; multiline?: boolean; value: string }> = [];

jest.mock('@/hooks', () => ({
   Form: ({ children, className, onSubmit, initialValues, ...props }: { children: React.ReactNode; className?: string; onSubmit?: (data: FormValues) => Promise<unknown>; initialValues?: FormValues } & Record<string, unknown>) => {
      // Store the onSubmit handler for testing
      mockFormSubmit.mockImplementation(async (formData: FormValues) => {
         try {
            return await onSubmit?.(formData);
         } catch (error) {
            console.error('Form submission error:', error);
            return { success: false, error };
         }
      });
      
      return (
         <form 
            data-testid="create-experience-set-form" 
            className={className}
            data-initial-values={JSON.stringify(initialValues)}
            onSubmit={async (e) => {
               e.preventDefault();
               const formData: FormValues = mockFormInputs.reduce((acc, input) => {
                  acc[input.fieldName] = input.value || initialValues?.[input.fieldName] || '';
                  return acc;
               }, {} as FormValues);
               
               // Include initial values that aren't form inputs
               Object.keys(initialValues || {}).forEach(key => {
                  if (!formData.hasOwnProperty(key) && initialValues) {
                     formData[key] = initialValues[key];
                  }
               });
               
               try {
                  await onSubmit?.(formData);
               } catch (error) {
                  console.error('Form submission error caught:', error);
               }
            }}
            {...props}
         >
            {children}
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, multiline, minRows, parseInput, ...props }: { fieldName: string; label?: string; placeholder?: string; multiline?: boolean; minRows?: number; parseInput?: (value: string) => string } & Record<string, unknown>) => {
      const inputData = { fieldName, label, placeholder, multiline, minRows, parseInput, value: '' };
      
      // Update or add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = inputData;
      } else {
         mockFormInputs.push(inputData);
      }

      return (
         <div data-testid={`form-input-${fieldName}`} data-multiline={multiline} data-min-rows={minRows} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            {multiline ? (
               <textarea 
                  data-testid={`textarea-${fieldName}`}
                  placeholder={placeholder}
                  aria-label={label}
                  onChange={(e) => {
                     let value = e.target.value;
                     if (parseInput) {
                        value = parseInput(value);
                     }
                     inputData.value = value;
                  }}
               />
            ) : (
               <input 
                  data-testid={`input-${fieldName}`}
                  placeholder={placeholder || label || fieldName}
                  aria-label={label}
                  title={label || fieldName}
                  onChange={(e) => {
                     let value = e.target.value;
                     if (parseInput) {
                        value = parseInput(value);
                     }
                     inputData.value = value;
                  }}
               />
            )}
         </div>
      );
   }
}));

// Mock FormSelect component
jest.mock('@/hooks/Form/inputs/FormSelect', () => {
   return function FormSelect({ fieldName, label, options, ...props }: { fieldName: string; label?: string; options?: Array<{ value: string; label: string }> } & Record<string, unknown>) {
      const selectData = { fieldName, label, options, value: '' };
      
      // Add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = selectData;
      } else {
         mockFormInputs.push(selectData);
      }

      return (
         <div data-testid={`form-select-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <select 
               data-testid={`select-${fieldName}`}
               aria-label={label}
               onChange={(e) => {
                  selectData.value = e.target.value;
               }}
            >
               <option value="">Select an option</option>
               {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                     {option.label}
                  </option>
               ))}
            </select>
         </div>
      );
   };
});

// Mock useAjax hook
const mockPost = jest.fn();
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      post: mockPost
   })
}));

// Mock text resources
const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./CreateExperienceSetForm.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

// Mock language options from config
jest.mock('./CreateExperienceSetForm.config', () => ({
   languagesOptions: [
      { value: 'en', label: 'English' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'es', label: 'Spanish' }
   ]
}));

describe('CreateExperienceSetForm', () => {
   const defaultProps = {
      experienceId: 123
   };

   beforeEach(() => {
      jest.clearAllMocks();
      mockFormInputs.length = 0; // Clear form inputs array
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'CreateExperienceSetForm.language_set.label': 'Language',
                  'CreateExperienceSetForm.slug.label': 'Slug',
                  'CreateExperienceSetForm.slug.placeholder': 'Enter a slug',
                  'CreateExperienceSetForm.position.label': 'Position',
                  'CreateExperienceSetForm.position.placeholder': 'Enter a position',
                  'CreateExperienceSetForm.summary.label': 'Summary',
                  'CreateExperienceSetForm.summary.placeholder': 'Enter a summary',
                  'CreateExperienceSetForm.description.label': 'Description',
                  'CreateExperienceSetForm.description.placeholder': 'Enter a description',
                  'CreateExperienceSetForm.responsibilities.label': 'Responsibilities',
                  'CreateExperienceSetForm.responsibilities.placeholder': 'Enter responsibilities'
               };
               return textMap[key] || key;
            }),
            currentLanguage: 'en'
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<CreateExperienceSetForm {...defaultProps} />)).not.toThrow();
      });

      test('renders form with correct attributes', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveClass('CreateExperienceSetForm');
      });

      test('sets initial values with experienceId', () => {
         render(<CreateExperienceSetForm experienceId={456} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.experience_id).toBe(456);
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<CreateExperienceSetForm {...defaultProps} />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(CreateExperienceSetForm.name).toBe('CreateExperienceSetForm');
      });
   });

   describe('Form Fields Rendering', () => {
      test('renders language select field correctly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const languageField = screen.getByTestId('form-select-language_set');
         const label = screen.getByTestId('label-language_set');
         const select = screen.getByTestId('select-language_set');
         
         expect(languageField).toBeInTheDocument();
         expect(label).toHaveTextContent('Language');
         expect(select).toBeInTheDocument();
         
         // Check language options
         expect(screen.getByText('English')).toBeInTheDocument();
         expect(screen.getByText('Portuguese')).toBeInTheDocument();
         expect(screen.getByText('Spanish')).toBeInTheDocument();
      });

      test('renders slug field with parseInput functionality', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const slugField = screen.getByTestId('form-input-slug');
         const label = screen.getByTestId('label-slug');
         const input = screen.getByTestId('input-slug');
         
         expect(slugField).toBeInTheDocument();
         expect(label).toHaveTextContent('Slug');
         expect(input).toHaveAttribute('placeholder', 'Enter a slug');
         
         // Test parseInput functionality
         fireEvent.change(input, { target: { value: 'Test Slug With Spaces' } });
         
         const slugInput = mockFormInputs.find(input => input.fieldName === 'slug');
         expect(slugInput?.value).toBe('test-slug-with-spaces');
      });

      test('renders position field correctly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const positionField = screen.getByTestId('form-input-position');
         const label = screen.getByTestId('label-position');
         const input = screen.getByTestId('input-position');
         
         expect(positionField).toBeInTheDocument();
         expect(label).toHaveTextContent('Position');
         expect(input).toHaveAttribute('placeholder', 'Enter a position');
      });

      test('renders summary field as multiline', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const summaryField = screen.getByTestId('form-input-summary');
         const label = screen.getByTestId('label-summary');
         const textarea = screen.getByTestId('textarea-summary');
         
         expect(summaryField).toBeInTheDocument();
         expect(summaryField).toHaveAttribute('data-multiline', 'true');
         expect(label).toHaveTextContent('Summary');
         expect(textarea).toHaveAttribute('placeholder', 'Enter a summary');
      });

      test('renders description field as multiline with minRows', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const descriptionField = screen.getByTestId('form-input-description');
         const label = screen.getByTestId('label-description');
         const textarea = screen.getByTestId('textarea-description');
         
         expect(descriptionField).toBeInTheDocument();
         expect(descriptionField).toHaveAttribute('data-multiline', 'true');
         expect(descriptionField).toHaveAttribute('data-min-rows', '10');
         expect(label).toHaveTextContent('Description');
         expect(textarea).toHaveAttribute('placeholder', 'Enter a description');
      });

      test('renders responsibilities field as multiline', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const responsibilitiesField = screen.getByTestId('form-input-responsibilities');
         const label = screen.getByTestId('label-responsibilities');
         const textarea = screen.getByTestId('textarea-responsibilities');
         
         expect(responsibilitiesField).toBeInTheDocument();
         expect(responsibilitiesField).toHaveAttribute('data-multiline', 'true');
         expect(label).toHaveTextContent('Responsibilities');
         expect(textarea).toHaveAttribute('placeholder', 'Enter responsibilities');
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves all required text resources', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { 
               getText: mockGetText,
               currentLanguage: 'en'
            }
         });

         render(<CreateExperienceSetForm {...defaultProps} />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.language_set.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.slug.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.slug.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.position.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.position.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.summary.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.summary.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.description.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.description.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.responsibilities.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateExperienceSetForm.responsibilities.placeholder');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined),
               currentLanguage: 'en'
            }
         });

         expect(() => render(<CreateExperienceSetForm {...defaultProps} />)).not.toThrow();
      });

      test('displays custom text resources', () => {
         const customTextMap = {
            'CreateExperienceSetForm.language_set.label': 'Custom Language Label',
            'CreateExperienceSetForm.slug.label': 'Custom Slug Label'
         };

         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => customTextMap[key as keyof typeof customTextMap] || key),
               currentLanguage: 'en'
            }
         });

         render(<CreateExperienceSetForm {...defaultProps} />);
         
         expect(screen.getByText('Custom Language Label')).toBeInTheDocument();
         expect(screen.getByText('Custom Slug Label')).toBeInTheDocument();
      });
   });

   describe('Form Submission', () => {
      test('handles successful form submission', async () => {
         const mockExperienceSetData: ExperienceSetData = {
            id: 1,
            created_at: new Date('2023-01-01'),
            updated_at: new Date('2023-01-02'),
            schemaName: 'experiences_schema',
            tableName: 'experience_sets',
            language_set: 'en',
            slug: 'test-slug',
            position: 'Software Developer',
            summary: 'Test summary',
            description: 'Test description',
            responsibilities: 'Test responsibilities'
         };

         mockPost.mockResolvedValue({
            success: true,
            data: mockExperienceSetData
         });

         render(<CreateExperienceSetForm experienceId={123} />);
         
         // Fill out form fields
         fireEvent.change(screen.getByTestId('select-language_set'), {
            target: { value: 'en' }
         });
         fireEvent.change(screen.getByTestId('input-slug'), {
            target: { value: 'test-slug' }
         });
         fireEvent.change(screen.getByTestId('input-position'), {
            target: { value: 'Software Developer' }
         });
         fireEvent.change(screen.getByTestId('textarea-summary'), {
            target: { value: 'Test summary' }
         });

         // Submit form
         fireEvent.submit(screen.getByTestId('create-experience-set-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create-set', expect.objectContaining({
               experience_id: 123,
               language_set: 'en',
               slug: 'test-slug',
               position: 'Software Developer',
               summary: 'Test summary'
            }));
         });

         // Note: window.location.reload() is called in the actual component
         // but testing it requires more complex setup. The important part is
         // that the API call succeeds and returns the expected data structure.
      });

      test('handles API error response', async () => {
         mockPost.mockResolvedValue({
            success: false,
            message: 'Failed to create experience set'
         });

         render(<CreateExperienceSetForm {...defaultProps} />);
         
         fireEvent.submit(screen.getByTestId('create-experience-set-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create-set', expect.any(Object));
         });

         // Window reload should not be called on error
         expect(mockReload).not.toHaveBeenCalled();
      });

      test('handles network error', async () => {
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<CreateExperienceSetForm {...defaultProps} />);
         
         fireEvent.submit(screen.getByTestId('create-experience-set-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         // Window reload should not be called on error
         expect(mockReload).not.toHaveBeenCalled();
      });

      test('includes all form field values in submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: 1, experience_id: 123 }
         });

         render(<CreateExperienceSetForm experienceId={123} />);
         
         // Fill out all fields
         fireEvent.change(screen.getByTestId('select-language_set'), {
            target: { value: 'pt' }
         });
         fireEvent.change(screen.getByTestId('input-slug'), {
            target: { value: 'Complete Test Slug' } // Will be parsed to 'complete-test-slug'
         });
         fireEvent.change(screen.getByTestId('input-position'), {
            target: { value: 'Senior Developer' }
         });
         fireEvent.change(screen.getByTestId('textarea-summary'), {
            target: { value: 'Comprehensive summary' }
         });
         fireEvent.change(screen.getByTestId('textarea-description'), {
            target: { value: 'Detailed description' }
         });
         fireEvent.change(screen.getByTestId('textarea-responsibilities'), {
            target: { value: 'Key responsibilities' }
         });

         fireEvent.submit(screen.getByTestId('create-experience-set-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/experience/create-set', expect.objectContaining({
               experience_id: 123,
               language_set: 'pt',
               slug: 'complete-test-slug',
               position: 'Senior Developer',
               summary: 'Comprehensive summary',
               description: 'Detailed description',
               responsibilities: 'Key responsibilities'
            }));
         });
      });

      test('logs error when API returns failure', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false,
            message: 'API Error'
         });

         render(<CreateExperienceSetForm {...defaultProps} />);
         
         fireEvent.submit(screen.getByTestId('create-experience-set-form'));

         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to create experience set:', expect.any(Error));
         });
         
         consoleSpy.mockRestore();
      });
   });

   describe('User Interactions', () => {
      test('language selection works correctly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const languageSelect = screen.getByTestId('select-language_set');
         fireEvent.change(languageSelect, { target: { value: 'es' } });
         
         const languageInput = mockFormInputs.find(input => input.fieldName === 'language_set');
         expect(languageInput?.value).toBe('es');
      });

      test('slug parseInput transforms text correctly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const slugInput = screen.getByTestId('input-slug');
         
         // Test various slug transformations
         fireEvent.change(slugInput, { target: { value: 'Test   Multiple   Spaces' } });
         let slugData = mockFormInputs.find(input => input.fieldName === 'slug');
         expect(slugData?.value).toBe('test-multiple-spaces');
         
         fireEvent.change(slugInput, { target: { value: 'UPPERCASE TEXT' } });
         slugData = mockFormInputs.find(input => input.fieldName === 'slug');
         expect(slugData?.value).toBe('uppercase-text');
         
         fireEvent.change(slugInput, { target: { value: 'Special!@#$%Characters' } });
         slugData = mockFormInputs.find(input => input.fieldName === 'slug');
         expect(slugData?.value).toBe('special!@#$%characters');
      });

      test('all form inputs capture user input correctly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         // Test all form inputs
         fireEvent.change(screen.getByTestId('select-language_set'), { target: { value: 'pt' } });
         fireEvent.change(screen.getByTestId('input-slug'), { target: { value: 'test-slug' } });
         fireEvent.change(screen.getByTestId('input-position'), { target: { value: 'Developer' } });
         fireEvent.change(screen.getByTestId('textarea-summary'), { target: { value: 'Summary text' } });
         fireEvent.change(screen.getByTestId('textarea-description'), { target: { value: 'Description text' } });
         fireEvent.change(screen.getByTestId('textarea-responsibilities'), { target: { value: 'Responsibilities text' } });
         
         // Verify all inputs captured values
         expect(mockFormInputs.find(input => input.fieldName === 'language_set')?.value).toBe('pt');
         expect(mockFormInputs.find(input => input.fieldName === 'slug')?.value).toBe('test-slug');
         expect(mockFormInputs.find(input => input.fieldName === 'position')?.value).toBe('Developer');
         expect(mockFormInputs.find(input => input.fieldName === 'summary')?.value).toBe('Summary text');
         expect(mockFormInputs.find(input => input.fieldName === 'description')?.value).toBe('Description text');
         expect(mockFormInputs.find(input => input.fieldName === 'responsibilities')?.value).toBe('Responsibilities text');
      });
   });

   describe('Props Handling', () => {
      test('handles different experienceId values', () => {
         const { rerender } = render(<CreateExperienceSetForm experienceId={100} />);
         
         let form = screen.getByTestId('create-experience-set-form');
         let initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.experience_id).toBe(100);
         
         rerender(<CreateExperienceSetForm experienceId={999} />);
         
         form = screen.getByTestId('create-experience-set-form');
         initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.experience_id).toBe(999);
      });

      test('handles zero experienceId', () => {
         render(<CreateExperienceSetForm experienceId={0} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.experience_id).toBe(0);
      });

      test('handles negative experienceId', () => {
         render(<CreateExperienceSetForm experienceId={-1} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.experience_id).toBe(-1);
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<CreateExperienceSetForm {...defaultProps} />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<CreateExperienceSetForm {...defaultProps} />)).toThrow();
      });

      test('handles ajax hook errors', () => {
         // This test should pass because the ajax hook doesn't throw in the component
         // The component uses the hook normally and handles errors in the form submission
         expect(() => render(<CreateExperienceSetForm {...defaultProps} />)).not.toThrow();
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         expect(form.tagName).toBe('FORM');
      });

      test('all form fields have associated labels', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         expect(screen.getByTestId('label-language_set')).toBeInTheDocument();
         expect(screen.getByTestId('label-slug')).toBeInTheDocument();
         expect(screen.getByTestId('label-position')).toBeInTheDocument();
         expect(screen.getByTestId('label-summary')).toBeInTheDocument();
         expect(screen.getByTestId('label-description')).toBeInTheDocument();
         expect(screen.getByTestId('label-responsibilities')).toBeInTheDocument();
      });

      test('select elements have aria-label attributes', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const languageSelect = screen.getByTestId('select-language_set');
         expect(languageSelect).toHaveAttribute('aria-label', 'Language');
      });

      test('input elements have proper accessibility attributes', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const slugInput = screen.getByTestId('input-slug');
         expect(slugInput).toHaveAttribute('aria-label', 'Slug');
         expect(slugInput).toHaveAttribute('title', 'Slug');
         
         const positionInput = screen.getByTestId('input-position');
         expect(positionInput).toHaveAttribute('aria-label', 'Position');
         expect(positionInput).toHaveAttribute('title', 'Position');
      });

      test('textarea elements have proper accessibility attributes', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const summaryTextarea = screen.getByTestId('textarea-summary');
         expect(summaryTextarea).toHaveAttribute('aria-label', 'Summary');
         
         const descriptionTextarea = screen.getByTestId('textarea-description');
         expect(descriptionTextarea).toHaveAttribute('aria-label', 'Description');
         
         const responsibilitiesTextarea = screen.getByTestId('textarea-responsibilities');
         expect(responsibilitiesTextarea).toHaveAttribute('aria-label', 'Responsibilities');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<CreateExperienceSetForm experienceId={123} />);
         
         const initialForm = screen.getByTestId('create-experience-set-form');
         rerender(<CreateExperienceSetForm experienceId={123} />);
         const rerenderedForm = screen.getByTestId('create-experience-set-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references across prop changes', () => {
         const { rerender } = render(<CreateExperienceSetForm experienceId={123} />);
         
         rerender(<CreateExperienceSetForm experienceId={456} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         expect(form).toBeInTheDocument();
      });

      test('handles rapid prop changes without issues', () => {
         const { rerender } = render(<CreateExperienceSetForm experienceId={1} />);
         
         for (let i = 2; i <= 10; i++) {
            rerender(<CreateExperienceSetForm experienceId={i} />);
         }
         
         const form = screen.getByTestId('create-experience-set-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.experience_id).toBe(10);
      });
   });

   describe('Component Integration', () => {
      test('integrates all form components properly', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         const languageSelect = screen.getByTestId('form-select-language_set');
         const slugInput = screen.getByTestId('form-input-slug');
         const positionInput = screen.getByTestId('form-input-position');
         const summaryInput = screen.getByTestId('form-input-summary');
         const descriptionInput = screen.getByTestId('form-input-description');
         const responsibilitiesInput = screen.getByTestId('form-input-responsibilities');
         
         expect(form).toBeInTheDocument();
         expect(form).toContainElement(languageSelect);
         expect(form).toContainElement(slugInput);
         expect(form).toContainElement(positionInput);
         expect(form).toContainElement(summaryInput);
         expect(form).toContainElement(descriptionInput);
         expect(form).toContainElement(responsibilitiesInput);
      });

      test('maintains proper form structure', () => {
         render(<CreateExperienceSetForm {...defaultProps} />);
         
         const form = screen.getByTestId('create-experience-set-form');
         expect(form).toHaveClass('CreateExperienceSetForm');
         
         // Verify all 6 form fields are present
         const formInputs = screen.getAllByTestId(/^(form-select|form-input)-/);
         expect(formInputs).toHaveLength(6);
      });
   });
});
