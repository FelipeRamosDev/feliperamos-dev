import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditSkillForm from './EditSkillForm';

// Mock function variables
let useSkillDetails: jest.MockedFunction<() => unknown>;
let useAjax: jest.MockedFunction<() => { post: jest.MockedFunction<() => Promise<unknown>> }>;
let useTextResources: jest.MockedFunction<() => { textResources: { getText: jest.MockedFunction<(key: string) => string> } }>;

// Mock dependencies
jest.mock('@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext', () => ({
   useSkillDetails: jest.fn()
}));

jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, onSubmit, editMode }: { 
      children: React.ReactNode; 
      initialValues?: Record<string, unknown>; 
      onSubmit?: (data: Record<string, unknown>) => void; 
      editMode?: boolean; 
   }) => {
      const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         if (onSubmit && initialValues) {
            await onSubmit(initialValues);
         }
      };

      return (
         <form data-testid="form" data-edit-mode={editMode} onSubmit={handleSubmit}>
            <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
            {children}
            <button type="submit" data-testid="submit-button">
               Submit
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label, type }: { fieldName: string; label: string; type?: string }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input
            id={fieldName}
            data-testid={`input-${fieldName}`}
            type={type || 'text'}
            aria-label={label}
         />
      </div>
   ),
   FormSelect: ({ fieldName, label, options }: { 
      fieldName: string; 
      label: string; 
      options?: Array<{ value: string; label: string }>; 
   }) => (
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
   )
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

jest.mock('./EditSkillForm.text', () => ({}));

jest.mock('@/app.config', () => ({
   skillCategories: [
      { value: 'languages', label: 'Programming Languages' },
      { value: 'frameworks', label: 'Frameworks' },
      { value: 'tools', label: 'Development Tools' },
      { value: 'databases', label: 'Databases' },
      { value: 'cloud', label: 'Cloud Services' },
      { value: 'other', label: 'Other' }
   ]
}));



describe('EditSkillForm', () => {
   const mockAjax = {
      post: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const mockSkill = {
      id: 'skill-123',
      name: 'React',
      category: 'frameworks',
      level: 85,
      description: 'A JavaScript library for building user interfaces'
   };

   beforeEach(() => {
      jest.clearAllMocks();

      useSkillDetails = require('@/components/content/admin/skill/SkillDetailsContent/SkillDetailsContext').useSkillDetails;
      useAjax = require('@/hooks/useAjax').useAjax;
      useTextResources = require('@/services/TextResources/TextResourcesProvider').useTextResources;

      useSkillDetails.mockReturnValue(mockSkill);
      useAjax.mockReturnValue(mockAjax);
      useTextResources.mockReturnValue({ textResources: mockTextResources });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'EditSkillForm.name': 'Skill Name',
            'EditSkillForm.category': 'Category',
            'EditSkillForm.level': 'Level'
         };
         return textMap[key] || key;
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<EditSkillForm />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode', () => {
         render(<EditSkillForm />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should render with skill data as initial values', () => {
         render(<EditSkillForm />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(mockSkill);
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render name field with correct props', () => {
         render(<EditSkillForm />);
         
         const nameField = screen.getByTestId('form-input-name');
         expect(nameField).toBeInTheDocument();
         expect(nameField).toHaveTextContent('Skill Name');
         
         const nameInput = screen.getByTestId('input-name');
         expect(nameInput).toHaveAttribute('type', 'text');
         expect(nameInput).toHaveAttribute('aria-label', 'Skill Name');
      });

      it('should render category select field with correct options', () => {
         render(<EditSkillForm />);
         
         const categoryField = screen.getByTestId('form-select-category');
         expect(categoryField).toBeInTheDocument();
         expect(categoryField).toHaveTextContent('Category');
         
         const categorySelect = screen.getByTestId('select-category');
         expect(categorySelect).toBeInTheDocument();
         
         // Check if all skill categories are present
         expect(categorySelect.querySelector('option[value="languages"]')).toHaveTextContent('Programming Languages');
         expect(categorySelect.querySelector('option[value="frameworks"]')).toHaveTextContent('Frameworks');
         expect(categorySelect.querySelector('option[value="tools"]')).toHaveTextContent('Development Tools');
         expect(categorySelect.querySelector('option[value="databases"]')).toHaveTextContent('Databases');
         expect(categorySelect.querySelector('option[value="cloud"]')).toHaveTextContent('Cloud Services');
         expect(categorySelect.querySelector('option[value="other"]')).toHaveTextContent('Other');
      });

      it('should render level field as number input', () => {
         render(<EditSkillForm />);
         
         const levelField = screen.getByTestId('form-input-level');
         expect(levelField).toBeInTheDocument();
         expect(levelField).toHaveTextContent('Level');
         
         const levelInput = screen.getByTestId('input-level');
         expect(levelInput).toHaveAttribute('type', 'number');
         expect(levelInput).toHaveAttribute('aria-label', 'Level');
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for name field', () => {
         render(<EditSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillForm.name');
      });

      it('should call getText for category field', () => {
         render(<EditSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillForm.category');
      });

      it('should call getText for level field', () => {
         render(<EditSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditSkillForm.level');
      });

      it('should display correct text labels', () => {
         render(<EditSkillForm />);
         
         expect(screen.getByText('Skill Name')).toBeInTheDocument();
         expect(screen.getByText('Category')).toBeInTheDocument();
         expect(screen.getByText('Level')).toBeInTheDocument();
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful form submission', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalledWith('/skill/update', {
               id: 'skill-123',
               updates: mockSkill
            });
         });
      });

      it('should handle form submission error', async () => {
         const mockError = new Error('Update failed');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle unsuccessful response', async () => {
         mockAjax.post.mockResolvedValue({ success: false, error: 'Validation failed' });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should call handleSubmit with current skill data', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         expect(mockAjax.post).toHaveBeenCalledWith('/skill/update', {
            id: mockSkill.id,
            updates: mockSkill
         });
      });
   });

   // Skill Categories Tests
   describe('Skill Categories', () => {
      it('should load all skill categories from config', () => {
         render(<EditSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         expect(categorySelect.children).toHaveLength(6); // All 6 categories
      });

      it('should display category labels correctly', () => {
         render(<EditSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         const options = Array.from(categorySelect.children);
         
         expect(options[0]).toHaveTextContent('Programming Languages');
         expect(options[1]).toHaveTextContent('Frameworks');
         expect(options[2]).toHaveTextContent('Development Tools');
         expect(options[3]).toHaveTextContent('Databases');
         expect(options[4]).toHaveTextContent('Cloud Services');
         expect(options[5]).toHaveTextContent('Other');
      });

      it('should have correct category values', () => {
         render(<EditSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         
         expect(categorySelect.querySelector('option[value="languages"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="frameworks"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="tools"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="databases"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="cloud"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="other"]')).toBeInTheDocument();
      });
   });

   // Skill Context Tests
   describe('Skill Context', () => {
      it('should use skill details from context', () => {
         render(<EditSkillForm />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues.id).toBe('skill-123');
         expect(initialValues.name).toBe('React');
         expect(initialValues.category).toBe('frameworks');
         expect(initialValues.level).toBe(85);
      });

      it('should handle different skill data', () => {
         const differentSkill = {
            id: 'skill-456',
            name: 'TypeScript',
            category: 'languages',
            level: 90
         };

         useSkillDetails.mockReturnValue(differentSkill);

         render(<EditSkillForm />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(differentSkill);
      });

      it('should handle empty skill object', () => {
         useSkillDetails.mockReturnValue({ skill: {} });

         expect(() => {
            render(<EditSkillForm />);
         }).not.toThrow();
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle Ajax network errors', async () => {
         const networkError = new Error('Network error');
         mockAjax.post.mockRejectedValue(networkError);
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle server validation errors', async () => {
         const validationError = { success: false, message: 'Invalid level value' };
         mockAjax.post.mockResolvedValue(validationError);
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         
         await fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle missing skill context gracefully', () => {
         useSkillDetails.mockReturnValue(null);

         expect(() => {
            render(<EditSkillForm />);
         }).not.toThrow();
      });
   });

   // Input Types Tests
   describe('Input Types', () => {
      it('should render name field as text input', () => {
         render(<EditSkillForm />);
         
         const nameInput = screen.getByTestId('input-name');
         expect(nameInput).toHaveAttribute('type', 'text');
      });

      it('should render level field as number input', () => {
         render(<EditSkillForm />);
         
         const levelInput = screen.getByTestId('input-level');
         expect(levelInput).toHaveAttribute('type', 'number');
      });

      it('should render category as select dropdown', () => {
         render(<EditSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         expect(categorySelect.tagName).toBe('SELECT');
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper labels for all form fields', () => {
         render(<EditSkillForm />);
         
         expect(screen.getByLabelText('Skill Name')).toBeInTheDocument();
         expect(screen.getByLabelText('Category')).toBeInTheDocument();
         expect(screen.getByLabelText('Level')).toBeInTheDocument();
      });

      it('should have proper form structure for screen readers', () => {
         render(<EditSkillForm />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         // Check form structure
         expect(screen.getByTestId('form-input-name')).toBeInTheDocument();
         expect(screen.getByTestId('form-select-category')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-level')).toBeInTheDocument();
      });

      it('should have aria-labels for all inputs', () => {
         render(<EditSkillForm />);
         
         expect(screen.getByTestId('input-name')).toHaveAttribute('aria-label', 'Skill Name');
         expect(screen.getByTestId('input-level')).toHaveAttribute('aria-label', 'Level');
         expect(screen.getByTestId('select-category')).toHaveAttribute('aria-label', 'Category');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditSkillForm />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<EditSkillForm />);
         
         const finalCallCount = mockTextResources.getText.mock.calls.length;
         expect(finalCallCount).toBeGreaterThan(initialCallCount);
         expect(finalCallCount).toBeLessThan(initialCallCount * 3);
      });

      it('should handle rapid form submissions gracefully', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         
         // Simulate rapid clicks
         fireEvent.click(submitButton);
         fireEvent.click(submitButton);
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
         
         // Should handle multiple submissions without errors
         expect(mockAjax.post.mock.calls.length).toBeGreaterThan(0);
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditSkillForm />);
         
         expect(useSkillDetails).toHaveBeenCalled();
         expect(useAjax).toHaveBeenCalled();
         expect(useTextResources).toHaveBeenCalled();
      });

      it('should handle complete form workflow', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         // Verify form is rendered
         expect(screen.getByTestId('form')).toBeInTheDocument();
         
         // Verify all fields are present
         expect(screen.getByTestId('input-name')).toBeInTheDocument();
         expect(screen.getByTestId('select-category')).toBeInTheDocument();
         expect(screen.getByTestId('input-level')).toBeInTheDocument();
         
         // Submit form
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         // Verify submission was handled
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });
   });

   // Data Validation Tests
   describe('Data Validation', () => {
      it('should pass correct skill ID in update request', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         expect(mockAjax.post).toHaveBeenCalledWith('/skill/update', {
            id: mockSkill.id,
            updates: expect.any(Object)
         });
      });

      it('should include all skill fields in updates', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<EditSkillForm />);
         
         const submitButton = screen.getByRole('button');
         await fireEvent.click(submitButton);
         
         expect(mockAjax.post).toHaveBeenCalledWith('/skill/update', {
            id: mockSkill.id,
            updates: expect.objectContaining({
               name: expect.any(String),
               category: expect.any(String),
               level: expect.any(Number)
            })
         });
      });
   });
});
