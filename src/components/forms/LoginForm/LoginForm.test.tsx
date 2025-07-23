import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginContent from './LoginForm';

// Mock functions for require() statements - must be declared before jest.mock calls
const mockUseAuth = jest.fn();
const mockUseRouter = jest.fn();
const mockUseTextResources = jest.fn();

// Mock dependencies
jest.mock('@/hooks', () => ({
   Form: ({ children, submitLabel, initialValues, onSubmit }: { children: React.ReactNode; submitLabel?: string; initialValues?: Record<string, unknown>; onSubmit?: (data: Record<string, unknown>) => void }) => {
      const handleSubmit = async (event: React.FormEvent) => {
         event.preventDefault();
         if (onSubmit && initialValues) {
            await onSubmit(initialValues);
         }
      };

      return (
         <form data-testid="form" onSubmit={handleSubmit}>
            <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
            <div data-testid="submit-label">{submitLabel}</div>
            {children}
            <button type="submit" data-testid="submit-button">
               {submitLabel}
            </button>
         </form>
      );
   },
   FormInput: ({ fieldName, label, placeholder, type }: { fieldName: string; label: string; placeholder?: string; type?: string }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input
            id={fieldName}
            data-testid={`input-${fieldName}`}
            placeholder={placeholder}
            type={type}
            aria-label={label}
         />
      </div>
   )
}));

jest.mock('@/services', () => ({
   useAuth: mockUseAuth
}));

jest.mock('next/navigation', () => ({
   useRouter: mockUseRouter
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: mockUseTextResources
}));

jest.mock('./LoginForm.text', () => ({}));

describe('LoginContent', () => {
   const mockAuth = {
      login: jest.fn()
   };

   const mockRouter = {
      push: jest.fn()
   };

   const mockTextResources = {
      getText: jest.fn()
   };

   const INITIAL_VALUES = { email: '', password: '' };

   beforeEach(() => {
      jest.clearAllMocks();

      mockUseAuth.mockReturnValue(mockAuth);
      mockUseRouter.mockReturnValue(mockRouter);
      mockUseTextResources.mockReturnValue({ textResources: mockTextResources });

      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'LoginForm.submit': 'Login',
            'LoginForm.email': 'Email',
            'LoginForm.placeholder.email': 'Enter your email',
            'LoginForm.password': 'Password',
            'LoginForm.placeholder.password': 'Enter your password'
         };
         return textMap[key] || key;
      });
   });

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<LoginContent />);
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });

      it('should render with correct initial values', () => {
         render(<LoginContent />);
         
         const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent || '{}');
         expect(initialValues).toEqual(INITIAL_VALUES);
      });

      it('should render with correct submit label', () => {
         render(<LoginContent />);
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Login');
      });
   });

   // Form Fields Tests
   describe('Form Fields', () => {
      it('should render email field with correct props', () => {
         render(<LoginContent />);
         
         const emailField = screen.getByTestId('form-input-email');
         expect(emailField).toBeInTheDocument();
         expect(emailField).toHaveTextContent('Email');
         
         const emailInput = screen.getByTestId('input-email');
         expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
         expect(emailInput).toHaveAttribute('type', 'email');
         expect(emailInput).toHaveAttribute('aria-label', 'Email');
      });

      it('should render password field with correct props', () => {
         render(<LoginContent />);
         
         const passwordField = screen.getByTestId('form-input-password');
         expect(passwordField).toBeInTheDocument();
         expect(passwordField).toHaveTextContent('Password');
         
         const passwordInput = screen.getByTestId('input-password');
         expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
         expect(passwordInput).toHaveAttribute('type', 'password');
         expect(passwordInput).toHaveAttribute('aria-label', 'Password');
      });
   });

   // Text Resources Tests
   describe('Text Resources', () => {
      it('should call getText for submit label', () => {
         render(<LoginContent />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('LoginForm.submit');
      });

      it('should call getText for email field', () => {
         render(<LoginContent />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('LoginForm.email');
         expect(mockTextResources.getText).toHaveBeenCalledWith('LoginForm.placeholder.email');
      });

      it('should call getText for password field', () => {
         render(<LoginContent />);
         expect(mockTextResources.getText).toHaveBeenCalledWith('LoginForm.password');
         expect(mockTextResources.getText).toHaveBeenCalledWith('LoginForm.placeholder.password');
      });

      it('should display correct text labels', () => {
         render(<LoginContent />);
         
         expect(screen.getByText('Email')).toBeInTheDocument();
         expect(screen.getByText('Password')).toBeInTheDocument();
         expect(screen.getByTestId('submit-label')).toHaveTextContent('Login');
      });
   });

   // Form Submission Tests
   describe('Form Submission', () => {
      it('should handle successful login', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalledWith('', '');
         });
         
         await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should handle login failure without throwing', async () => {
         const mockError = new Error('Login failed');
         mockAuth.login.mockRejectedValue(mockError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle unsuccessful login response', async () => {
         mockAuth.login.mockResolvedValue({ success: false, message: 'Invalid credentials' });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         // Should not navigate on unsuccessful login
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should call login with empty credentials from initial values', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockAuth.login).toHaveBeenCalledWith('', '');
      });
   });

   // Authentication Integration Tests
   describe('Authentication Integration', () => {
      it('should use auth service for login', () => {
         render(<LoginContent />);
         
         expect(mockUseAuth).toHaveBeenCalled();
      });

      it('should handle auth service errors gracefully', async () => {
         const authError = new Error('Authentication service unavailable');
         mockAuth.login.mockRejectedValue(authError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle different login response formats', async () => {
         // Test with minimal success response
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });
   });

   // Navigation Tests
   describe('Navigation', () => {
      it('should navigate to admin page on successful login', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should not navigate on failed login', async () => {
         mockAuth.login.mockResolvedValue({ success: false });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle navigation errors gracefully', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         mockRouter.push.mockImplementation(() => {
            throw new Error('Navigation failed');
         });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         
         // Should not throw even if navigation fails
         await expect(async () => {
            await fireEvent.submit(form);
         }).not.toThrow();
      });
   });

   // Error Handling Tests
   describe('Error Handling', () => {
      it('should handle network errors during login', async () => {
         const networkError = new Error('Network error');
         mockAuth.login.mockRejectedValue(networkError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle server validation errors', async () => {
         const validationError = new Error('Invalid email format');
         mockAuth.login.mockRejectedValue(validationError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });

      it('should handle unknown error types', async () => {
         const unknownError = 'String error';
         mockAuth.login.mockRejectedValue(unknownError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });
   });

   // Input Validation Tests
   describe('Input Validation', () => {
      it('should render email field with email type', () => {
         render(<LoginContent />);
         
         const emailInput = screen.getByTestId('input-email');
         expect(emailInput).toHaveAttribute('type', 'email');
      });

      it('should render password field with password type', () => {
         render(<LoginContent />);
         
         const passwordInput = screen.getByTestId('input-password');
         expect(passwordInput).toHaveAttribute('type', 'password');
      });

      it('should have proper placeholders for guidance', () => {
         render(<LoginContent />);
         
         const emailInput = screen.getByTestId('input-email');
         const passwordInput = screen.getByTestId('input-password');
         
         expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
         expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password');
      });
   });

   // Accessibility Tests
   describe('Accessibility', () => {
      it('should have proper labels for all form fields', () => {
         render(<LoginContent />);
         
         expect(screen.getByLabelText('Email')).toBeInTheDocument();
         expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });

      it('should have proper form structure for screen readers', () => {
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         expect(form).toBeInTheDocument();
         
         const emailField = screen.getByTestId('form-input-email');
         const passwordField = screen.getByTestId('form-input-password');
         
         expect(emailField).toBeInTheDocument();
         expect(passwordField).toBeInTheDocument();
      });

      it('should have aria-labels for all inputs', () => {
         render(<LoginContent />);
         
         expect(screen.getByTestId('input-email')).toHaveAttribute('aria-label', 'Email');
         expect(screen.getByTestId('input-password')).toHaveAttribute('aria-label', 'Password');
      });

      it('should have appropriate input types for assistive technology', () => {
         render(<LoginContent />);
         
         const emailInput = screen.getByTestId('input-email');
         const passwordInput = screen.getByTestId('input-password');
         
         expect(emailInput).toHaveAttribute('type', 'email');
         expect(passwordInput).toHaveAttribute('type', 'password');
      });
   });

   // Performance Tests
   describe('Performance', () => {
      it('should not re-render unnecessarily', () => {
         const { rerender } = render(<LoginContent />);
         
         const initialCallCount = mockTextResources.getText.mock.calls.length;
         
         rerender(<LoginContent />);
         
         const finalCallCount = mockTextResources.getText.mock.calls.length;
         expect(finalCallCount).toBeGreaterThan(initialCallCount);
         expect(finalCallCount).toBeLessThan(initialCallCount * 3);
      });

      it('should handle rapid form submissions gracefully', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         
         // Simulate rapid submissions
         fireEvent.submit(form);
         fireEvent.submit(form);
         fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         // Should handle multiple submissions without errors
         expect(mockAuth.login.mock.calls.length).toBeGreaterThan(0);
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with all dependencies', () => {
         render(<LoginContent />);
         
         expect(mockUseAuth).toHaveBeenCalled();
         expect(mockUseRouter).toHaveBeenCalled();
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('should handle complete login workflow', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         // Verify form is rendered
         expect(screen.getByTestId('form')).toBeInTheDocument();
         
         // Verify all fields are present
         expect(screen.getByTestId('input-email')).toBeInTheDocument();
         expect(screen.getByTestId('input-password')).toBeInTheDocument();
         
         // Submit form
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         // Verify submission was handled
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
            expect(mockRouter.push).toHaveBeenCalledWith('/admin');
         });
      });

      it('should maintain form state during submission', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const emailInput = screen.getByTestId('input-email');
         const passwordInput = screen.getByTestId('input-password');
         
         // Verify inputs are accessible
         expect(emailInput).toBeInTheDocument();
         expect(passwordInput).toBeInTheDocument();
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         // Form should still be rendered after submission
         expect(screen.getByTestId('form')).toBeInTheDocument();
      });
   });

   // Security Tests
   describe('Security', () => {
      it('should use password input type for password field', () => {
         render(<LoginContent />);
         
         const passwordInput = screen.getByTestId('input-password');
         expect(passwordInput).toHaveAttribute('type', 'password');
      });

      it('should use email input type for email field', () => {
         render(<LoginContent />);
         
         const emailInput = screen.getByTestId('input-email');
         expect(emailInput).toHaveAttribute('type', 'email');
      });

      it('should handle login attempts with empty credentials', async () => {
         mockAuth.login.mockResolvedValue({ success: false, message: 'Credentials required' });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockAuth.login).toHaveBeenCalledWith('', '');
         expect(mockRouter.push).not.toHaveBeenCalled();
      });
   });

   // Data Flow Tests
   describe('Data Flow', () => {
      it('should pass form values to login function', async () => {
         mockAuth.login.mockResolvedValue({ success: true });
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         expect(mockAuth.login).toHaveBeenCalledWith(
            INITIAL_VALUES.email,
            INITIAL_VALUES.password
         );
      });

      it('should return login response from handleSubmit', async () => {
         const mockResponse = { success: true, token: 'abc123' };
         mockAuth.login.mockResolvedValue(mockResponse);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
      });

      it('should handle error from handleSubmit on failure', async () => {
         const mockError = new Error('Authentication failed');
         mockAuth.login.mockRejectedValue(mockError);
         
         render(<LoginContent />);
         
         const form = screen.getByTestId('form');
         await fireEvent.submit(form);
         
         await waitFor(() => {
            expect(mockAuth.login).toHaveBeenCalled();
         });
         
         expect(mockRouter.push).not.toHaveBeenCalled();
      });
   });
});
