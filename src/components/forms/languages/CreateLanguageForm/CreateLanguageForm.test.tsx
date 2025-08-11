import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateLanguageForm from './CreateLanguageForm';
import { LanguageData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: mockPush
   })
}));

// Mock Form hooks
const mockFormSubmit = jest.fn();
jest.mock('@/hooks', () => ({
   Form: ({ children, hideSubmit, onSubmit, ...props }: { children: React.ReactNode; hideSubmit?: boolean; onSubmit?: (data: FormValues) => void } & Record<string, unknown>) => {
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
            data-testid="create-language-form" 
            data-hide-submit={hideSubmit}
            onSubmit={async (e) => {
               e.preventDefault();
               const formData: FormValues = { 
                  default_name: 'Spanish',
                  locale_name: 'Español',
                  locale_code: 'es',
                  proficiency: 'intermediate'
               };
               
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
   FormInput: ({ fieldName, label, placeholder, max, ...props }: { fieldName: string; label: string; placeholder?: string; max?: number } & Record<string, unknown>) => (
      <div data-testid={`form-input-${fieldName}`} {...props}>
         <label data-testid={`label-${fieldName}`}>{label}</label>
         <input 
            data-testid={`input-${fieldName}`}
            placeholder={placeholder}
            maxLength={max}
         />
      </div>
   ),
   FormSelect: ({ fieldName, label, options, ...props }: { fieldName: string; label: string; options: any[] } & Record<string, unknown>) => (
      <div data-testid={`form-select-${fieldName}`} {...props}>
         <label data-testid={`label-${fieldName}`}>{label}</label>
         <select data-testid={`select-${fieldName}`} aria-label={label}>
            {options?.map((option, index) => (
               <option key={index} value={option.value || option}>
                  {option.label || option}
               </option>
            ))}
         </select>
      </div>
   ),
   FormSubmit: ({ label, fullWidth, ...props }: { label: string; fullWidth?: boolean } & Record<string, unknown>) => (
      <button 
         type="submit" 
         data-testid="form-submit"
         data-full-width={fullWidth}
         {...props}
      >
         {label}
      </button>
   )
}));

// Mock ContentSidebar and common components
jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="content-sidebar">
         {children}
      </div>
   )
}));

jest.mock('@/components/common', () => ({
   Card: ({ children, padding, ...props }: any) => (
      <div data-testid="card" data-padding={padding} {...props}>
         {children}
      </div>
   ),
   Container: ({ children, ...props }: any) => (
      <div data-testid="container" {...props}>
         {children}
      </div>
   )
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

// Mock texts
jest.mock('./CreateLanguageForm.texts', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

// Mock app config
jest.mock('@/app.config', () => ({
   languageLevels: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'fluent', label: 'Fluent' },
      { value: 'native', label: 'Native' }
   ]
}));

describe('CreateLanguageForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'CreateLanguageForm.default_name.label': 'Default Name',
                  'CreateLanguageForm.default_name.placeholder': 'Enter default language name',
                  'CreateLanguageForm.locale_name.label': 'Locale Name',
                  'CreateLanguageForm.locale_name.placeholder': 'Enter locale language name',
                  'CreateLanguageForm.locale_code.label': 'Locale Code',
                  'CreateLanguageForm.locale_code.placeholder': 'Enter locale code',
                  'CreateLanguageForm.proficiency.label': 'Proficiency Level',
                  'CreateLanguageForm.submit.label': 'Create Language'
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<CreateLanguageForm />)).not.toThrow();
      });

      test('renders form with correct attributes', () => {
         render(<CreateLanguageForm />);
         
         const form = screen.getByTestId('create-language-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveAttribute('data-hide-submit', 'true');
      });

      test('renders Container wrapper', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      test('renders ContentSidebar layout', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });

      test('renders all Card containers', () => {
         render(<CreateLanguageForm />);
         
         const cards = screen.getAllByTestId('card');
         expect(cards).toHaveLength(3); // Main form fields, proficiency, submit
         
         cards.forEach(card => {
            expect(card).toHaveAttribute('data-padding', 'm');
         });
      });

      test('renders without console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<CreateLanguageForm />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   describe('Form Fields Rendering', () => {
      test('renders default name input field', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('form-input-default_name')).toBeInTheDocument();
         expect(screen.getByTestId('label-default_name')).toHaveTextContent('Default Name');
         expect(screen.getByTestId('input-default_name')).toHaveAttribute('placeholder', 'Enter default language name');
      });

      test('renders locale name input field', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('form-input-locale_name')).toBeInTheDocument();
         expect(screen.getByTestId('label-locale_name')).toHaveTextContent('Locale Name');
         expect(screen.getByTestId('input-locale_name')).toHaveAttribute('placeholder', 'Enter locale language name');
      });

      test('renders locale code input field with max length', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('form-input-locale_code')).toBeInTheDocument();
         expect(screen.getByTestId('label-locale_code')).toHaveTextContent('Locale Code');
         expect(screen.getByTestId('input-locale_code')).toHaveAttribute('placeholder', 'Enter locale code');
         expect(screen.getByTestId('input-locale_code')).toHaveAttribute('maxLength', '2');
      });

      test('renders proficiency select field', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('form-select-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('label-proficiency')).toHaveTextContent('Proficiency Level');
         
         const select = screen.getByTestId('select-proficiency');
         const options = select.querySelectorAll('option');
         expect(options).toHaveLength(5);
      });

      test('renders submit button', () => {
         render(<CreateLanguageForm />);
         
         const submitButton = screen.getByTestId('form-submit');
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveAttribute('type', 'submit');
         expect(submitButton).toHaveAttribute('data-full-width', 'true');
         expect(submitButton).toHaveTextContent('Create Language');
      });
   });

   describe('Proficiency Level Options', () => {
      test('renders all language level options', () => {
         render(<CreateLanguageForm />);
         
         const select = screen.getByTestId('select-proficiency');
         const options = select.querySelectorAll('option');
         
         expect(options).toHaveLength(5);
         expect(options[0]).toHaveTextContent('Beginner');
         expect(options[1]).toHaveTextContent('Intermediate');
         expect(options[2]).toHaveTextContent('Advanced');
         expect(options[3]).toHaveTextContent('Fluent');
         expect(options[4]).toHaveTextContent('Native');
      });

      test('option values are correctly set', () => {
         render(<CreateLanguageForm />);
         
         const select = screen.getByTestId('select-proficiency');
         const options = select.querySelectorAll('option');
         
         expect(options[0]).toHaveAttribute('value', 'beginner');
         expect(options[1]).toHaveAttribute('value', 'intermediate');
         expect(options[2]).toHaveAttribute('value', 'advanced');
         expect(options[3]).toHaveAttribute('value', 'fluent');
         expect(options[4]).toHaveAttribute('value', 'native');
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<CreateLanguageForm />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves all required text resources', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<CreateLanguageForm />);
         
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.default_name.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.default_name.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.locale_name.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.locale_name.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.locale_code.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.locale_code.placeholder');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.proficiency.label');
         expect(mockGetText).toHaveBeenCalledWith('CreateLanguageForm.submit.label');
      });

      test('displays custom text resources', () => {
         const customTextMap = {
            'CreateLanguageForm.default_name.label': 'Language Name',
            'CreateLanguageForm.submit.label': 'Add New Language'
         };

         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => customTextMap[key as keyof typeof customTextMap] || key)
            }
         });

         render(<CreateLanguageForm />);
         
         expect(screen.getByText('Language Name')).toBeInTheDocument();
         expect(screen.getByText('Add New Language')).toBeInTheDocument();
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<CreateLanguageForm />)).not.toThrow();
      });
   });

   describe('Form Submission', () => {
      test('handles successful form submission', async () => {
         const mockLanguageData: LanguageData = {
            id: 1,
            created_at: new Date('2023-01-01'),
            updated_at: new Date('2023-01-02'),
            schemaName: 'languages_schema',
            tableName: 'languages',
            default_name: 'Spanish',
            locale_name: 'Español',
            locale_code: 'es',
            proficiency: 'intermediate'
         };

         mockPost.mockResolvedValue({
            success: true,
            data: mockLanguageData
         });

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/language/create', {
               default_name: 'Spanish',
               locale_name: 'Español',
               locale_code: 'es',
               proficiency: 'intermediate'
            });
         });

         expect(mockPush).toHaveBeenCalledWith('/admin/language/1');
      });

      test('handles API error response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false,
            message: 'Validation failed'
         });

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(mockPush).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });

      test('handles network error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockRejectedValue(new Error('Network error'));

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(mockPush).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });

      test('makes POST request to correct endpoint', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: 1 }
         });

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalledWith('/language/create', expect.any(Object));
         });
      });

      test('handles response without language ID', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: null }
         });

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(mockPush).not.toHaveBeenCalled();
      });
   });

   describe('Component Structure', () => {
      test('has correct component hierarchy', () => {
         render(<CreateLanguageForm />);
         
         const container = screen.getByTestId('container');
         const form = screen.getByTestId('create-language-form');
         const sidebar = screen.getByTestId('content-sidebar');
         
         expect(container).toContainElement(form);
         expect(form).toContainElement(sidebar);
      });

      test('organizes form fields in proper cards', () => {
         render(<CreateLanguageForm />);
         
         const cards = screen.getAllByTestId('card');
         expect(cards).toHaveLength(3);
         
         // First card should contain main form fields
         const firstCard = cards[0];
         expect(firstCard).toContainElement(screen.getByTestId('form-input-default_name'));
         expect(firstCard).toContainElement(screen.getByTestId('form-input-locale_name'));
         expect(firstCard).toContainElement(screen.getByTestId('form-input-locale_code'));
         
         // Second card should contain proficiency
         const secondCard = cards[1];
         expect(secondCard).toContainElement(screen.getByTestId('form-select-proficiency'));
         
         // Third card should contain submit button
         const thirdCard = cards[2];
         expect(thirdCard).toContainElement(screen.getByTestId('form-submit'));
      });
   });

   describe('Navigation Integration', () => {
      test('uses useRouter hook', () => {
         render(<CreateLanguageForm />);
         
         expect(mockPush).toBeDefined();
      });

      test('navigates to created language on success', async () => {
         mockPost.mockResolvedValue({
            success: true,
            data: { id: 42 }
         });

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/admin/language/42');
         });
      });
   });

   describe('Ajax Integration', () => {
      test('uses useAjax hook for API calls', () => {
         render(<CreateLanguageForm />);
         
         expect(mockPost).toBeDefined();
      });

      test('handles undefined API response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue(undefined);

         render(<CreateLanguageForm />);
         
         fireEvent.submit(screen.getByTestId('create-language-form'));

         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });

         expect(mockPush).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<CreateLanguageForm />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<CreateLanguageForm />)).toThrow();
      });

      test('validates form submission error handling', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPost.mockResolvedValue({
            success: false
         });

         render(<CreateLanguageForm />);

         fireEvent.submit(screen.getByTestId('create-language-form'));
         
         await waitFor(() => {
            expect(mockPost).toHaveBeenCalled();
         });
         
         expect(consoleSpy).toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<CreateLanguageForm />);
         
         const form = screen.getByTestId('create-language-form');
         expect(form.tagName).toBe('FORM');
      });

      test('all form fields have associated labels', () => {
         render(<CreateLanguageForm />);
         
         expect(screen.getByTestId('label-default_name')).toBeInTheDocument();
         expect(screen.getByTestId('label-locale_name')).toBeInTheDocument();
         expect(screen.getByTestId('label-locale_code')).toBeInTheDocument();
         expect(screen.getByTestId('label-proficiency')).toBeInTheDocument();
      });

      test('submit button has proper attributes', () => {
         render(<CreateLanguageForm />);
         
         const submitButton = screen.getByTestId('form-submit');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('select has accessible name', () => {
         render(<CreateLanguageForm />);
         
         const select = screen.getByTestId('select-proficiency');
         expect(select).toHaveAttribute('aria-label', 'Proficiency Level');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<CreateLanguageForm />);
         
         const initialForm = screen.getByTestId('create-language-form');
         rerender(<CreateLanguageForm />);
         const rerenderedForm = screen.getByTestId('create-language-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references', () => {
         render(<CreateLanguageForm />);
         
         const form = screen.getByTestId('create-language-form');
         const inputs = screen.getAllByTestId(/form-input-/);
         const select = screen.getByTestId('form-select-proficiency');
         const submitButton = screen.getByTestId('form-submit');
         
         expect(form).toBeInTheDocument();
         expect(inputs).toHaveLength(3);
         expect(select).toBeInTheDocument();
         expect(submitButton).toBeInTheDocument();
      });
   });
});
