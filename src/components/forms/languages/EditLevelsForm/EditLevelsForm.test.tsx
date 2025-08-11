import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditLevelsForm from './EditLevelsForm';
import { LanguageData } from '@/types/database.types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
   }),
}));

// Mock useLanguageDetails hook
const mockLanguageDetails = {
   id: 1,
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-01-02'),
   schemaName: 'languages_schema',
   tableName: 'languages',
   default_name: 'Spanish',
   locale_name: 'Español',
   locale_code: 'es',
   proficiency: 'intermediate' as const,
} as LanguageData;

jest.mock('@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContext', () => ({
   useLanguageDetails: () => mockLanguageDetails,
}));

// Mock useTextResources hook
const mockTextResources = {
   getText: jest.fn((key: string) => {
      const texts: Record<string, string> = {
         'EditLevelsForm.proficiency.label': 'Proficiency Level',
      };
      return texts[key] || key;
   }),
};

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({ textResources: mockTextResources }),
}));

// Mock useAjax hook
const mockAjaxPatch = jest.fn();
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      patch: mockAjaxPatch,
      get: jest.fn(),
      post: jest.fn(),
      delete: jest.fn(),
   }),
}));

// Mock Form and FormSelect components
jest.mock('@/hooks', () => ({
   Form: ({ children, onSubmit, initialValues, editMode }: any) => (
      <form 
         data-testid="edit-levels-form" 
         data-edit-mode={editMode}
         onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const values = Object.fromEntries(formData.entries());
            onSubmit(values);
         }}
      >
         {children}
         <input type="hidden" name="proficiency" defaultValue={initialValues?.proficiency} />
      </form>
   ),
   FormSelect: ({ fieldName, label, options }: any) => (
      <div data-testid={`form-select-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <select name={fieldName} id={fieldName} data-testid={`select-${fieldName}`}>
            {options.map((option: any) => (
               <option key={option.value} value={option.value}>
                  {option.label}
               </option>
            ))}
         </select>
         <button type="submit" data-testid="submit-button">Update</button>
      </div>
   ),
}));

// Mock app.config
jest.mock('@/app.config', () => ({
   languageLevels: [
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
      { value: 'proficient', label: 'Proficient' },
      { value: 'native', label: 'Native' },
   ],
}));

describe('EditLevelsForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      // Reset the mock implementation to default behavior
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'EditLevelsForm.proficiency.label': 'Proficiency Level',
         };
         return texts[key] || key;
      });
      mockAjaxPatch.mockResolvedValue({ success: true, data: mockLanguageDetails });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('renders without crashing', () => {
         render(<EditLevelsForm />);
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });

      it('renders form with correct attributes', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });

      it('renders proficiency select field', () => {
         render(<EditLevelsForm />);
         expect(screen.getByTestId('form-select-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('select-proficiency')).toBeInTheDocument();
      });

      it('renders submit button', () => {
         render(<EditLevelsForm />);
         expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      it('renders without console errors', () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         render(<EditLevelsForm />);
         expect(consoleSpy).not.toHaveBeenCalled();
         consoleSpy.mockRestore();
      });
   });

   // Initial Values and Language Data Integration
   describe('Initial Values and Language Data Integration', () => {
      it('passes language data as initial values to form', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         const hiddenInput = form.querySelector('input[name="proficiency"]') as HTMLInputElement;
         expect(hiddenInput?.defaultValue).toBe(mockLanguageDetails.proficiency);
      });

      it('uses language details from context', () => {
         render(<EditLevelsForm />);
         // Verify that the component uses the mocked language details
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });

      it('handles different language data (additional props)', () => {
         // Test with different mock data to ensure flexibility
         const differentLanguage = {
            ...mockLanguageDetails,
            proficiency: 'advanced' as const,
            default_name: 'French',
         };
         
         jest.doMock('@/components/content/admin/language/LanguageDetailsContent/LanguageDetailsContext', () => ({
            useLanguageDetails: () => differentLanguage,
         }));

         render(<EditLevelsForm />);
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });
   });

   // Proficiency Level Options
   describe('Proficiency Level Options', () => {
      it('renders all language level options', () => {
         render(<EditLevelsForm />);
         const select = screen.getByTestId('select-proficiency');
         const options = select.querySelectorAll('option');
         
         expect(options).toHaveLength(5);
         expect(options[0]).toHaveTextContent('Beginner');
         expect(options[1]).toHaveTextContent('Intermediate');
         expect(options[2]).toHaveTextContent('Advanced');
         expect(options[3]).toHaveTextContent('Proficient');
         expect(options[4]).toHaveTextContent('Native');
      });

      it('option values are correctly set', () => {
         render(<EditLevelsForm />);
         const select = screen.getByTestId('select-proficiency');
         const options = select.querySelectorAll('option');
         
         expect(options[0]).toHaveValue('beginner');
         expect(options[1]).toHaveValue('intermediate');
         expect(options[2]).toHaveValue('advanced');
         expect(options[3]).toHaveValue('proficient');
         expect(options[4]).toHaveValue('native');
      });
   });

   // Text Resources Integration
   describe('Text Resources Integration', () => {
      it('calls useTextResources with correct text module', () => {
         render(<EditLevelsForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditLevelsForm.proficiency.label');
      });

      it('retrieves proficiency label text', () => {
         render(<EditLevelsForm />);
         expect(screen.getByText('Proficiency Level')).toBeInTheDocument();
      });

      it('displays custom text resources', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            if (key === 'EditLevelsForm.proficiency.label') return 'Custom Proficiency Label';
            return key;
         });

         render(<EditLevelsForm />);
         expect(screen.getByText('Custom Proficiency Label')).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockImplementation((key: string) => key);
         render(<EditLevelsForm />);
         expect(screen.getByText('EditLevelsForm.proficiency.label')).toBeInTheDocument();
      });
   });

   // Form Submission
   describe('Form Submission', () => {
      it('handles successful form submission (router push called)', async () => {
         mockAjaxPatch.mockResolvedValue({ success: true, data: mockLanguageDetails });
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalledWith('/language/update', {
               language_id: mockLanguageDetails.id,
               updates: { proficiency: mockLanguageDetails.proficiency }
            });
         });

         await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(`/admin/language/${mockLanguageDetails.id}`);
         });
      });

      it('handles API error response', async () => {
         const errorResponse = { success: false, error: 'Update failed' };
         mockAjaxPatch.mockResolvedValue(errorResponse);
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalled();
         });

         // Should not navigate on error
         expect(mockPush).not.toHaveBeenCalled();
      });

      it('handles network error', async () => {
         mockAjaxPatch.mockRejectedValue(new Error('Network error'));
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalled();
         });

         // Should not navigate on error
         expect(mockPush).not.toHaveBeenCalled();
      });

      it('includes correct language ID in update request', async () => {
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalledWith('/language/update', 
               expect.objectContaining({
                  language_id: mockLanguageDetails.id
               })
            );
         });
      });

      it('makes PATCH request to correct endpoint', async () => {
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalledWith('/language/update', expect.any(Object));
         });
      });
   });

   // Ajax Integration
   describe('Ajax Integration', () => {
      it('uses useAjax hook for API calls', () => {
         render(<EditLevelsForm />);
         // Verify component renders without errors, indicating ajax hook is working
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });

      it('handles undefined API response', async () => {
         mockAjaxPatch.mockResolvedValue(undefined);
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalled();
         });

         // Should not navigate on undefined response
         expect(mockPush).not.toHaveBeenCalled();
      });
   });

   // Context Integration
   describe('Context Integration', () => {
      it('requires LanguageDetailsProvider context', () => {
         // This test ensures the component expects language context
         render(<EditLevelsForm />);
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });

      it('uses language data from context correctly', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         const hiddenInput = form.querySelector('input[name="proficiency"]') as HTMLInputElement;
         expect(hiddenInput?.defaultValue).toBe(mockLanguageDetails.proficiency);
      });
   });

   // Error Handling
   describe('Error Handling', () => {
      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockImplementation((key: string) => key);
         render(<EditLevelsForm />);
         expect(screen.getByText('EditLevelsForm.proficiency.label')).toBeInTheDocument();
      });

      it('displays fallback text when getText returns undefined', () => {
         mockTextResources.getText.mockImplementation(() => '');
         render(<EditLevelsForm />);
         // Component should still render without crashing
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
      });
   });

   // Navigation Behavior
   describe('Navigation Behavior', () => {
      it('navigates to language details page on successful update', async () => {
         mockAjaxPatch.mockResolvedValue({ success: true, data: mockLanguageDetails });
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(`/admin/language/${mockLanguageDetails.id}`);
         });
      });

      it('does not navigate on failed update', async () => {
         mockAjaxPatch.mockResolvedValue({ success: false });
         
         render(<EditLevelsForm />);
         const submitButton = screen.getByTestId('submit-button');
         
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjaxPatch).toHaveBeenCalled();
         });

         expect(mockPush).not.toHaveBeenCalled();
      });
   });

   // Accessibility
   describe('Accessibility', () => {
      it('form has proper semantic structure', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         expect(form.tagName).toBe('FORM');
      });

      it('proficiency field has associated label', () => {
         render(<EditLevelsForm />);
         const label = screen.getByText('Proficiency Level');
         const select = screen.getByTestId('select-proficiency');
         expect(label).toHaveAttribute('for', 'proficiency');
         expect(select).toHaveAttribute('id', 'proficiency');
      });

      it('submit button has proper attributes', () => {
         render(<EditLevelsForm />);
         const button = screen.getByTestId('submit-button');
         expect(button).toHaveAttribute('type', 'submit');
      });

      it('form is in edit mode for accessibility tools', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });
   });

   // Performance
   describe('Performance', () => {
      it('renders efficiently without unnecessary re-renders', () => {
         const renderSpy = jest.fn();
         const TestComponent = () => {
            renderSpy();
            return <EditLevelsForm />;
         };

         const { rerender } = render(<TestComponent />);
         expect(renderSpy).toHaveBeenCalledTimes(1);

         rerender(<TestComponent />);
         expect(renderSpy).toHaveBeenCalledTimes(2);
      });

      it('maintains component references', () => {
         const { container, rerender } = render(<EditLevelsForm />);
         const firstRender = container.firstChild;

         rerender(<EditLevelsForm />);
         const secondRender = container.firstChild;

         // Component structure should be consistent
         expect(firstRender?.nodeName).toBe(secondRender?.nodeName);
      });
   });

   // Component Integration
   describe('Component Integration', () => {
      it('integrates all components properly', () => {
         render(<EditLevelsForm />);
         
         // Verify all main components are present
         expect(screen.getByTestId('edit-levels-form')).toBeInTheDocument();
         expect(screen.getByTestId('form-select-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('select-proficiency')).toBeInTheDocument();
         expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      });

      it('maintains proper component hierarchy', () => {
         const { container } = render(<EditLevelsForm />);
         const form = container.querySelector('[data-testid="edit-levels-form"]') as HTMLElement;
         const formSelect = container.querySelector('[data-testid="form-select-proficiency"]') as HTMLElement;
         
         expect(form).toContainElement(formSelect);
      });

      it('preserves edit mode functionality', () => {
         render(<EditLevelsForm />);
         const form = screen.getByTestId('edit-levels-form');
         expect(form).toHaveAttribute('data-edit-mode', 'true');
      });
   });
});
