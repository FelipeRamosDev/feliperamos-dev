import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserPersonalForm from './EditUserPersonalForm';
import React from 'react';
import { UserData } from '@/services/Auth/Auth.types';

// Import the services we need to access in tests
import * as authService from '@/services';

// Mock the text file that tries to instantiate TextResources
jest.mock('./EditUserPersonalForm.text', () => ({}));

// Mock the helpers
jest.mock('@/helpers/database.helpers');
import { updateUserData } from '@/helpers/database.helpers';
const mockUpdateUserData = updateUserData as jest.MockedFunction<typeof updateUserData>;

// Mock the hooks
jest.mock('@/hooks', () => ({
   Form: ({ children, initialValues, submitLabel, onSubmit, editMode }: {
      children: React.ReactNode;
      initialValues: Record<string, unknown>;
      submitLabel: string;
      onSubmit: (values: Record<string, unknown>) => void;
      editMode: boolean;
   }) => (
      <form 
         data-testid="edit-user-personal-form"
         data-initial-values={JSON.stringify(initialValues)}
         data-edit-mode={editMode}
      >
         {children}
         <button 
            type="submit" 
            onClick={() => onSubmit({ 
               first_name: 'John', 
               last_name: 'Doe',
               birth_date: '1990-01-01',
               city: 'New York',
               state: 'NY',
               country: 'USA'
            })}
         >
            {submitLabel}
         </button>
      </form>
   ),
   FormInput: ({ fieldName, label, placeholder }: {
      fieldName: string;
      label: string;
      placeholder: string;
   }) => (
      <div data-testid={`form-input-${fieldName}`}>
         <label>{label}</label>
         <input 
            name={fieldName}
            placeholder={placeholder}
            data-testid={`input-${fieldName}`}
         />
      </div>
   ),
   FormDatePicker: ({ fieldName, label }: {
      fieldName: string;
      label: string;
   }) => (
      <div data-testid={`form-date-picker-${fieldName}`}>
         <label>{label}</label>
         <input 
            title={label}
            type="date"
            name={fieldName}
            data-testid={`date-picker-${fieldName}`}
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
   first_name: 'John',
   last_name: 'Doe',
   birth_date: '1990-01-01',
   city: 'San Francisco',
   state: 'California',
   country: 'United States'
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
               'EditUserPersonalForm.submitLabel': 'Save Changes',
               'EditUserPersonalForm.firstName.label': 'First Name',
               'EditUserPersonalForm.firstName.placeholder': 'Enter your first name...',
               'EditUserPersonalForm.lastName.label': 'Last Name',
               'EditUserPersonalForm.lastName.placeholder': 'Enter your last name...',
               'EditUserPersonalForm.birthDate.label': 'Birth Date',
               'EditUserPersonalForm.city.label': 'City',
               'EditUserPersonalForm.city.placeholder': 'Enter your city...',
               'EditUserPersonalForm.state.label': 'State',
               'EditUserPersonalForm.state.placeholder': 'Enter your state...',
               'EditUserPersonalForm.country.label': 'Country',
               'EditUserPersonalForm.country.placeholder': 'Enter your country...'
            };
            return texts[key] || `Mocked text for ${key}`;
         })
      }
   }))
}));

describe('EditUserPersonalForm', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('renders the form with correct structure', () => {
      render(<EditUserPersonalForm />);

      expect(screen.getByTestId('edit-user-personal-form')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-first_name')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-last_name')).toBeInTheDocument();
      expect(screen.getByTestId('form-date-picker-birth_date')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-city')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-state')).toBeInTheDocument();
      expect(screen.getByTestId('form-input-country')).toBeInTheDocument();
   });

   it('displays correct form labels and placeholders', () => {
      render(<EditUserPersonalForm />);

      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Birth Date')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Enter your first name...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your last name...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your city...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your state...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your country...')).toBeInTheDocument();
   });

   it('displays submit button with correct label', () => {
      render(<EditUserPersonalForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      expect(submitButton).toBeInTheDocument();
   });

   it('initializes form with user data', () => {
      render(<EditUserPersonalForm />);

      const form = screen.getByTestId('edit-user-personal-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual(mockUser);
   });

   it('sets form to edit mode', () => {
      render(<EditUserPersonalForm />);

      const form = screen.getByTestId('edit-user-personal-form');
      expect(form.getAttribute('data-edit-mode')).toBe('true');
   });

   it('calls updateUserData on form submission', async () => {
      mockUpdateUserData.mockResolvedValue({} as UserData);

      render(<EditUserPersonalForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalledWith(
            mockAjax,
            {
               first_name: 'John',
               last_name: 'Doe',
               birth_date: '1990-01-01',
               city: 'New York',
               state: 'NY',
               country: 'USA'
            }
         );
      });
   });

   it('renders all input fields correctly', () => {
      render(<EditUserPersonalForm />);

      const firstNameInput = screen.getByTestId('input-first_name');
      expect(firstNameInput).toBeInTheDocument();
      expect(firstNameInput).toHaveAttribute('name', 'first_name');

      const lastNameInput = screen.getByTestId('input-last_name');
      expect(lastNameInput).toBeInTheDocument();
      expect(lastNameInput).toHaveAttribute('name', 'last_name');

      const cityInput = screen.getByTestId('input-city');
      expect(cityInput).toBeInTheDocument();
      expect(cityInput).toHaveAttribute('name', 'city');

      const stateInput = screen.getByTestId('input-state');
      expect(stateInput).toBeInTheDocument();
      expect(stateInput).toHaveAttribute('name', 'state');

      const countryInput = screen.getByTestId('input-country');
      expect(countryInput).toBeInTheDocument();
      expect(countryInput).toHaveAttribute('name', 'country');
   });

   it('renders birth date picker correctly', () => {
      render(<EditUserPersonalForm />);

      const birthDatePicker = screen.getByTestId('date-picker-birth_date');
      expect(birthDatePicker).toBeInTheDocument();
      expect(birthDatePicker).toHaveAttribute('type', 'date');
      expect(birthDatePicker).toHaveAttribute('name', 'birth_date');
   });

   it('handles form submission with success', async () => {
      const mockResponse = {} as UserData;
      mockUpdateUserData.mockResolvedValue(mockResponse);

      render(<EditUserPersonalForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalled();
      });
   });

   it('uses TextResources for internationalization', () => {
      render(<EditUserPersonalForm />);

      // The component should use TextResources - we can verify by checking rendered text
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
   });

   it('handles user with minimal data', () => {
      const mockUseAuth = authService.useAuth as jest.MockedFunction<typeof authService.useAuth>;
      mockUseAuth.mockReturnValue({
         user: { id: 1, first_name: '', last_name: '' } as UserData,
         loading: false,
         login: jest.fn(),
         register: jest.fn(),
         logout: jest.fn()
      });

      render(<EditUserPersonalForm />);

      const form = screen.getByTestId('edit-user-personal-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({ id: 1, first_name: '', last_name: '' });
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

      render(<EditUserPersonalForm />);

      const form = screen.getByTestId('edit-user-personal-form');
      const initialValues = JSON.parse(form.getAttribute('data-initial-values') || '{}');
      
      expect(initialValues).toEqual({});
   });

   it('passes ajax instance to updateUserData', async () => {
      mockUpdateUserData.mockResolvedValue({} as UserData);

      render(<EditUserPersonalForm />);

      const submitButton = screen.getByRole('button', { name: 'Save Changes' });
      fireEvent.click(submitButton);

      await waitFor(() => {
         expect(mockUpdateUserData).toHaveBeenCalledWith(
            mockAjax,
            expect.any(Object)
         );
      });
   });

   it('contains all required personal information fields', () => {
      render(<EditUserPersonalForm />);

      // Verify all expected form fields are present
      const expectedFields = ['first_name', 'last_name', 'city', 'state', 'country'];
      expectedFields.forEach(fieldName => {
         expect(screen.getByTestId(`form-input-${fieldName}`)).toBeInTheDocument();
      });

      // Verify date picker is present
      expect(screen.getByTestId('form-date-picker-birth_date')).toBeInTheDocument();
   });

   it('maintains proper form structure and accessibility', () => {
      render(<EditUserPersonalForm />);

      // Check that form has proper structure
      expect(screen.getByTestId('edit-user-personal-form')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();

      // Check that all fields have labels
      const labels = ['First Name', 'Last Name', 'Birth Date', 'City', 'State', 'Country'];
      labels.forEach(label => {
         expect(screen.getByText(label)).toBeInTheDocument();
      });
   });

   it('handles text resource loading properly', () => {
      render(<EditUserPersonalForm />);

      // Verify that all expected texts are displayed
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Birth Date')).toBeInTheDocument();
      expect(screen.getByText('City')).toBeInTheDocument();
      expect(screen.getByText('State')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
   });
});
