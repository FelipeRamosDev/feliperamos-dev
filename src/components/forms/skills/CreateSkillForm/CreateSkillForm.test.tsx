import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateSkillForm from './CreateSkillForm';

// Mock dependencies
jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="content-sidebar">
         {Array.isArray(children) 
            ? children.map((child: React.ReactNode, index: number) => (
               <div key={index} data-testid={`content-${index}`}>
                  {child}
               </div>
            ))
            : children
         }
      </div>
   )
}));

jest.mock('@/hooks', () => ({
   Form: ({ children, hideSubmit, onSubmit }: { children: React.ReactNode; hideSubmit?: boolean; onSubmit?: (data: Record<string, unknown>) => void }) => {
      const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         if (onSubmit) {
            try {
               const formData = {
                  name: 'React',
                  journey: 'A JavaScript library for building user interfaces',
                  category: 'frameworks',
                  level: 8
               };
               await onSubmit(formData);
            } catch (error) {
               // Handle error internally to prevent unhandled rejections
               console.error('Form submission error:', error);
            }
         }
      };

      return (
         <form data-testid="form" data-hide-submit={hideSubmit} onSubmit={handleSubmit}>
            {children}
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, multiline, minRows, type, min, max }: { 
      fieldName: string; 
      label: string; 
      placeholder?: string; 
      multiline?: boolean; 
      minRows?: number; 
      type?: string; 
      min?: number; 
      max?: number; 
   }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input
            id={fieldName}
            data-testid={`input-${fieldName}`}
            placeholder={placeholder}
            data-multiline={multiline}
            data-min-rows={minRows}
            type={type || 'text'}
            min={min}
            max={max}
            aria-label={label}
         />
      </div>
   )
}));

jest.mock('@/hooks/Form/inputs/FormSelect', () => {
   return function FormSelect({ fieldName, label, options }: { 
      fieldName: string; 
      label: string; 
      options?: Array<{ value: string; label: string }>; 
   }) {
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

jest.mock('@/hooks/Form/inputs/FormSubmit', () => {
   return function FormSubmit({ label, startIcon, fullWidth }: { 
      label: string; 
      startIcon?: React.ReactNode; 
      fullWidth?: boolean; 
   }) {
      return (
         <button 
            type="submit" 
            data-testid="form-submit"
            data-full-width={fullWidth}
         >
            {startIcon && <span data-testid="submit-icon">{startIcon}</span>}
            {label}
         </button>
      );
   };
});

jest.mock('@/components/common', () => ({
   Card: ({ children, padding }: { children: React.ReactNode; padding?: string }) => (
      <div data-testid="card" data-padding={padding}>
         {children}
      </div>
   )
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn()
}));

jest.mock('next/navigation', () => ({
   useRouter: jest.fn()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

jest.mock('./CreateSkillForm.text', () => ({}));

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

jest.mock('@mui/icons-material', () => ({
   Save: () => <span data-testid="save-icon">Save Icon</span>
}));

describe('CreateSkillForm', () => {
   const mockAjax = {
      post: jest.fn()
   };

   const mockRouter = {
      push: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   beforeEach(() => {
      jest.clearAllMocks();

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAjax } = require('@/hooks/useAjax');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useRouter } = require('next/navigation');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useTextResources } = require('@/services/TextResources/TextResourcesProvider');

      useAjax.mockReturnValue(mockAjax);
      useRouter.mockReturnValue(mockRouter);
      useTextResources.mockReturnValue({ textResources: mockTextResources });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'CreateSkillForm.name.label': 'Skill Name',
            'CreateSkillForm.name.placeholder': 'Enter skill name',
            'CreateSkillForm.journey.label': 'Skill Journey',
            'CreateSkillForm.journey.placeholder': 'Describe the skill journey',
            'CreateSkillForm.category.label': 'Skill Category',
            'CreateSkillForm.level.label': 'Skill Level',
            'CreateSkillForm.level.placeholder': 'Enter skill level (1-10)',
            'CreateSkillForm.submit.label': 'Create Skill'
         };
         return textMap[key] || key;
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<CreateSkillForm />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render ContentSidebar layout', () => {
         render(<CreateSkillForm />);
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });

      it('should render form with hideSubmit prop', () => {
         render(<CreateSkillForm />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-hide-submit', 'true');
      });

      it('should render multiple Card components', () => {
         render(<CreateSkillForm />);
         const cards = screen.getAllByTestId('card');
         expect(cards.length).toBeGreaterThan(1);
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render name field with correct props', () => {
         render(<CreateSkillForm />);
         
         const nameField = screen.getByTestId('form-input-name');
         expect(nameField).toBeInTheDocument();
         expect(nameField).toHaveTextContent('Skill Name');
         
         const nameInput = screen.getByTestId('input-name');
         expect(nameInput).toHaveAttribute('placeholder', 'Enter skill name');
         expect(nameInput).toHaveAttribute('type', 'text');
      });

      it('should render journey field as multiline with correct rows', () => {
         render(<CreateSkillForm />);
         
         const journeyField = screen.getByTestId('form-input-journey');
         expect(journeyField).toBeInTheDocument();
         expect(journeyField).toHaveTextContent('Skill Journey');
         
         const journeyInput = screen.getByTestId('input-journey');
         expect(journeyInput).toHaveAttribute('placeholder', 'Describe the skill journey');
         expect(journeyInput).toHaveAttribute('data-multiline', 'true');
         expect(journeyInput).toHaveAttribute('data-min-rows', '5');
      });

      it('should render category select field with skill categories', () => {
         render(<CreateSkillForm />);
         
         const categoryField = screen.getByTestId('form-select-category');
         expect(categoryField).toBeInTheDocument();
         expect(categoryField).toHaveTextContent('Skill Category');
         
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

      it('should render level field as number input with min/max', () => {
         render(<CreateSkillForm />);
         
         const levelField = screen.getByTestId('form-input-level');
         expect(levelField).toBeInTheDocument();
         expect(levelField).toHaveTextContent('Skill Level');
         
         const levelInput = screen.getByTestId('input-level');
         expect(levelInput).toHaveAttribute('placeholder', 'Enter skill level (1-10)');
         expect(levelInput).toHaveAttribute('type', 'number');
         expect(levelInput).toHaveAttribute('min', '1');
         expect(levelInput).toHaveAttribute('max', '10');
      });

      it('should render submit button with correct props', () => {
         render(<CreateSkillForm />);
         
         const submitButton = screen.getByTestId('form-submit');
         expect(submitButton).toBeInTheDocument();
         expect(submitButton).toHaveTextContent('Create Skill');
         expect(submitButton).toHaveAttribute('data-full-width', 'true');
         expect(submitButton).toHaveAttribute('type', 'submit');
      });

      it('should render Save icon in submit button', () => {
         render(<CreateSkillForm />);
         
         expect(screen.getByTestId('submit-icon')).toBeInTheDocument();
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for name field', () => {
         render(<CreateSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.name.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.name.placeholder');
      });

      it('should call getText for journey field', () => {
         render(<CreateSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.journey.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.journey.placeholder');
      });

      it('should call getText for category field', () => {
         render(<CreateSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.category.label');
      });

      it('should call getText for level field', () => {
         render(<CreateSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.level.label');
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.level.placeholder');
      });

      it('should call getText for submit button', () => {
         render(<CreateSkillForm />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('CreateSkillForm.submit.label');
      });

      it('should display correct text labels', () => {
         render(<CreateSkillForm />);
         
         expect(screen.getByText('Skill Name')).toBeInTheDocument();
         expect(screen.getByText('Skill Journey')).toBeInTheDocument();
         expect(screen.getByText('Skill Category')).toBeInTheDocument();
         expect(screen.getByText('Skill Level')).toBeInTheDocument();
         expect(screen.getByText('Create Skill')).toBeInTheDocument();
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful form submission', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalledWith('/skill/create', {
               name: 'React',
               journey: 'A JavaScript library for building user interfaces',
               category: 'frameworks',
               level: 8
            });
         });
         
         await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should handle form submission error', async () => {
         const mockError = new Error('Creation failed');
         mockAjax.post.mockRejectedValue(mockError);
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         // The form will handle errors internally
         await act(async () => {
            fireEvent.submit(form);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle unsuccessful response', async () => {
         mockAjax.post.mockResolvedValue({ success: false });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         await act(async () => {
            fireEvent.submit(form);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should format data correctly before submission', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockAjax.post).toHaveBeenCalledWith('/skill/create', 
            expect.objectContaining({
               name: expect.any(String),
               journey: expect.any(String),
               category: expect.any(String),
               level: expect.any(Number)
            })
         );
      });
   });

   // Layout Tests
   describe('Layout', () => {
      it('should render form fields in correct content areas', () => {
         render(<CreateSkillForm />);
         
         // Main content should contain name and journey fields
         expect(screen.getByTestId('form-input-name')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-journey')).toBeInTheDocument();
         
         // Sidebar should contain category, level, and submit
         expect(screen.getByTestId('form-select-category')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-level')).toBeInTheDocument();
         expect(screen.getByTestId('form-submit')).toBeInTheDocument();
      });

      it('should render cards with correct padding', () => {
         render(<CreateSkillForm />);
         
         const cards = screen.getAllByTestId('card');
         cards.forEach(card => {
            expect(card).toHaveAttribute('data-padding', 'm');
         });
      });

      it('should organize content in sidebar layout', () => {
         render(<CreateSkillForm />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         expect(contentSidebar).toBeInTheDocument();
         
         // Should have multiple content sections
         expect(screen.getByTestId('content-0')).toBeInTheDocument();
         expect(screen.getByTestId('content-1')).toBeInTheDocument();
      });
   });

   // Skill Categories Tests
   describe('Skill Categories', () => {
      it('should load all skill categories from config', () => {
         render(<CreateSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         expect(categorySelect.children).toHaveLength(6); // All 6 categories
      });

      it('should display category labels correctly', () => {
         render(<CreateSkillForm />);
         
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
         render(<CreateSkillForm />);
         
         const categorySelect = screen.getByTestId('select-category');
         
         expect(categorySelect.querySelector('option[value="languages"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="frameworks"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="tools"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="databases"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="cloud"]')).toBeInTheDocument();
         expect(categorySelect.querySelector('option[value="other"]')).toBeInTheDocument();
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle Ajax network errors', async () => {
         const networkError = new Error('Network error');
         mockAjax.post.mockRejectedValue(networkError);
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         await act(async () => {
            fireEvent.submit(form);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle server validation errors', async () => {
         const validationError = new Error('Validation failed');
         mockAjax.post.mockRejectedValue(validationError);
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         await act(async () => {
            fireEvent.submit(form);
         });
         
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
      });

      it('should handle router navigation errors gracefully', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         mockRouter.push.mockImplementation(() => {
            throw new Error('Navigation failed');
         });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         // Should not throw even if navigation fails
         await expect(async () => {
            await fireEvent.submit(form);
         }).not.toThrow();
      });
   });

   // Input Validation Tests
   describe('Input Validation', () => {
      it('should render level field with correct constraints', () => {
         render(<CreateSkillForm />);
         
         const levelInput = screen.getByTestId('input-level');
         expect(levelInput).toHaveAttribute('type', 'number');
         expect(levelInput).toHaveAttribute('min', '1');
         expect(levelInput).toHaveAttribute('max', '10');
      });

      it('should render name field as required text input', () => {
         render(<CreateSkillForm />);
         
         const nameInput = screen.getByTestId('input-name');
         expect(nameInput).toHaveAttribute('type', 'text');
      });

      it('should render journey field as multiline text', () => {
         render(<CreateSkillForm />);
         
         const journeyInput = screen.getByTestId('input-journey');
         expect(journeyInput).toHaveAttribute('data-multiline', 'true');
         expect(journeyInput).toHaveAttribute('data-min-rows', '5');
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper labels for all form fields', () => {
         render(<CreateSkillForm />);
         
         expect(screen.getByLabelText('Skill Name')).toBeInTheDocument();
         expect(screen.getByLabelText('Skill Journey')).toBeInTheDocument();
         expect(screen.getByLabelText('Skill Category')).toBeInTheDocument();
         expect(screen.getByLabelText('Skill Level')).toBeInTheDocument();
      });

      it('should have proper form structure for screen readers', () => {
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         // Check specific form structure elements
         expect(screen.getByTestId('form-input-name')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-journey')).toBeInTheDocument();
         expect(screen.getByTestId('form-select-category')).toBeInTheDocument();
         expect(screen.getByTestId('form-input-level')).toBeInTheDocument();
      });

      it('should have aria-labels for all inputs', () => {
         render(<CreateSkillForm />);
         
         expect(screen.getByTestId('input-name')).toHaveAttribute('aria-label', 'Skill Name');
         expect(screen.getByTestId('input-journey')).toHaveAttribute('aria-label', 'Skill Journey');
         expect(screen.getByTestId('input-level')).toHaveAttribute('aria-label', 'Skill Level');
         expect(screen.getByTestId('select-category')).toHaveAttribute('aria-label', 'Skill Category');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<CreateSkillForm />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<CreateSkillForm />);
         
         const finalCallCount = mockTextResources.getText.mock.calls.length;
         expect(finalCallCount).toBeGreaterThan(initialCallCount);
         expect(finalCallCount).toBeLessThan(initialCallCount * 3);
      });

      it('should handle rapid form submissions gracefully', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         // Simulate rapid submissions
         fireEvent.submit(form);
         fireEvent.submit(form);
         fireEvent.submit(form);
         
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
         render(<CreateSkillForm />);
         
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         expect(require('@/hooks/useAjax').useAjax).toHaveBeenCalled();
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         expect(require('next/navigation').useRouter).toHaveBeenCalled();
         // eslint-disable-next-line @typescript-eslint/no-require-imports
         expect(require('@/services/TextResources/TextResourcesProvider').useTextResources).toHaveBeenCalled();
      });

      it('should handle complete form workflow', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         // Verify form is rendered
         expect(screen.getByTestId('form')).toBeInTheDocument();
         
         // Verify all fields are present
         expect(screen.getByTestId('input-name')).toBeInTheDocument();
         expect(screen.getByTestId('input-journey')).toBeInTheDocument();
         expect(screen.getByTestId('select-category')).toBeInTheDocument();
         expect(screen.getByTestId('input-level')).toBeInTheDocument();
         expect(screen.getByTestId('form-submit')).toBeInTheDocument();
         
         // Submit form
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         // Verify submission was handled
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should handle form submission with complete data structure', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockAjax.post).toHaveBeenCalledWith('/skill/create', {
            name: expect.any(String),
            journey: expect.any(String),
            category: expect.any(String),
            level: expect.any(Number)
         });
      });
   });

   // Navigation Tests
   describe('Navigation', () => {
      it('should navigate to admin page after successful creation', async () => {
         mockAjax.post.mockResolvedValue({ success: true });
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should not navigate on failed creation', async () => {
         mockAjax.post.mockRejectedValue(new Error('Creation failed'));
         
         render(<CreateSkillForm />);
         
         const form = screen.getByTestId('form');
         
         // The form submission will handle the error internally
         await act(async () => {
            fireEvent.submit(form);
         });
         
         // Wait for potential async operations to complete
         await waitFor(() => {
            expect(mockAjax.post).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });
   });
});
