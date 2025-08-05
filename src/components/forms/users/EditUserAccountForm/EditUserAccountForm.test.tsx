import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserAccountForm from './EditUserAccountForm';

// Mock the text file that tries to instantiate TextResources
jest.mock('./EditUserAccountForm.text', () => ({}));

// Mock the helpers
jest.mock('@/helpers/database.helpers');

// Import the services we need to access in tests
import * as authService from '@/services';
import { updateUserData } from '@/helpers/database.helpers';

// Mock the hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: any) => (
      <form 
         data-testid="edit-user-account-form"
         data-initial-values={JSON.stringify(initialValues)}
         data-edit-mode={editMode}
      >
         {children}
         <button 
            type="submit" 
            onClick={() => onSubmit({ email: 'test@example.com', phone: '123-456-7890' })}
         >
            {submitLabel}
         </button>
      </form>
   ),
   FormInput: ({ fieldName, label, placeholder }: any) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label>{label}</label>
         <input 
            name={fieldName}
            placeholder={placeholder}
            data-testid={`input-${fieldName}`}
         />
      </div>
   )
}));

// Mock useAjax hook
const mockAjax = {
   get: jest.fn(),
   post: jest.fn(),
   put: jest.fn(),
   delete: jest.fn()
};

jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn(() => mockAjax)
}));

// Mock the Auth service
const mockUser = {
   id: 1,
   email: 'john.doe@example.com',
   phone: '+1-555-123-4567',
   name: 'John Doe',
   first_name: 'John',
   last_name: 'Doe'
};

jest.mock('@/services', () => ({
   useAuth: jest.fn(() => ({
      user: mockUser
   }))
}));

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn(() => ({
      textResources: {
         getText: jest.fn((key: string) => {
            const texts: { [key: string]: string } = {
               'EditUserAccountForm.submitLabel': 'Save Changes',
               'EditUserAccountForm.email.label': 'E-mail',
               'EditUserAccountForm.email.placeholder': 'Enter your email...',
               'EditUserAccountForm.phone.label': 'Phone Number',
               'EditUserAccountForm.phone.placeholder': 'Enter your phone number...'
            };
            return texts[key] || `Mocked text for ${key}`;
         })
      }
   }))
}));

describe('EditUserAccountForm', () => {
   // Get the mocked function after all mocks are set up
   const mockUpdateUserData = updateUserData as jest.MockedFunction<typeof updateUserData>;

   beforeEach(() => {
      jest.clearAllMocks();
      // Reset mock implementations to default resolved value
      mockUpdateUserData.mockResolvedValue({} as any);
   });

   it('renders the form with correct structure', () => {
      render(<EditUserAccountForm />);

      expect(screen.getByTestId('edit-user-account-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-email')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-phone')).toBeInTheDocument();
   });

   it('displays correct form labels and placeholders', () => {
      render(<EditUserAccountForm />);

      expect(screen.getByText('E-mail')).toBeInTheDocument();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your phone number...')).toBeInTheDocument();
   });

   it('displays submit button with correct label', () => {
      render(<EditUserAccountForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      expect(submitButton).toBeInTheDocument();
   });

   it('initializes form with user data', () => {
      render(<EditUserAccountForm />);

      const form = screen.getByTestId('edit-user-account-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual(mockUser);
   });

   it('sets form to edit mode', () => {
      render(<EditUserAccountForm />);

      const form = screen.getByTestId('edit-user-account-form');
      expect(form.getAttribute('data-edit-mode')).toBe('true');
   });

   it('calls updateUserData on form submission', async () => {
      mockUpdateUserData.mockResolvedValue({ success: true } as any);

      render(<EditUserAccountForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalledWith(
            mockAjax,
            { email: 'test@example.com', phone: '123-456-7890' }
         );
      });
   });

   it('handles form submission with success', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      mockUpdateUserData.mockResolvedValue(mockResponse as any);

      render(<EditUserAccountForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalled();
      });
   });

   it('renders email input field correctly', () => {
      render(<EditUserAccountForm />);

      const emailInput = screen.getByTestId('input-email');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('name', 'email');
      expect(emailInput).toHaveAttribute('placeholder', 'Enter your email...');
   });

   it('renders phone input field correctly', () => {
      render(<EditUserAccountForm />);

      const phoneInput = screen.getByTestId('input-phone');
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput).toHaveAttribute('name', 'phone');
      expect(phoneInput).toHaveAttribute('placeholder', 'Enter your phone number...');
   });

   it('uses TextResources for internationalization', () => {
      render(<EditUserAccountForm />);

      // The component should use TextResources - we can verify by checking rendered text
      expect(screen.getByText('E-mail')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
   });

   it('handles user with minimal data', () => {
      const mockUseAuth = authService.useAuth as jest.MockedFunction<typeof authService.useAuth>;
      mockUseAuth.mockReturnValue({
         user: { id: 1, email: '', phone: '' } as any,
         loading: false,
         login: jest.fn(),
         register: jest.fn(),
         logout: jest.fn()
      });

      render(<EditUserAccountForm />);

      const form = screen.getByTestId('edit-user-account-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({ id: 1, email: '', phone: '' });
   });

   it('handles undefined user gracefully', () => {
      const mockUseAuth = authService.useAuth as jest.MockedFunction<typeof authService.useAuth>;
      mockUseAuth.mockReturnValue({
         user: null,
         loading: false,
         login: jest.fn(),
         register: jest.fn(),
         logout: jest.fn()
      });

      render(<EditUserAccountForm />);

      const form = screen.getByTestId('edit-user-account-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({});
   });

   it('passes ajax instance to updateUserData', async () => {
      mockUpdateUserData.mockResolvedValue({ success: true } as any);

      render(<EditUserAccountForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalledWith(
            mockAjax,
            expect.any(Object)
         );
      });
   });

   it('maintains form structure with all required fields', () => {
      render(<EditUserAccountForm />);

      // Check that both required form inputs are present
      expect(screen.getByTestId('form-input-email')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-phone')).toBeInTheDocument();
      
      // Check that the form and submit button are present
      expect(screen.getByTestId('edit-user-account-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
   });

   it('handles text resource loading properly', () => {
      render(<EditUserAccountForm />);

      // Verify that all expected texts are displayed
      expect(screen.getByText('E-mail')).toBeInTheDocument();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
   });
});
