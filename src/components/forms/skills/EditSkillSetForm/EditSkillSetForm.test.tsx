import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditSkillSetForm from './EditSkillSetForm';

// Mock functions for require() statements
const mockUseSkillDetails = jest.fn();
const mockUseAjax = jest.fn();
const mockGetTextContent = jest.fn();

// Mock dependencies
jest.mock('@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext', () => ({
   useSkillDetails: () => mockUseSkillDetails()
}));

jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: { children: React.ReactNode; initialValues?: Record<string, unknown>; submitLabel?: string; onSubmit?: (data: Record<string, unknown>) => void; editMode?: boolean }) => {
      const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         if (onSubmit && initialValues) {
            await onSubmit(initialValues);
         }
      };

      return (
         <form data-testid="form" data-edit-mode={editMode} onSubmit={handleSubmit}>
            <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
            <div data-testid="submit-label">{submitLabel}</div>
            {children}
            <button type="submit" data-testid="submit-button">
               {submitLabel}
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label, minRows, multiline }: { fieldName: string; label?: string; minRows?: number; multiline?: boolean }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input
            id={fieldName}
            data-testid={`input-${fieldName}`}
            data-multiline={multiline}
            data-min-rows={minRows}
            aria-label={label}
         />
      </div>
   )
}));

jest.mock('@/hooks/Form/inputs/FormSelect', () => {
   return function FormSelect({ fieldName, label, options }: { fieldName: string; label?: string; options?: Array<{ value: string; label: string }> }) {
      return (
         <div data-testid={`form-select-${fieldName}`}>
            <label htmlFor={fieldName}>{label}</label>
            <select id={fieldName} data-testid={`select-${fieldName}`} aria-label={label}>
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

jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => mockUseAjax()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockGetTextContent()
}));

jest.mock('./EditSkillSetForm.text', () => ({}));

jest.mock('@/app.config', () => ({
   allowedLanguages: ['en', 'pt', 'es'],
   languageNames: {
      en: 'English',
      pt: 'Portuguese', 
      es: 'Spanish'
   }
}));

describe('EditSkillSetForm', () => {
   const mockAjax = {
      post: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const mockSkill = {
      id: 'skill-123',
      languageSets: [
         {
            id: 'set-456',
            skill_id: 'skill-123',
            language_set: 'en',
            journey: 'This is my English journey path in software development...'
         },
         {
            id: 'set-789',
            skill_id: 'skill-123',
            language_set: 'pt',
            journey: 'Este é meu caminho de jornada em desenvolvimento de software...'
         }
      ]
   };

   // Suppress console.error for JSDOM navigation errors
   const originalConsoleError = console.error;
   
   beforeAll(() => {
      console.error = jest.fn();
   });
   
   afterAll(() => {
      console.error = originalConsoleError;
   });

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseSkillDetails.mockReturnValue(mockSkill);
      mockUseAjax.mockReturnValue(mockAjax);
      mockGetTextContent.mockReturnValue({ textResources: mockTextResources });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'EditSkillSetForm.save': 'Save',
            'EditSkillSetForm.language_set': 'Language Set',
            'EditSkillSetForm.journey': 'Journey Path',
            'EditSkillSetForm.feedback.notFound': 'Language set not found'
         };
         return textMap[key] || key;
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing in edit mode', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render without crashing in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode when editMode is true', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should render in create mode when editMode is false', () => {
         render(<EditSkillSetForm editMode={false} />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'false');
      });

      it('should render with correct submit label', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Save');
      });
   });

   // Language Set Not Found Tests
   describe('Language Set Not Found', () => {
      it('should render not found message when language set does not exist in edit mode', () => {
         render(<EditSkillSetForm editMode={true} language_set="fr" />);
         expect(screen.getByText('Language set not found')).toBeInTheDocument();
      });

      it('should not render form when language set not found', () => {
         render(<EditSkillSetForm editMode={true} language_set="fr" />);
         expect(screen.queryByTestId('form')).not.toBeInTheDocument();
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render journey field with correct props in edit mode', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const journeyField = screen.getByTestId('form-input-journey');
         expect(journeyField).toBeInTheDocument();
         expect(journeyField).toHaveTextContent('Journey Path');
         
         const journeyInput = screen.getByTestId('input-journey');
         expect(journeyInput).toHaveAttribute('data-multiline', 'true');
         expect(journeyInput).toHaveAttribute('data-min-rows', '10');
      });

      it('should render journey field in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const journeyField = screen.getByTestId('form-input-journey');
         expect(journeyField).toBeInTheDocument();
         expect(journeyField).toHaveTextContent('Journey Path');
      });

      it('should render language set select field in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const languageSetField = screen.getByTestId('form-select-language_set');
         expect(languageSetField).toBeInTheDocument();
         expect(languageSetField).toHaveTextContent('Language Set');
         
         const select = screen.getByTestId('select-language_set');
         expect(select).toBeInTheDocument();
      });

      it('should not render language set select field in edit mode', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         expect(screen.queryByTestId('form-select-language_set')).not.toBeInTheDocument();
      });

      it('should render language options correctly in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const select = screen.getByTestId('select-language_set');
         expect(select.querySelector('option[value="en"]')).toHaveTextContent('English');
         expect(select.querySelector('option[value="pt"]')).toHaveTextContent('Portuguese');
         expect(select.querySelector('option[value="es"]')).toHaveTextContent('Spanish');
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for save button', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillSetForm.save');
      });

      it('should call getText for journey field', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillSetForm.journey');
      });

      it('should call getText for language set field in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillSetForm.language_set');
      });

      it('should call getText for not found message when language set missing', () => {
         render(<EditSkillSetForm editMode={true} language_set="fr" />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillSetForm.feedback.notFound');
      });
   });

   // Initial Values Tests
   describe('Initial Values', () => {
      it('should set correct initial values in edit mode for English', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockSkill.languageSets[0]);
      });

      it('should set correct initial values in edit mode for Portuguese', () => {
         render(<EditSkillSetForm editMode={true} language_set="pt" />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockSkill.languageSets[1]);
      });

      it('should set correct initial values in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ skill_id: 'skill-123' });
      });
   });

   // Form Submission Tests - Edit Mode
   describe('Form Submission - Edit Mode', () => {
      it('should handle successful form submission in edit mode', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalledWith('/skill/update-set', {
               id: 'skill-123',
               updates: mockSkill.languageSets[0]
            });
         });
      });

      it('should handle form submission error in edit mode', async () => {
         const mockError = new Error('Update failed');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle unsuccessful response in edit mode', async () => {
         mockAjax.post.mockResolvedValue({ success: false, error: 'Validation failed' });
         
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });
   });

   // Form Submission Tests - Create Mode
   describe('Form Submission - Create Mode', () => {
      it('should handle successful form submission in create mode', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillSetForm editMode={false} />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalledWith('/skill/create-set', {
               skill_id: 'skill-123'
            });
         });
      });

      it('should handle form submission error in create mode', async () => {
         const mockError = new Error('Create failed');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<EditSkillSetForm editMode={false} />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle unsuccessful response in create mode', async () => {
         mockAjax.post.mockResolvedValue({ success: false, error: 'Creation failed' });
         
         render(<EditSkillSetForm editMode={false} />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });
   });

   // Props Tests
   describe('Props Handling', () => {
      it('should handle missing editMode prop', () => {
         render(<EditSkillSetForm />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should handle missing language_set prop in edit mode', () => {
         render(<EditSkillSetForm editMode={true} />);
         expect(screen.getByText('Language set not found')).toBeInTheDocument();
      });

      it('should handle empty string language_set', () => {
         render(<EditSkillSetForm editMode={true} language_set="" />);
         expect(screen.getByText('Language set not found')).toBeInTheDocument();
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle missing skill context', () => {
         mockUseSkillDetails.mockReturnValue({ id: 'skill-123', languageSets: [] });
         
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         expect(screen.getByText('Language set not found')).toBeInTheDocument();
      });

      it('should handle null skill context', () => {
         mockUseSkillDetails.mockReturnValue({ languageSets: [] });
         
         expect(() => {
            render(<EditSkillSetForm editMode={false} />);
         }).not.toThrow();
      });
   });

   // Language Configuration Tests
   describe('Language Configuration', () => {
      it('should load allowed languages from config', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const select = screen.getByTestId('select-language_set');
         expect(select.children).toHaveLength(3); // en, pt, es
      });

      it('should display language names correctly', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const select = screen.getByTestId('select-language_set');
         expect(select.querySelector('option[value="en"]')).toHaveTextContent('English');
         expect(select.querySelector('option[value="pt"]')).toHaveTextContent('Portuguese');
         expect(select.querySelector('option[value="es"]')).toHaveTextContent('Spanish');
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper form structure for screen readers', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         const journeyField = screen.getByTestId('form-input-journey');
         expect(journeyField).toBeInTheDocument();
      });

      it('should have proper select structure in create mode', () => {
         render(<EditSkillSetForm editMode={false} />);
         
         const languageField = screen.getByTestId('form-select-language_set');
         expect(languageField).toBeInTheDocument();
         
         const journeyField = screen.getByTestId('form-input-journey');
         expect(journeyField).toBeInTheDocument();
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<EditSkillSetForm editMode={true} language_set="en" />);
         
         const finalCallCount = mockTextResources.getText.mock.calls.length;
         expect(finalCallCount).toBeGreaterThan(initialCallCount);
         expect(finalCallCount).toBeLessThan(initialCallCount * 3);
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditSkillSetForm editMode={true} language_set="en" />);
         
         expect(mockUseSkillDetails).toHaveBeenCalled();
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockGetTextContent).toHaveBeenCalled();
      });

      it('should handle mode switching correctly', () => {
         const { rerender } = render(<EditSkillSetForm editMode={false} />);
         
         expect(screen.getByTestId('form-select-language_set')).toBeInTheDocument();
         
         rerender(<EditSkillSetForm editMode={true} language_set="en" />);
         
         expect(screen.queryByTestId('form-select-language_set')).not.toBeInTheDocument();
      });
   });
});
