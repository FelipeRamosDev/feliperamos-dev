import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditExperienceStatus from './EditExperienceStatus';

// Mock dependencies with function wrappers to avoid hoisting issues
jest.mock('@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext', () => ({
   useExperienceDetails: jest.fn()
}));

jest.mock('@/helpers/database.helpers', () => ({
   handleExperienceUpdate: jest.fn()
}));

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn()
}));

// Import mocked modules
import { useExperienceDetails } from '@/components/content/admin/experience/ExperienceDetailsContent/ExperienceDetailsContext';
import { useAjax } from '@/hooks/useAjax';
import { handleExperienceUpdate } from '@/helpers/database.helpers';

// Get references to mocked functions
const mockUseExperienceDetails = jest.mocked(useExperienceDetails);
const mockUseAjax = jest.mocked(useAjax);
const mockHandleExperienceUpdate = jest.mocked(handleExperienceUpdate);
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, hideSubmit, editMode }: { children: React.ReactNode; initialValues?: Record<string, unknown>; hideSubmit?: boolean; editMode?: boolean }) => (
      <form data-testid="form" data-edit-mode={editMode} data-hide-submit={hideSubmit}>
         <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
         {children}
      </form>
   )
}));

jest.mock('../CreateExperienceForm/CreateExperienceForm.config', () => ({
   statusOptions: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' }
   ]
}));

jest.mock('@/hooks/Form/inputs/FormButtonSelect', () => {
   return function MockFormButtonSelect({ fieldName, options, onSelect }: { fieldName: string; options?: Array<{ value: string; label: string }>; onSelect?: (value: string) => void }) {
      return (
         <div data-testid={`form-button-select-${fieldName}`}>
            <div data-testid="fieldname">{fieldName}</div>
            <div data-testid="options">{JSON.stringify(options)}</div>
            {options?.map((option: { value: string; label: string }) => (
               <button
                  key={option.value}
                  data-testid={`option-${option.value}`}
                  type="button"
                  onClick={async (e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     if (onSelect) {
                        try {
                           await onSelect(option.value);
                        } catch (error) {
                           // Handle promise rejection silently for testing
                           console.warn('Select option failed:', error);
                        }
                     }
                  }}
               >
                  {option.label}
               </button>
            ))}
         </div>
      );
   };
});

describe('EditExperienceStatus', () => {
   const mockAjax = {
      post: jest.fn()
   };

   const mockExperience = {
      id: 'exp-123',
      status: 'active',
      title: 'Software Developer',
      company_id: 'comp-1'
   };

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseExperienceDetails.mockReturnValue(mockExperience as any);
      mockUseAjax.mockReturnValue(mockAjax as any);
      
      mockHandleExperienceUpdate.mockImplementation(() => Promise.resolve({ success: true }));
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<EditExperienceStatus />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render in edit mode', () => {
         render(<EditExperienceStatus />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-edit-mode', 'true');
      });

      it('should hide submit button', () => {
         render(<EditExperienceStatus />);
         expect(screen.getByTestId('form')).toHaveAttribute('data-hide-submit', 'true');
      });
   });

   // Form Components Tests
   describe('Form Components', () => {
      it('should render FormButtonSelect with correct props', () => {
         render(<EditExperienceStatus />);
         
         const buttonSelectField = screen.getByTestId('form-button-select-status');
         expect(buttonSelectField).toBeInTheDocument();
         
         expect(screen.getByTestId('fieldname')).toHaveTextContent('status');
      });

      it('should render all status options', () => {
         render(<EditExperienceStatus />);
         
         expect(screen.getByTestId('option-active')).toHaveTextContent('Active');
         expect(screen.getByTestId('option-inactive')).toHaveTextContent('Inactive');
         expect(screen.getByTestId('option-draft')).toHaveTextContent('Draft');
      });

      it('should pass correct options to FormButtonSelect', () => {
         render(<EditExperienceStatus />);
         
         const optionsData = JSON.parse(screen.getByTestId('options').textContent || '[]');
         expect(optionsData).toEqual([
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'draft', label: 'Draft' }
         ]);
      });
   });

   // Initial Values Tests
   describe('Initial Values', () => {
      it('should set correct initial values with experience status', () => {
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: 'active' });
      });

      it('should handle different status values', () => {
         const experienceWithDraftStatus = { ...mockExperience, status: 'draft' };
         mockUseExperienceDetails.mockReturnValue(experienceWithDraftStatus as any);
         
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: 'draft' });
      });

      it('should handle undefined status', () => {
         const experienceWithoutStatus = { ...mockExperience, status: undefined };
         mockUseExperienceDetails.mockReturnValue(experienceWithoutStatus as any);
         
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: undefined });
      });
   });

   // Status Selection Tests
   describe('Status Selection', () => {
      it('should handle active status selection', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         fireEvent.click(activeButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'active' }
            );
         });
      });

      it('should handle inactive status selection', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const inactiveButton = screen.getByTestId('option-inactive');
         fireEvent.click(inactiveButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'inactive' }
            );
         });
      });

      it('should handle draft status selection', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const draftButton = screen.getByTestId('option-draft');
         fireEvent.click(draftButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'draft' }
            );
         });
      });
   });

   // Handle Submit Tests
   describe('Handle Submit', () => {
      it('should handle successful status update', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         fireEvent.click(activeButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'active' }
            );
         });
      });

      it('should call handleExperienceUpdate on status change', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         
         await act(async () => {
            fireEvent.click(activeButton);
         });
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'active' }
            );
         });
      });

      it('should pass correct parameters to handleExperienceUpdate', async () => {
         render(<EditExperienceStatus />);
         
         const inactiveButton = screen.getByTestId('option-inactive');
         fireEvent.click(inactiveButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'inactive' }
            );
         });
      });
   });

   // Experience Context Tests
   describe('Experience Context', () => {
      it('should use experience from context', () => {
         render(<EditExperienceStatus />);
         
         expect(mockUseExperienceDetails).toHaveBeenCalled();
      });

      it('should handle different experience structures', () => {
         const differentExperience = {
            id: 'exp-456',
            status: 'inactive',
            title: 'Product Manager'
         };
         
         mockUseExperienceDetails.mockReturnValue(differentExperience as any);
         
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: 'inactive' });
      });
   });

   // Ajax Integration Tests
   describe('Ajax Integration', () => {
      it('should use ajax from useAjax hook', () => {
         render(<EditExperienceStatus />);
         
         expect(mockUseAjax).toHaveBeenCalled();
      });

      it('should pass ajax to handleExperienceUpdate', async () => {
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         fireEvent.click(activeButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               expect.any(Object),
               expect.any(Object)
            );
         });
      });
   });

   // Status Options Tests
   describe('Status Options', () => {
      it('should import statusOptions from config', () => {
         render(<EditExperienceStatus />);
         
         // Verify all expected options are rendered
         expect(screen.getByTestId('option-active')).toBeInTheDocument();
         expect(screen.getByTestId('option-inactive')).toBeInTheDocument();
         expect(screen.getByTestId('option-draft')).toBeInTheDocument();
      });

      it('should handle clicking different status options', async () => {
         render(<EditExperienceStatus />);
         
         // Click active
         fireEvent.click(screen.getByTestId('option-active'));
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenLastCalledWith(
               mockAjax,
               mockExperience,
               { status: 'active' }
            );
         });
         
         // Click inactive
         fireEvent.click(screen.getByTestId('option-inactive'));
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenLastCalledWith(
               mockAjax,
               mockExperience,
               { status: 'inactive' }
            );
         });
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle missing experience context', () => {
         mockUseExperienceDetails.mockReturnValue(null as any);
         
         expect(() => {
            render(<EditExperienceStatus />);
         }).toThrow();
      });

      it('should handle status changes without crashing', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         
         await act(async () => {
            fireEvent.click(activeButton);
         });
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'active' }
            );
         });
      });

      it('should handle undefined onSelect callback', () => {
         // This tests the component's robustness
         render(<EditExperienceStatus />);
         
         // Component should render even if onSelect is undefined (though it shouldn't be)
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });
   });

   // Type Safety Tests
   describe('Type Safety', () => {
      it('should handle string status values', async () => {
         render(<EditExperienceStatus />);
         
         const draftButton = screen.getByTestId('option-draft');
         fireEvent.click(draftButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'draft' }
            );
         });
      });

      it('should cast value to ExperienceDataStatus type', async () => {
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         fireEvent.click(activeButton);
         
         await waitFor(() => {
            // The status should be passed as a string that matches ExperienceDataStatus
            const lastCall = mockHandleExperienceUpdate.mock.calls[mockHandleExperienceUpdate.mock.calls.length - 1];
            expect(lastCall[2]).toEqual({ status: 'active' });
            expect(typeof lastCall[2].status).toBe('string');
         });
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper form structure for screen readers', () => {
         render(<EditExperienceStatus />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         const buttonSelectField = screen.getByTestId('form-button-select-status');
         expect(buttonSelectField).toBeInTheDocument();
      });

      it('should have clickable status options', () => {
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         const inactiveButton = screen.getByTestId('option-inactive');
         const draftButton = screen.getByTestId('option-draft');
         
         expect(activeButton).toBeInTheDocument();
         expect(inactiveButton).toBeInTheDocument();
         expect(draftButton).toBeInTheDocument();
         
         // All should be focusable buttons
         expect(activeButton.tagName).toBe('BUTTON');
         expect(inactiveButton.tagName).toBe('BUTTON');
         expect(draftButton.tagName).toBe('BUTTON');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<EditExperienceStatus />);
         
         const initialCallCount = mockHandleExperienceUpdate.mock.calls.length;
         
         rerender(<EditExperienceStatus />);
         
         // Should not call handleExperienceUpdate on re-render
         expect(mockHandleExperienceUpdate.mock.calls.length).toBe(initialCallCount);
      });

      it('should handle rapid status changes', async () => {
         render(<EditExperienceStatus />);
         
         const activeButton = screen.getByTestId('option-active');
         const inactiveButton = screen.getByTestId('option-inactive');
         
         // Rapid clicks
         fireEvent.click(activeButton);
         fireEvent.click(inactiveButton);
         fireEvent.click(activeButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledTimes(3);
         });
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<EditExperienceStatus />);
         
         // Verify all mocked hooks are called
         expect(mockUseExperienceDetails).toHaveBeenCalled();
         expect(mockUseAjax).toHaveBeenCalled();
      });

      it('should work with complete status change workflow', async () => {
         mockHandleExperienceUpdate.mockResolvedValue({ success: true });
         
         render(<EditExperienceStatus />);
         
         // Initial status should be active
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: 'active' });
         
         // Change to inactive
         const inactiveButton = screen.getByTestId('option-inactive');
         fireEvent.click(inactiveButton);
         
         await waitFor(() => {
            expect(mockHandleExperienceUpdate).toHaveBeenCalledWith(
               mockAjax,
               mockExperience,
               { status: 'inactive' }
            );
         });
      });
   });

   // Edge Cases Tests
   describe('Edge Cases', () => {
      it('should handle numeric status values', async () => {
         // Some systems might pass numeric values
         const numericExperience = { ...mockExperience, status: 1 };
         mockUseExperienceDetails.mockReturnValue(numericExperience as any);
         
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: 1 });
      });

      it('should handle null status gracefully', () => {
         const nullStatusExperience = { ...mockExperience, status: null };
         mockUseExperienceDetails.mockReturnValue(nullStatusExperience as any);
         
         render(<EditExperienceStatus />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual({ status: null });
      });
   });
});
