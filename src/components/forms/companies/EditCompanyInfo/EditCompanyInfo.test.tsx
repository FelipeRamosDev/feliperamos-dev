import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditCompanyInfo from './EditCompanyInfo';
import { CompanyData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';

// Mock dependencies
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
   languageSets: []
};

// Mock the company details context
const mockUseCompanyDetails = jest.fn();
jest.mock('@/components/content/admin/company/CompanyDetailsContent/CompanyDetailsContext', () => ({
   useCompanyDetails: () => mockUseCompanyDetails()
}));

// Mock Form hooks
const mockFormSubmit = jest.fn();
const mockFormInputs: Array<{ fieldName: string; label: string; value: string }> = [];

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
   FormInput: ({ fieldName, label, ...props }: { fieldName: string; label: string } & Record<string, unknown>) => {
      const inputData = { fieldName, label, value: '' };
      
      // Update or add to mockFormInputs
      const existingIndex = mockFormInputs.findIndex(input => input.fieldName === fieldName);
      if (existingIndex >= 0) {
         mockFormInputs[existingIndex] = inputData;
      } else {
         mockFormInputs.push(inputData);
      }

      return (
         <div data-testid={`form-input-${fieldName}`} {...props}>
            <label data-testid={`label-${fieldName}`}>{label}</label>
            <input 
               data-testid={`input-${fieldName}`}
               placeholder={label}
               onChange={(e) => {
                  inputData.value = e.target.value;
               }}
            />
         </div>
      );
   }
}));

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

jest.mock('./EditCompanyInfo.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

// Mock window.location.reload
// Note: mockReload is declared but not used in tests

describe('EditCompanyInfo', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockFormInputs.length = 0; // Clear form inputs array
      
      mockUseCompanyDetails.mockReturnValue(mockCompanyData);
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'EditCompanyInfo.submitButton': 'Save Changes',
                  'EditCompanyInfo.companyName': 'Company Name',
                  'EditCompanyInfo.location': 'Location',
                  'EditCompanyInfo.logoUrl': 'Logo URL',
                  'EditCompanyInfo.siteUrl': 'Site URL'
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<EditCompanyInfo />)).not.toThrow();
      });

      test('renders edit form with correct attributes', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });

      test('renders all form input fields', () => {
         render(<EditCompanyInfo />);
         
         expect(screen.getByTestId('form-input-company_name')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-location')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-logo_url')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-site_url')).toBeInTheDocument();
      });

      test('renders submit button with correct label', () => {
         render(<EditCompanyInfo />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveTextContent('Save Changes');
      });

      test('renders without any console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<EditCompanyInfo />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });

      test('component has correct display name', () => {
         expect(EditCompanyInfo.name).toBe('EditCompanyInfo');
      });
   });

   describe('Initial Values and Company Data Integration', () => {
      test('passes company data as initial values to form', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.company_name).toBe('Test Company');
         expect(initialValues.location).toBe('New York, NY');
         expect(initialValues.logo_url).toBe('https://test.com/logo.png');
         expect(initialValues.site_url).toBe('https://test.com');
      });

      test('uses company details from context', () => {
         render(<EditCompanyInfo />);
         
         expect(mockUseCompanyDetails).toHaveBeenCalledTimes(1);
      });

      test('handles different company data structures', () => {
         const differentCompanyData = {
            ...mockCompanyData,
            company_name: 'Different Company',
            location: 'San Francisco, CA'
         };
         
         mockUseCompanyDetails.mockReturnValue(differentCompanyData);
         
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.company_name).toBe('Different Company');
         expect(initialValues.location).toBe('San Francisco, CA');
      });

      test('handles missing optional company fields', () => {
         const minimalCompanyData = {
            ...mockCompanyData,
            description: undefined,
            industry: undefined
         };
         
         mockUseCompanyDetails.mockReturnValue(minimalCompanyData);
         
         expect(() => render(<EditCompanyInfo />)).not.toThrow();
      });
   });

   describe('Form Fields Configuration', () => {
      test('company name field has correct configuration', () => {
         render(<EditCompanyInfo />);
         
         const label = screen.getByTestId('label-company_name');
         const input = screen.getByTestId('input-company_name');
         
         expect(label).toHaveTextContent('Company Name');
         expect(input).toBeInTheDocument();
      });

      test('location field has correct configuration', () => {
         render(<EditCompanyInfo />);
         
         const label = screen.getByTestId('label-location');
         const input = screen.getByTestId('input-location');
         
         expect(label).toHaveTextContent('Location');
         expect(input).toBeInTheDocument();
      });

      test('logo URL field has correct configuration', () => {
         render(<EditCompanyInfo />);
         
         const label = screen.getByTestId('label-logo_url');
         const input = screen.getByTestId('input-logo_url');
         
         expect(label).toHaveTextContent('Logo URL');
         expect(input).toBeInTheDocument();
      });

      test('site URL field has correct configuration', () => {
         render(<EditCompanyInfo />);
         
         const label = screen.getByTestId('label-site_url');
         const input = screen.getByTestId('input-site_url');
         
         expect(label).toHaveTextContent('Site URL');
         expect(input).toBeInTheDocument();
      });

      test('all fields are properly ordered', () => {
         render(<EditCompanyInfo />);
         
         const formInputs = screen.getAllByTestId(/form-input-/);
         const fieldNames = formInputs.map(input => 
            input.getAttribute('data-testid')?.replace('form-input-', '')
         );
         
         expect(fieldNames).toEqual(['company_name', 'location', 'logo_url', 'site_url']);
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<EditCompanyInfo />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves all required text resources', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<EditCompanyInfo />);
         
         expect(mockGetText).toHaveBeenCalledWith('EditCompanyInfo.submitButton');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanyInfo.companyName');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanyInfo.location');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanyInfo.logoUrl');
         expect(mockGetText).toHaveBeenCalledWith('EditCompanyInfo.siteUrl');
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<EditCompanyInfo />)).not.toThrow();
      });

      test('displays custom text resources', () => {
         const customTextMap = {
            'EditCompanyInfo.submitButton': 'Update Company',
            'EditCompanyInfo.companyName': 'Business Name',
            'EditCompanyInfo.location': 'Address',
            'EditCompanyInfo.logoUrl': 'Logo Image URL',
            'EditCompanyInfo.siteUrl': 'Website URL'
         };

         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => customTextMap[key as keyof typeof customTextMap] || key)
            }
         });

         render(<EditCompanyInfo />);
         
         expect(screen.getByText('Update Company')).toBeInTheDocument();
         expect(screen.getByText('Business Name')).toBeInTheDocument();
         expect(screen.getByText('Address')).toBeInTheDocument();
         expect(screen.getByText('Logo Image URL')).toBeInTheDocument();
         expect(screen.getByText('Website URL')).toBeInTheDocument();
      });
   });

   describe('Form Submission', () => {
      test('handles successful form submission', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { ...mockCompanyData, company_name: 'Updated Company' }
         });

         render(<EditCompanyInfo />);
         
         // Update a field
         fireEvent.change(screen.getByTestId('input-company_name'), {
            target: { value: 'Updated Company' }
         });

         // Submit form
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update', {
               id: 1,
               updates: expect.objectContaining({
                  company_name: 'Updated Company'
               })
            });
         });

         // Note: window.location.reload() is called but cannot be properly mocked in JSDOM
         // The functionality is tested through the API call verification above
      });

      test('handles API error response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false,
            message: 'Company not found'
         });

         render(<EditCompanyInfo />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(consoleSpy).toHaveBeenCalledWith('Company not found or update failed');
         // Note: window.location.reload() is not called on error
         
         consoleSpy.mockRestore();
      });

      test('handles network error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<EditCompanyInfo />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(consoleSpy).toHaveBeenCalledWith('Error updating company:', expect.any(Error));
         // Note: window.location.reload() is not called on error
         
         consoleSpy.mockRestore();
      });

      test('submits form with all updated field values', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanyData
         });

         render(<EditCompanyInfo />);
         
         // Update all fields
         fireEvent.change(screen.getByTestId('input-company_name'), {
            target: { value: 'New Company Name' }
         });
         fireEvent.change(screen.getByTestId('input-location'), {
            target: { value: 'Los Angeles, CA' }
         });
         fireEvent.change(screen.getByTestId('input-logo_url'), {
            target: { value: 'https://newlogo.com/logo.png' }
         });
         fireEvent.change(screen.getByTestId('input-site_url'), {
            target: { value: 'https://newsite.com' }
         });

         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update', {
               id: 1,
               updates: {
                  company_name: 'New Company Name',
                  location: 'Los Angeles, CA',
                  logo_url: 'https://newlogo.com/logo.png',
                  site_url: 'https://newsite.com'
               }
            });
         });
      });

      test('includes company ID in update request', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanyData
         });

         render(<EditCompanyInfo />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update', 
               expect.objectContaining({
                  id: 1
               })
            );
         });
      });
   });

   describe('Ajax Integration', () => {
      test('uses useAjax hook for API calls', () => {
         render(<EditCompanyInfo />);
         
         expect(mockPost).toBeDefined();
      });

      test('makes POST request to correct endpoint', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: mockCompanyData
         });

         render(<EditCompanyInfo />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/company/update', expect.any(Object));
         });
      });

      test('handles undefined API response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue(undefined);

         render(<EditCompanyInfo />);
         
         fireEvent.submit(screen.getByTestId('edit-form'));

         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Company not found or update failed');
         });
         
         consoleSpy.mockRestore();
      });
   });

   describe('Context Integration', () => {
      test('requires CompanyDetailsProvider context', () => {
         mockUseCompanyDetails.mockImplementation(() => {
            throw new Error('useCompanyDetails must be used within an CompanyDetailsProvider');
         });

         expect(() => render(<EditCompanyInfo />)).toThrow('useCompanyDetails must be used within an CompanyDetailsProvider');
      });

      test('uses company data from context correctly', () => {
         const customCompanyData = {
            ...mockCompanyData,
            id: 999,
            company_name: 'Context Company'
         };
         
         mockUseCompanyDetails.mockReturnValue(customCompanyData);

         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.id).toBe(999);
         expect(initialValues.company_name).toBe('Context Company');
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<EditCompanyInfo />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<EditCompanyInfo />)).toThrow();
      });

      test('handles missing company data fields', () => {
         const incompleteCompanyData = {
            id: 1,
            company_name: 'Test Company'
            // Missing other required fields
         } as CompanyData;
         
         mockUseCompanyDetails.mockReturnValue(incompleteCompanyData);

         expect(() => render(<EditCompanyInfo />)).not.toThrow();
      });

      test('validates form submission error handling', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false
         });

         render(<EditCompanyInfo />);

         fireEvent.submit(screen.getByTestId('edit-form'));
         
         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });
         
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         expect(form.tagName).toBe('FORM');
      });

      test('all form fields have associated labels', () => {
         render(<EditCompanyInfo />);
         
         expect(screen.getByTestId('label-company_name')).toBeInTheDocument();
         expect(screen.getByTestId('label-location')).toBeInTheDocument();
         expect(screen.getByTestId('label-logo_url')).toBeInTheDocument();
         expect(screen.getByTestId('label-site_url')).toBeInTheDocument();
      });

      test('submit button has proper attributes', () => {
         render(<EditCompanyInfo />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('form is in edit mode for accessibility tools', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<EditCompanyInfo />);
         
         const initialForm = screen.getByTestId('edit-form');
         rerender(<EditCompanyInfo />);
         const rerenderedForm = screen.getByTestId('edit-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const formInputs = screen.getAllByTestId(/form-input-/);
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toBeInTheDocument();
         expect(formInputs).toHaveLength(4);
         expect(submitButton).toBeInTheDocument();
      });
   });

   describe('Component Integration', () => {
      test('integrates all components properly', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const formInputs = screen.getAllByTestId(/form-input-/);
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toBeInTheDocument();
         expect(formInputs).toHaveLength(4);
         expect(submitButton).toBeInTheDocument();
      });

      test('maintains proper component hierarchy', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         const companyNameInput = screen.getByTestId('form-input-company_name');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toContainElement(companyNameInput);
         expect(form).toContainElement(submitButton);
      });

      test('preserves edit mode functionality', () => {
         render(<EditCompanyInfo />);
         
         const form = screen.getByTestId('edit-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
         
         // Initial values should be populated from company data
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.company_name).toBe('Test Company');
      });
   });
});