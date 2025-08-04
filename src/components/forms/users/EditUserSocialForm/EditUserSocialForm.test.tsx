import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditUserSocialForm from './EditUserSocialForm';

// Mock the helpers
jest.mock('@/helpers/database.helpers', () => ({
   updateUserData: jest.fn()
}));

// Mock the hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: any) => (
      <form 
         data-testid="edit-user-social-form"
         data-initial-values={JSON.stringify(initialValues)}
         data-edit-mode={editMode}
      >
         {children}
         <button 
            type="submit" 
            onClick={() => onSubmit({ 
               github_url: 'https://github.com/johndoe',
               linkedin_url: 'https://linkedin.com/in/johndoe',
               whatsapp_number: '+1234567890',
               portfolio_url: 'https://johndoe.dev'
            })}
         >
            {submitLabel}
         </button>
      </form>
   ),
   FormInput: ({ fieldName, label, placeholder }: any) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label htmlFor={fieldName}>{label}</label>
         <input 
            id={fieldName}
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
   github_url: 'https://github.com/johndoe',
   linkedin_url: 'https://linkedin.com/in/johndoe',
   whatsapp_number: '+1-555-123-4567',
   portfolio_url: 'https://johndoe.portfolio.com'
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
               'EditUserSocialForm.submitLabel': 'Save Changes',
               'EditUserSocialForm.githubUrl.label': 'GitHub URL',
               'EditUserSocialForm.githubUrl.placeholder': 'Enter your GitHub profile URL...',
               'EditUserSocialForm.linkedinUrl.label': 'LinkedIn URL',
               'EditUserSocialForm.linkedinUrl.placeholder': 'Enter your LinkedIn profile URL...',
               'EditUserSocialForm.whatsappNumber.label': 'WhatsApp Number',
               'EditUserSocialForm.whatsappNumber.placeholder': 'Enter your WhatsApp number...',
               'EditUserSocialForm.portfolioUrl.label': 'Portfolio URL',
               'EditUserSocialForm.portfolioUrl.placeholder': 'Enter your portfolio URL...'
            };
            return texts[key] || `Mocked text for ${key}`;
         })
      }
   }))
}));

// Import the mocked helper after setting up mocks
const { updateUserData } = require('@/helpers/database.helpers');

describe('EditUserSocialForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('renders the form with correct structure', () => {
      render(<EditUserSocialForm />);

      expect(screen.getByTestId('edit-user-social-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-github_url')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-linkedin_url')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-whatsapp_number')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-portfolio_url')).toBeInTheDocument();
   });

   it('displays correct form labels and placeholders', () => {
      render(<EditUserSocialForm />);

      expect(screen.getByText('GitHub URL')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn URL')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Number')).toBeInTheDocument();
      expect(screen.getByText('Portfolio URL')).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Enter your GitHub profile URL...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your LinkedIn profile URL...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your WhatsApp number...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your portfolio URL...')).toBeInTheDocument();
   });

   it('displays submit button with correct label', () => {
      render(<EditUserSocialForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      expect(submitButton).toBeInTheDocument();
   });

   it('initializes form with user data', () => {
      render(<EditUserSocialForm />);

      const form = screen.getByTestId('edit-user-social-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual(mockUser);
   });

   it('sets form to edit mode', () => {
      render(<EditUserSocialForm />);

      const form = screen.getByTestId('edit-user-social-form');
      expect(form.getAttribute('data-edit-mode')).toBe('true');
   });

   it('calls updateUserData on form submission', async () => {
      updateUserData.mockResolvedValue({ success: true });

      render(<EditUserSocialForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(updateUserData).toHaveBeenCalledWith(
            mockAjax,
            {
               github_url: 'https://github.com/johndoe',
               linkedin_url: 'https://linkedin.com/in/johndoe',
               whatsapp_number: '+1234567890',
               portfolio_url: 'https://johndoe.dev'
            }
         );
      });
   });

   it('renders all social media input fields correctly', () => {
      render(<EditUserSocialForm />);

      const githubInput = screen.getByTestId('input-github_url');
      expect(githubInput).toBeInTheDocument();
      expect(githubInput).toHaveAttribute('name', 'github_url');

      const linkedinInput = screen.getByTestId('input-linkedin_url');
      expect(linkedinInput).toBeInTheDocument();
      expect(linkedinInput).toHaveAttribute('name', 'linkedin_url');

      const whatsappInput = screen.getByTestId('input-whatsapp_number');
      expect(whatsappInput).toBeInTheDocument();
      expect(whatsappInput).toHaveAttribute('name', 'whatsapp_number');

      const portfolioInput = screen.getByTestId('input-portfolio_url');
      expect(portfolioInput).toBeInTheDocument();
      expect(portfolioInput).toHaveAttribute('name', 'portfolio_url');
   });

   it('handles form submission with success', async () => {
      const mockResponse = { success: true, data: { id: 1 } };
      updateUserData.mockResolvedValue(mockResponse);

      render(<EditUserSocialForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(updateUserData).toHaveBeenCalled();
      });
   });

   it('handles form submission error gracefully', async () => {
      const mockError = new Error('Update failed');
      updateUserData.mockRejectedValue(mockError);

      render(<EditUserSocialForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(updateUserData).toHaveBeenCalled();
      });
   });

   it('uses TextResources for internationalization', () => {
      const { useTextResources } = require('@/services/TextResources/TextResourcesProvider');
      
      render(<EditUserSocialForm />);

      expect(useTextResources).toHaveBeenCalled();
   });

   it('handles user with minimal social data', () => {
      const { useAuth } = require('@/services');
      useAuth.mockReturnValue({
         user: { id: 1, github_url: '', linkedin_url: '' }
      });

      render(<EditUserSocialForm />);

      const form = screen.getByTestId('edit-user-social-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({ id: 1, github_url: '', linkedin_url: '' });
   });

   it('handles undefined user gracefully', () => {
      const { useAuth } = require('@/services');
      useAuth.mockReturnValue({
         user: undefined
      });

      render(<EditUserSocialForm />);

      const form = screen.getByTestId('edit-user-social-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({});
   });

   it('passes ajax instance to updateUserData', async () => {
      updateUserData.mockResolvedValue({ success: true });

      render(<EditUserSocialForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(updateUserData).toHaveBeenCalledWith(
            mockAjax,
            expect.any(Object)
         );
      });
   });

   it('contains all required social media fields', () => {
      render(<EditUserSocialForm />);

      // Verify all expected social fields are present
      const expectedFields = ['github_url', 'linkedin_url', 'whatsapp_number', 'portfolio_url'];
      expectedFields.forEach(fieldName => {
         expect(screen.getByTestId(`form-input-${fieldName}`)).toBeInTheDocument();
      });
   });

   it('maintains proper form structure and accessibility', () => {
      render(<EditUserSocialForm />);

      // Check that form has proper structure
      expect(screen.getByTestId('edit-user-social-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();

      // Check that all fields have labels
      const labels = ['GitHub URL', 'LinkedIn URL', 'WhatsApp Number', 'Portfolio URL'];
      labels.forEach(label => {
         expect(screen.getByText(label)).toBeInTheDocument();
      });
   });

   it('handles text resource loading properly', () => {
      render(<EditUserSocialForm />);

      // Verify that all expected texts are displayed
      expect(screen.getByText('GitHub URL')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn URL')).toBeInTheDocument();
      expect(screen.getByText('WhatsApp Number')).toBeInTheDocument();
      expect(screen.getByText('Portfolio URL')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
   });

   it('handles user with complete social profile', () => {
      const userWithCompleteSocial = {
         id: 1,
         github_url: 'https://github.com/developer',
         linkedin_url: 'https://linkedin.com/in/developer',
         whatsapp_number: '+5511999888777',
         portfolio_url: 'https://developer.portfolio.com'
      };

      const { useAuth } = require('@/services');
      useAuth.mockReturnValue({
         user: userWithCompleteSocial
      });

      render(<EditUserSocialForm />);

      const form = screen.getByTestId('edit-user-social-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      expect(initialValues).toEqual(userWithCompleteSocial);
   });

   it('handles URL validation expectations', () => {
      render(<EditUserSocialForm />);

      // The form should handle URL fields for social profiles
      const urlFields = ['github_url', 'linkedin_url', 'portfolio_url'];
      urlFields.forEach(fieldName => {
         const input = screen.getByTestId(`input-${fieldName}`);
         expect(input).toBeInTheDocument();
         expect(input).toHaveAttribute('name', fieldName);
      });

      // WhatsApp should handle phone numbers
      const whatsappInput = screen.getByTestId('input-whatsapp_number');
      expect(whatsappInput).toBeInTheDocument();
      expect(whatsappInput).toHaveAttribute('name', 'whatsapp_number');
   });
});
