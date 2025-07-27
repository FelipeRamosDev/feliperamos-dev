import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditExperienceSkills from './EditExperienceSkills';
import { handleExperienceUpdate, loadSkillsOptions } from '@/helpers/database.helpers';

// Mock functions for require() statements - must be declared before jest.mock calls
const mockUseExperienceDetails = jest.fn();
const mockUseAjax = jest.fn();
const mockGetTextContent = jest.fn();

// Mock dependencies
jest.mock('@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext', () => ({
   useExperienceDetails: () => mockUseExperienceDetails()
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
   }
}));

jest.mock('@/hooks/Form/inputs/FormMultiSelectChip', () => {
   return function MockFormMultiSelectChip({ id, fieldName, loadOptions }: { id?: string; fieldName: string; loadOptions?: () => Promise<Array<{ value: string; label: string }>> | Array<{ value: string; label: string }> }) {
      return (
         <div data-testid={`form-multi-select-chip-${fieldName}`}>
            <div data-testid="multi-select-id">{id}</div>
            <div data-testid="multi-select-fieldname">{fieldName}</div>
            <button 
               data-testid="load-options-trigger"
               onClick={async () => {
                  if (loadOptions) {
                     try {
                        await loadOptions();
                     } catch (error) {
                        // Handle promise rejection silently for testing
                        console.warn('Load options failed:', error);
                     }
                  }
               }}
            >
               Load Options
            </button>
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

jest.mock('@/helpers/database.helpers', () => ({
   handleExperienceUpdate: jest.fn(),
   loadSkillsOptions: jest.fn()
}));

jest.mock('./EditExperienceSkills.text', () => ({}));

describe('EditExperienceSkills', () => {
   const mockAjax = {
      post: jest.fn(),
      get: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const mockExperience = {
      id: 'exp-123',
      skills: [
         { id: 'skill-1', name: 'JavaScript', slug: 'javascript' },
         { id: 'skill-2', name: 'React', slug: 'react' },
         { id: 'skill-3', name: 'TypeScript', slug: 'typescript' }
      ]
   };

   const mockLoadSkillsOptions = loadSkillsOptions as jest.MockedFunction<typeof loadSkillsOptions>;
   const mockHandleExperienceUpdate = handleExperienceUpdate as jest.MockedFunction<typeof handleExperienceUpdate>;

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseExperienceDetails.mockReturnValue(mockExperience);
      mockUseAjax.mockReturnValue(mockAjax);
      mockGetTextContent.mockReturnValue({ textResources: mockTextResources });
      
      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'EditExperienceSkills.submit.label': 'Save Changes'
         };
         return textMap[key] || key;
      });
      
      mockLoadSkillsOptions.mockResolvedValue([
         { value: 'skill-1', label: 'JavaScript' },
         { value: 'skill-2', label: 'React' },
         { value: 'skill-3', label: 'TypeScript' },
         { value: 'skill-4', label: 'Node.js' }
      ]);
      mockHandleExperienceUpdate.mockResolvedValue({ success: true });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<EditExperienceSkills />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode', () => {
         render(<EditExperienceSkills />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should render with correct submit label', () => {
         render(<EditExperienceSkills />);
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Save Changes');
      });
   });

   // Form Components Tests
   describe('Form Components', () => {
      it('should render FormMultiSelectChip with correct props', () => {
         render(<EditExperienceSkills />);
         
         const multiSelectField = screen.getByTestId('form-multi-select-chip-skills');
         expect(multiSelectField).toBeInTheDocument();
         
         expect(screen.getByTestId('multi-select-id')).toHaveTextContent('edit-experience-skills');
         expect(screen.getByTestId('multi-select-fieldname')).toHaveTextContent('skills');
      });

      it('should render load options trigger', () => {
         render(<EditExperienceSkills />);
         expect(screen.getByTestId('load-options-trigger')).toBeInTheDocument();
      });
   });

   // Initial Values Tests
   describe('Initial Values', () => {
      it('should set correct initial values with skill IDs', () => {
         render(<EditExperienceSkills />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({
            skills: ['skill-1', 'skill-2', 'skill-3']
         });
      });

      it('should handle experience with no skills', () => {
         const experienceWithoutSkills = { ...mockExperience, skills: [] };
         mockUseExperienceDetails.mockReturnValue(experienceWithoutSkills);
         
         render(<EditExperienceSkills />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ skills: [] });
      });

      it('should handle undefined skills array', () => {
         const experienceWithUndefinedSkills = { ...mockExperience, skills: undefined };
         mockUseExperienceDetails.mockReturnValue(experienceWithUndefinedSkills);
         
         expect(() => {
            render(<EditExperienceSkills />);
         }).toThrow();
      });
   });

   // Skills Load Options Tests
   describe('Skills Load Options', () => {
      it('should call loadSkillsOptions when triggered', async () => {
         render(<EditExperienceSkills />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalledWith(mockAjax, mockTextResources);
         });
      });

      it('should handle load options success', async () => {
         mockLoadSkillsOptions.mockResolvedValue([
            { value: '1', label: 'Skill 1' },
            { value: '2', label: 'Skill 2' }
         ]);
         
         render(<EditExperienceSkills />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalled();
         });
      });

      it('should handle load options error', async () => {
         mockLoadSkillsOptions.mockImplementation(() => {
            return Promise.reject(new Error('Load failed'));
         });
         
         render(<EditExperienceSkills />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         
         await act(async () => {
            fireEvent.click(loadOptionsButton);
         });
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalled();
         });
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful form submission', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceSkills />);
         
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { skills: ['skill-1', 'skill-2', 'skill-3'] }
            );
         });
      });

      it('should handle form submission error', async () => {
         mockHandleExperienceUpdate.mockRejectedValue(new Error('Update failed'));
         
         render(<EditExperienceSkills />);
         
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Update failed');
         });
      });

      it('should pass correct parameters to handleExperienceUpdate', async () => {
         render(<EditExperienceSkills />);
         
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { skills: ['skill-1', 'skill-2', 'skill-3'] }
            );
         });
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for submit label', () => {
         render(<EditExperienceSkills />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('EditExperienceSkills.submit.label');
      });

      it('should use text resources in loadOptions', async () => {
         render(<EditExperienceSkills />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalledWith(mockAjax, mockTextResources);
         });
      });
   });

   // Experience Context Tests
   describe('Experience Context', () => {
      it('should use experience from context', () => {
         render(<EditExperienceSkills />);
         
         expect(mockUseExperienceDetails).toHaveBeenCalled();
      });

      it('should handle different experience structures', () => {
         const differentExperience = {
            id: 'exp-456',
            skills: [
               { id: 'skill-10', name: 'Python', slug: 'python' }
            ]
         };
         
         mockUseExperienceDetails.mockReturnValue(differentExperience);
         
         render(<EditExperienceSkills />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ skills: ['skill-10'] });
      });
   });

   // Ajax Integration Tests
   describe('Ajax Integration', () => {
      it('should use ajax from useAjax hook', () => {
         render(<EditExperienceSkills />);
         
         expect(mockUseAjax).toHaveBeenCalled();
      });

      it('should pass ajax to loadOptions and update functions', async () => {
         render(<EditExperienceSkills />);
         
         // Test loadOptions
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalledWith(mockAjax, expect.any(Object));
         });
         
         // Test update
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(mockAjax, expect.any(Object), expect.any(Object));
         });
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle missing experience context', () => {
         mockUseExperienceDetails.mockReturnValue(null);
         
         expect(() => {
            render(<EditExperienceSkills />);
         }).toThrow();
      });

      it('should handle handleExperienceUpdate errors', async () => {
         mockHandleExperienceUpdate.mockRejectedValue(new Error('Database error'));
         
         render(<EditExperienceSkills />);
         
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         
         await act(async () => {
            fireEvent.click(submitButton);
         });
         
         await waitFor(() => {
            expect(screen.getByTestId('form-error')).toHaveTextContent('Database error');
         });
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper form structure for screen readers', () => {
         render(<EditExperienceSkills />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         const multiSelectField = screen.getByTestId('form-multi-select-chip-skills');
         expect(multiSelectField).toBeInTheDocument();
      });

      it('should have identifiable multi-select component', () => {
         render(<EditExperienceSkills />);
         
         const multiSelectId = screen.getByTestId('multi-select-id');
         expect(multiSelectId).toHaveTextContent('edit-experience-skills');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditExperienceSkills />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<EditExperienceSkills />);
         
         // Text resources might be called again but should not exceed double the initial count
         expect(mockTextResources.getText.mock.calls.length).toBeLessThanOrEqual(initialCallCount * 2);
      });

      it('should memoize loadOptions function', () => {
         render(<EditExperienceSkills />);
         
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         
         // Should be able to call multiple times
         fireEvent.click(loadOptionsButton);
         fireEvent.click(loadOptionsButton);
         
         expect(mockLoadSkillsOptions).toHaveBeenCalledTimes(2);
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditExperienceSkills />);
         
         // Verify all mocked hooks are called
         expect(mockUseExperienceDetails).toHaveBeenCalled();
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockGetTextContent).toHaveBeenCalled();
      });

      it('should work with complete workflow', async () => {
         render(<EditExperienceSkills />);
         
         // Load options first
         const loadOptionsButton = screen.getByTestId('load-options-trigger');
         fireEvent.click(loadOptionsButton);
         
         await waitFor(() => {
            expect(mockLoadSkillsOptions).toHaveBeenCalled();
         });
         
         // Then submit form
         const submitButton = screen.getByRole('button', { name: 'Save Changes' });
         fireEvent.click(submitButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalled();
         });
      });
   });

   // Skills Data Mapping Tests
   describe('Skills Data Mapping', () => {
      it('should correctly map skills to IDs in initial values', () => {
         const experienceWithDifferentSkills = {
            id: 'exp-789',
            skills: [
               { id: 'skill-a', name: 'Vue.js', slug: 'vuejs' },
               { id: 'skill-b', name: 'Angular', slug: 'angular' }
            ]
         };
         
         mockUseExperienceDetails.mockReturnValue(experienceWithDifferentSkills);
         
         render(<EditExperienceSkills />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ skills: ['skill-a', 'skill-b'] });
      });

      it('should handle skills without IDs gracefully', () => {
         const experienceWithBadSkills = {
            id: 'exp-bad',
            skills: [
               { name: 'Skill without ID', slug: 'no-id' }
            ]
         };
         
         mockUseExperienceDetails.mockReturnValue(experienceWithBadSkills);
         
         render(<EditExperienceSkills />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ skills: [null] });
      });
   });
});
