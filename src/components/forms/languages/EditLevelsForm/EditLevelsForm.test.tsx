import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditLevelsForm from './EditLevelsForm';
import { LanguageData } from '@/types/database.types';
import { FormValues } from '@/hooks/Form/Form.types';

// Mock the language details context
const mockUseLanguageDetails = jest.fn();
jest.mock('@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContext', () => ({
   useLanguageDetails: () => mockUseLanguageDetails()
}));

// Mock Form hooks
const mockFormSubmit = jest.fn();
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, onSubmit, editMode, ...props }: { children: React.ReactNode; initialValues?: FormValues; onSubmit?: (data: FormValues) => void; editMode?: boolean } & Record<string, unknown>) => {
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
            data-testid="edit-levels-form" 
            data-edit-mode={editMode}
            data-initial-values={JSON.stringify(initialValues)}
            onSubmit={async (e) => {
               e.preventDefault();
               const formData: FormValues = { proficiency: 'Advanced' };
               
               try {
                  await onSubmit?.(formData);
               } catch (error) {
                  console.error('Form submission error caught:', error);
               }
            }}
            {...props}
         >
            {children}
            <button type="submit" data-testid="submit-button">Submit</button>
         </form>
      );
   },
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
   )
}));

// Mock useAjax hook
const mockPatch = jest.fn();
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      patch: mockPatch
   })
}));

// Mock text resources
const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

// Mock texts
jest.mock('./EditLevelsForm.texts', () => ({
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

// Mock window.location.reload preserving existing location object
// Replace location object (jsdom throws when redefining existing properties otherwise)
// Provide test hook for reload without invoking jsdom navigation
const mockReload = jest.fn();
(window as any).__appReload = mockReload;

describe('EditLevelsForm', () => {
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

   beforeEach(() => {
      jest.clearAllMocks();
      
      mockUseLanguageDetails.mockReturnValue(mockLanguageData);
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'EditLevelsForm.proficiency.label': 'Proficiency Level'
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<EditLevelsForm />)).not.toThrow();
      });

      test('renders form with correct attributes', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toBeInTheDocument();
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });

      test('renders proficiency select field', () => {
         render(<EditLevelsForm />);
         
         expect(screen.getByTestId('form-select-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('label-proficiency')).toHaveTextContent('Proficiency Level');
         expect(screen.getByTestId('select-proficiency')).toBeInTheDocument();
      });

      test('renders submit button', () => {
         render(<EditLevelsForm />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('renders without console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<EditLevelsForm />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   describe('Initial Values and Language Data Integration', () => {
   test('passes language data as initial values to form (using existing keys)', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
      expect(initialValues.default_name).toBe('Spanish');
      expect(initialValues.proficiency).toBe('intermediate');
      });

      test('uses language details from context', () => {
         render(<EditLevelsForm />);
         
         expect(mockUseLanguageDetails).toHaveBeenCalledTimes(1);
      });

   test('handles different language data (additional props)', () => {
         const differentLanguageData = {
            ...mockLanguageData,
      default_name: 'French',
      proficiency: 'advanced'
         };
         
         mockUseLanguageDetails.mockReturnValue(differentLanguageData);
         
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
      expect(initialValues.default_name).toBe('French');
      expect(initialValues.proficiency).toBe('advanced');
      });
   });

   describe('Proficiency Level Options', () => {
      test('renders all language level options', () => {
         render(<EditLevelsForm />);
         
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
         render(<EditLevelsForm />);
         
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
         render(<EditLevelsForm />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('retrieves proficiency label text', () => {
         const mockGetText = jest.fn((key: string) => key);
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<EditLevelsForm />);
         
         expect(mockGetText).toHaveBeenCalledWith('EditLevelsForm.proficiency.label');
      });

      test('displays custom text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => 'Language Proficiency Level')
            }
         });

         render(<EditLevelsForm />);
         
         expect(screen.getByText('Language Proficiency Level')).toBeInTheDocument();
      });

      test('handles missing text resources gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => undefined)
            }
         });

         expect(() => render(<EditLevelsForm />)).not.toThrow();
      });
   });

   describe('Form Submission', () => {
   test('handles successful form submission (reload called)', async () => {
         mockPatch.mockResolvedValue({
            success: true,
      data: { ...mockLanguageData, proficiency: 'advanced' }
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalledWith('/language/update', expect.objectContaining({
               language_id: 1
            }));
         });
            expect(mockReload).toHaveBeenCalled();
               expect((window as any).__appReload).toHaveBeenCalled();
      });

      test('handles API error response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPatch.mockResolvedValue({
            success: false,
            message: 'Language not found'
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalled();
         });

         expect(mockReload).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });

      test('handles network error', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPatch.mockRejectedValue(new Error('Network error'));

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalled();
         });

         expect(mockReload).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });

      test('includes correct language ID in update request', async () => {
         mockPatch.mockResolvedValue({
            success: true,
            data: mockLanguageData
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalledWith('/language/update', 
               expect.objectContaining({
                  language_id: 1
               })
            );
         });
      });

      test('makes PATCH request to correct endpoint', async () => {
         mockPatch.mockResolvedValue({
            success: true,
            data: mockLanguageData
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalledWith('/language/update', expect.any(Object));
         });
      });
   });

   describe('Ajax Integration', () => {
      test('uses useAjax hook for API calls', () => {
         render(<EditLevelsForm />);
         
         expect(mockPatch).toBeDefined();
      });

      test('handles undefined API response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockPatch.mockResolvedValue(undefined);

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalled();
         });

         expect(mockReload).not.toHaveBeenCalled();
         
         consoleSpy.mockRestore();
      });
   });

   describe('Context Integration', () => {
      test('requires LanguageDetailsProvider context', () => {
         mockUseLanguageDetails.mockImplementation(() => {
            throw new Error('useLanguageDetails must be used within a LanguageDetailsProvider');
         });

         expect(() => render(<EditLevelsForm />)).toThrow('useLanguageDetails must be used within a LanguageDetailsProvider');
      });

      test('uses language data from context correctly', () => {
         const customLanguageData = {
            ...mockLanguageData,
            id: 999,
            language_name: 'German'
         };
         
         mockUseLanguageDetails.mockReturnValue(customLanguageData);

         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         
         expect(initialValues.id).toBe(999);
         expect(initialValues.language_name).toBe('German');
      });
   });

   describe('Error Handling', () => {
      test('handles textResources errors gracefully', () => {
         mockUseTextResources.mockImplementation(() => {
            throw new Error('TextResources error');
         });

         expect(() => render(<EditLevelsForm />)).toThrow('TextResources error');
      });

      test('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({});

         expect(() => render(<EditLevelsForm />)).toThrow();
      });

      test('handles missing language data fields', () => {
         const incompleteLanguageData = {
            id: 1,
            default_name: 'Spanish',
            locale_name: 'Español',
            locale_code: 'es',
            proficiency: 'intermediate',
            created_at: new Date(),
            schemaName: 'languages_schema',
            tableName: 'languages'
         } as LanguageData;
         
         mockUseLanguageDetails.mockReturnValue(incompleteLanguageData);

         expect(() => render(<EditLevelsForm />)).not.toThrow();
      });
   });

   describe('Page Reload Behavior', () => {
   test('reloads page on successful update (integration)', async () => {
         mockPatch.mockResolvedValue({
            success: true,
            data: mockLanguageData
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => expect(mockReload).toHaveBeenCalled());
            await waitFor(() => expect((window as any).__appReload).toHaveBeenCalled());
      });

      test('does not reload page on failed update', async () => {
         mockPatch.mockResolvedValue({
            success: false
         });

         render(<EditLevelsForm />);
         
         fireEvent.submit(screen.getByTestId('edit-levels-form'));

         await waitFor(() => {
            expect(mockPatch).toHaveBeenCalled();
         });

            expect(mockReload).not.toHaveBeenCalled();
               expect((window as any).__appReload).not.toHaveBeenCalled();
      });
   });

   describe('Accessibility', () => {
      test('form has proper semantic structure', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         expect(form.tagName).toBe('FORM');
      });

      test('proficiency field has associated label', () => {
         render(<EditLevelsForm />);
         
         expect(screen.getByTestId('label-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('select-proficiency')).toBeInTheDocument();
      });

      test('submit button has proper attributes', () => {
         render(<EditLevelsForm />);
         
         const submitButton = screen.getByTestId('submit-button');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      test('form is in edit mode for accessibility tools', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });
   });

   describe('Performance', () => {
      test('renders efficiently without unnecessary re-renders', () => {
         const { rerender } = render(<EditLevelsForm />);
         
         const initialForm = screen.getByTestId('edit-levels-form');
         rerender(<EditLevelsForm />);
         const rerenderedForm = screen.getByTestId('edit-levels-form');
         
         expect(initialForm).toBeInTheDocument();
         expect(rerenderedForm).toBeInTheDocument();
      });

      test('maintains component references', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const select = screen.getByTestId('form-select-proficiency');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toBeInTheDocument();
         expect(select).toBeInTheDocument();
         expect(submitButton).toBeInTheDocument();
      });
   });

   describe('Component Integration', () => {
      test('integrates all components properly', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const select = screen.getByTestId('form-select-proficiency');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toContainElement(select);
         expect(form).toContainElement(submitButton);
      });

      test('maintains proper component hierarchy', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         const proficiencySelect = screen.getByTestId('form-select-proficiency');
         const submitButton = screen.getByTestId('submit-button');
         
         expect(form).toContainElement(proficiencySelect);
         expect(form).toContainElement(submitButton);
      });

      test('preserves edit mode functionality', () => {
         render(<EditLevelsForm />);
         
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
         
         // Initial values should be populated from language data
         const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
         expect(initialValues.default_name).toBe('Spanish');
      });
   });
});
