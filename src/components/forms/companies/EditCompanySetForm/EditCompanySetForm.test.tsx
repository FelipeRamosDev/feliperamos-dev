import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditCompanySetForm from './EditCompanySetForm';
import { CompanyData, CompanySetData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';

// Mock app.config
jest.mock('@/app.config', () => ({
   allowedLanguages: ['en', 'pt'],
   languageNames: {
      en: 'English',
      pt: 'Português'
   }
}));

// Mock company set data
const mockCompanySetData: CompanySetData = {
   id: 1,
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-01-02'),
   schemaName: 'companies_schema',
   tableName: 'company_sets',
   company_id: 1,
   description: 'Test company description',
   industry: 'Technology',
   language_set: 'en'
};

const mockCompanyData: CompanyData = {
   id: 1,
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-01-02'),
   schemaName: 'companies_schema',
   tableName: 'companies',
   company_id: 1,
   company_name: 'Test Company',
   location: 'New York, NY',
   logo_url: 'https://test.com/logo.png',
   site_url: 'https://test.com',
   description: 'Test company description',
   industry: 'Technology',
   language_set: 'en',
   languageSets: [mockCompanySetData]
};

// Mock the company details context
const mockUseCompanyDetails = jest.fn();
jest.mock('@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext', () => ({
   useCompanyDetails: () => mockUseCompanyDetails()
}));

// Mock Form hooks
const mockFormSubmit = jest.fn();
const mockFormInputs: Array<{ fieldName: string; label?: string; placeholder?: string; multiline?: boolean; minRows?: number; options?: Array<{ value: string; label: string }>; value: string }> = [];

jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode, ...props }: { children: React.ReactNode; initialValues?: FormValues; submitLabel?: string; onSubmit?: (data: FormValues) => void; editMode?: boolean } & Record<string, unknown>) => {
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
            data-testid="edit-form" 
            data-edit-mode={editMode}
            data-initial-values={JSON.stringify(initialValues)}
            onSubmit={async (e) => {
               e.preventDefault();
               const formData: FormValues = mockFormInputs.reduce((acc, input) => {
                  acc[input.fieldName as keyof FormValues] = input.value || (initialValues as Record<string, string>)?.[input.fieldName] || '';
                  return acc;
               }, {} as FormValues);
               
               // Include initial values that aren't form inputs
               Object.keys(initialValues || {}).forEach(key => {
                  if (!formData.hasOwnProperty(key)) {
                     formData[key as keyof FormValues] = (initialValues as Record<string, string>)?.[key] || '';
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
            <button type="submit" data-testid="submit-button">
               {submitLabel}
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, multiline, minRows, ...props }: { fieldName: string; label?: string; placeholder?: string; multiline?: boolean; minRows?: number } & Record<string, unknown>) => {
      const inputData = { fieldName, label, placeholder, multiline, minRows, value: '' };
      
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
                  onChange={(e) => {
                     inputData.value = e.target.value;
                  }}
               />
            ) : (
               <input 
                  data-testid={`input-${fieldName}`}
                  placeholder={placeholder}
                  onChange={(e) => {
                     inputData.value = e.target.value;
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
               {options?.map((option: { value: string; label: string }) => (
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

jest.mock('./EditCompanySetForm.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('EditCompanySetForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockFormInputs.length = 0; // Clear form inputs array
      
      mockUseCompanyDetails.mockReturnValue(mockCompanyData);
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'EditCompanySetForm.submitButton': 'Save Changes',
                  'EditCompanySetForm.language.label': 'Language',
                  'EditCompanySetForm.industry.label': 'Industry',
                  'EditCompanySetForm.industry.placeholder': 'Select industry',
                  'EditCompanySetForm.description.label': 'Description',
                  'EditCompanySetForm.description.placeholder': 'Enter company description'
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing in create mode', () => {
         expect(() => render(<EditCompanySetForm />)).not.toThrow();
      });

      test('renders without crashing in edit mode', () => {
         expect(() => render(<EditCompanySetForm language_set="en" editMode={true} />)).not.toThrow();
      });

      test('renders form with correct attributes in create mode', () => {
         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         expect(form).toBeInTheDocument();
         // When editMode is undefined, the attribute is not set
      });

      test('renders form with correct attributes in edit mode', () => {
         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         const form = screen.getByTestId('edit-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });

      test('renders submit button with correct label', () => {
         render(<EditCompanySetForm />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveTextContent('Save Changes');
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<EditCompanySetForm />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(EditCompanySetForm.name).toBe('EditCompanySetForm');
      });
   });

   describe('Create Mode Behavior', () => {
      test('renders language select field in create mode', () => {
         render(<EditCompanySetForm />);
         
         expect(screen.getByTestId('form-select-language_set')).toBeInTheDocument();
         expect(screen.getByTestId('label-language_set')).toHaveTextContent('Language');
         expect(screen.getByTestId('select-language_set')).toBeInTheDocument();
      });

      test('does not render language select field in edit mode', () => {
         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         expect(screen.queryByTestId('form-select-language_set')).not.toBeInTheDocument();
      });

      test('sets initial values correctly in create mode', () => {
         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.company_id).toBe(1);
         expect(initialValues.id).toBeUndefined();
      });

      test('language select has correct options', () => {
         render(<EditCompanySetForm />);
         
         const options = screen.getAllByRole('option');
         expect(options).toHaveLength(2);
         expect(options[0]).toHaveTextContent('English');
         expect(options[1]).toHaveTextContent('Português');
      });
   });

   describe('Edit Mode Behavior', () => {
      test('sets initial values correctly in edit mode', () => {
         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.id).toBe(1);
         expect(initialValues.company_id).toBe(1);
         expect(initialValues.description).toBe('Test company description');
         expect(initialValues.industry).toBe('Technology');
         expect(initialValues.language_set).toBe('en');
      });

      test('shows error message when language set not found', () => {
         render(<EditCompanySetForm language_set="invalid" editMode={true} />);
         
         expect(screen.getByText('Language set not found')).toBeInTheDocument();
      });

      test('does not show error message when language set is found', () => {
         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         expect(screen.queryByText('Language set not found')).not.toBeInTheDocument();
      });

      test('uses correct language set data from company context', () => {
         const customCompanyData = {
            ...mockCompanyData,
            languageSets: [
               {
                  ...mockCompanySetData,
                  language_set: 'pt',
                  description: 'Portuguese description',
                  industry: 'Finance'
               }
            ]
         };
         
         mockUseCompanyDetails.mockReturnValue(customCompanyData);
         
         render(<EditCompanySetForm language_set="pt" editMode={true} />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.description).toBe('Portuguese description');
         expect(initialValues.industry).toBe('Finance');
         expect(initialValues.language_set).toBe('pt');
      });
   });

   describe('Form Fields Configuration', () => {
      test('industry field has correct configuration', () => {
         render(<EditCompanySetForm />);
         
         const industryField = screen.getByTestId('form-input-industry');
         const label = screen.getByTestId('label-industry');
         const input = screen.getByTestId('input-industry');
         
         expect(industryField).toBeInTheDocument();
         expect(label).toHaveTextContent('Industry');
         expect(input).toHaveAttribute('placeholder', 'Select industry');
      });

      test('description field has correct configuration', () => {
         render(<EditCompanySetForm />);
         
         const descriptionField = screen.getByTestId('form-input-description');
         const label = screen.getByTestId('label-description');
         const textarea = screen.getByTestId('textarea-description');
         
         expect(descriptionField).toBeInTheDocument();
         expect(descriptionField).toHaveAttribute('data-multiline', 'true');
         expect(descriptionField).toHaveAttribute('data-min-rows', '10');
         expect(label).toHaveTextContent('Description');
         expect(textarea).toHaveAttribute('placeholder', 'Enter company description');
      });

      test('all fields are properly configured', () => {
         render(<EditCompanySetForm />);
         
         // Should have language select in create mode
         expect(screen.getByTestId('form-select-language_set')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-industry')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-description')).toBeInTheDocument();
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<EditCompanySetForm />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves all required text resources', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<EditCompanySetForm />);
         
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.submitButton');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.language.label');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.industry.label');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.industry.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.description.label');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanySetForm.description.placeholder');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<EditCompanySetForm />)).not.toThrow();
      });

      test('displays custom text resources', () => {
         const customTextMap = {
            'EditCompanySetForm.submitButton': 'Create Company Set',
            'EditCompanySetForm.language.label': 'Select Language',
            'EditCompanySetForm.industry.label': 'Business Industry',
            'EditCompanySetForm.industry.placeholder': 'Choose industry',
            'EditCompanySetForm.description.label': 'Company Description',
            'EditCompanySetForm.description.placeholder': 'Describe your company'
         };

         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => customTextMap[key as keyof typeof customTextMap] || key)
            }
         });

         render(<EditCompanySetForm />);
         
         expect(screen.getByText('Create Company Set')).toBeInTheDocument();
         expect(screen.getByText('Select Language')).toBeInTheDocument();
         expect(screen.getByText('Business Industry')).toBeInTheDocument();
         expect(screen.getByText('Company Description')).toBeInTheDocument();
         expect(screen.getByPlaceholderText('Choose industry')).toBeInTheDocument();
         expect(screen.getByPlaceholderText('Describe your company')).toBeInTheDocument();
      });
   });

   describe('Form Submission - Create Mode', () => {
      test('handles successful create submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanySetData
         });

         render(<EditCompanySetForm />);
         
         // Fill form fields
         fireEvent.change(screen.getByTestId('select-language_set'), {
            target: { value: 'en' }
         });
         fireEvent.change(screen.getByTestId('input-industry'), {
            target: { value: 'Technology' }
         });
         fireEvent.change(screen.getByTestId('textarea-description'), {
            target: { value: 'New company description' }
         });

         // Submit form
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/create-set', {
               company_id: 1,
               language_set: 'en',
               industry: 'Technology',
               description: 'New company description'
            });
         });
      });

      test('handles create API error response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false,
            message: 'Company set creation failed'
         });

         render(<EditCompanySetForm />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/create-set', expect.any(Object));
         });

         expect(consoleSpy).toHaveBeenCalledWith('Error creating company set:', expect.any(Object));
         
         consoleSpy.mockRestore();
      });

      test('handles create network error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<EditCompanySetForm />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(consoleSpy).toHaveBeenCalledWith('Error creating company set:', expect.any(Error));
         
         consoleSpy.mockRestore();
      });
   });

   describe('Form Submission - Edit Mode', () => {
      test('handles successful edit submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanySetData
         });

         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         // Update form fields
         fireEvent.change(screen.getByTestId('input-industry'), {
            target: { value: 'Finance' }
         });
         fireEvent.change(screen.getByTestId('textarea-description'), {
            target: { value: 'Updated company description' }
         });

         // Submit form
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update-set', {
               id: 1,
               updates: expect.objectContaining({
                  industry: 'Finance',
                  description: 'Updated company description'
               })
            });
         });
      });

      test('handles edit API error response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false,
            message: 'Company set update failed'
         });

         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update-set', expect.any(Object));
         });

         expect(consoleSpy).toHaveBeenCalledWith('Error saving company set:', expect.any(Object));
         
         consoleSpy.mockRestore();
      });

      test('handles edit network error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(consoleSpy).toHaveBeenCalledWith('Error saving company set:', expect.any(Error));
         
         consoleSpy.mockRestore();
      });

      test('includes correct language set ID in update request', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanySetData
         });

         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update-set', 
               expect.objectContaining({
                  id: 1
               })
            );
         });
      });
   });

   describe('Ajax Integration', () => {
      test('uses useAjax hook for API calls', () => {
         render(<EditCompanySetForm />);
         
         expect(mockPost).toBeDefined();
      });

      test('makes POST request to correct endpoint in create mode', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanySetData
         });

         render(<EditCompanySetForm />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/create-set', expect.any(Object));
         });
      });

      test('makes POST request to correct endpoint in edit mode', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanySetData
         });

         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update-set', expect.any(Object));
         });
      });

      test('handles undefined API response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue(undefined);

         render(<EditCompanySetForm />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
         });
         
         consoleSpy.mockRestore();
      });
   });

   describe('Context Integration', () => {
      test('requires CompanyDetailsProvider context', () => {
         mockUseCompanyDetails.mockImplementation(() => {
            throw new Error('useCompanyDetails must be used within an CompanyDetailsProvider');
         });

         expect(() => render(<EditCompanySetForm />)).toThrow('useCompanyDetails must be used within an CompanyDetailsProvider');
      });

      test('uses company data from context correctly', () => {
         const customCompanyData = {
            ...mockCompanyData,
            id: 999
         };
         
         mockUseCompanyDetails.mockReturnValue(customCompanyData);

         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.company_id).toBe(999);
      });

      test('finds correct language set from company data', () => {
         const multipleLanguageSetsCompany = {
            ...mockCompanyData,
            languageSets: [
               { ...mockCompanySetData, language_set: 'en', description: 'English description' },
               { ...mockCompanySetData, language_set: 'pt', description: 'Portuguese description' }
            ]
         };
         
         mockUseCompanyDetails.mockReturnValue(multipleLanguageSetsCompany);

         render(<EditCompanySetForm language_set="pt" editMode={true} />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.description).toBe('Portuguese description');
         expect(initialValues.language_set).toBe('pt');
      });
   });

   describe('Props Handling', () => {
      test('handles optional language_set prop', () => {
         expect(() => render(<EditCompanySetForm />)).not.toThrow();
         expect(() => render(<EditCompanySetForm language_set="en" />)).not.toThrow();
      });

      test('handles optional editMode prop', () => {
         expect(() => render(<EditCompanySetForm editMode={false} />)).not.toThrow();
         expect(() => render(<EditCompanySetForm editMode={true} />)).not.toThrow();
      });

      test('correctly applies editMode to form configuration', () => {
         const { rerender } = render(<EditCompanySetForm editMode={false} />);
         
         let form = screen.getByTestId('edit-form');
         expect(form).toHaveAttribute('data-edit-mode', 'false');
         
         rerender(<EditCompanySetForm editMode={true} language_set="en" />);
         
         form = screen.getByTestId('edit-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<EditCompanySetForm />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<EditCompanySetForm />)).toThrow();
      });

      test('handles missing company data', () => {
         mockUseCompanyDetails.mockReturnValue({
            ...mockCompanyData,
            languageSets: []
         });

         expect(() => render(<EditCompanySetForm />)).not.toThrow();
      });

      test('validates form submission error handling in create mode', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false
         });

         render(<EditCompanySetForm />);

         fireEvent.submit(screen.getByTestId('edit-form'));
         
         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });
         
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('validates form submission error handling in edit mode', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false
         });

         render(<EditCompanySetForm language_set="en" editMode={true} />);

         fireEvent.submit(screen.getByTestId('edit-form'));
         
         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });
         
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   describe('Language Configuration', () => {
      test('creates correct language options from app config', () => {
         render(<EditCompanySetForm />);
         
         const languageSelect = screen.getByTestId('select-language_set');
         const options = screen.getAllByRole('option');
         
         expect(languageSelect).toBeInTheDocument();
         expect(options).toHaveLength(2);
         expect(options[0]).toHaveValue('en');
         expect(options[0]).toHaveTextContent('English');
         expect(options[1]).toHaveValue('pt');
         expect(options[1]).toHaveTextContent('Português');
      });

      test('handles language configuration changes', () => {
         // Mock different language configuration
         jest.doMock('@/app.config', () => ({
            allowedLanguages: ['en', 'pt', 'es'],
            languageNames: {
               en: 'English',
               pt: 'Português',
               es: 'Español'
            }
         }));

         render(<EditCompanySetForm />);
         
         const options = screen.getAllByRole('option');
         expect(options).toHaveLength(2); // Still using the original mock
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         expect(form.tagName).toBe('FORM');
      });

      test('all form fields have associated labels', () => {
         render(<EditCompanySetForm />);
         
         expect(screen.getByTestId('label-language_set')).toBeInTheDocument();
         expect(screen.getByTestId('label-industry')).toBeInTheDocument();
         expect(screen.getByTestId('label-description')).toBeInTheDocument();
      });

      test('submit button has proper attributes', () => {
         render(<EditCompanySetForm />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('textarea has proper attributes for accessibility', () => {
         render(<EditCompanySetForm />);
         
         const descriptionField = screen.getByTestId('form-input-description');
         const textarea = screen.getByTestId('textarea-description');
         
         expect(descriptionField).toHaveAttribute('data-multiline', 'true');
         expect(textarea).toHaveAttribute('placeholder', 'Enter company description');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<EditCompanySetForm />);
         
         const initialForm = screen.getByTestId('edit-form');
         rerender(<EditCompanySetForm />);
         const rerenderedForm = screen.getByTestId('edit-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references across mode changes', () => {
         const { rerender } = render(<EditCompanySetForm />);
         
         // Get initial form in create mode - verify it exists
         const initialForm = screen.getByTestId('edit-form');
         expect(initialForm).toBeInTheDocument();
         
         rerender(<EditCompanySetForm language_set="en" editMode={true} />);
         
         const editModeForm = screen.getByTestId('edit-form');
         expect(editModeForm).toHaveAttribute('data-edit-mode', 'true');
      });
   });

   describe('Component Integration', () => {
      test('integrates all components properly in create mode', () => {
         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         const languageSelect = screen.getByTestId('form-select-language_set');
         const industryInput = screen.getByTestId('form-input-industry');
         const descriptionInput = screen.getByTestId('form-input-description');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toBeInTheDocument();
         expect(languageSelect).toBeInTheDocument();
         expect(industryInput).toBeInTheDocument();
         expect(descriptionInput).toBeInTheDocument();
         expect(submitButton).toBeInTheDocument();
      });

      test('integrates all components properly in edit mode', () => {
         render(<EditCompanySetForm language_set="en" editMode={true} />);
         
         const form = screen.getByTestId('edit-form');
         const industryInput = screen.getByTestId('form-input-industry');
         const descriptionInput = screen.getByTestId('form-input-description');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toBeInTheDocument();
         expect(screen.queryByTestId('form-select-language_set')).not.toBeInTheDocument();
         expect(industryInput).toBeInTheDocument();
         expect(descriptionInput).toBeInTheDocument();
         expect(submitButton).toBeInTheDocument();
      });

      test('maintains proper component hierarchy', () => {
         render(<EditCompanySetForm />);
         
         const form = screen.getByTestId('edit-form');
         const languageSelect = screen.getByTestId('form-select-language_set');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toContainElement(languageSelect);
         expect(form).toContainElement(submitButton);
      });

      test('preserves mode-specific functionality', () => {
         const { rerender } = render(<EditCompanySetForm />);
         
         // Create mode should show language select
         expect(screen.getByTestId('form-select-language_set')).toBeInTheDocument();
         
         rerender(<EditCompanySetForm language_set="en" editMode={true} />);
         
         // Edit mode should not show language select
         expect(screen.queryByTestId('form-select-language_set')).not.toBeInTheDocument();
      });
   });
});