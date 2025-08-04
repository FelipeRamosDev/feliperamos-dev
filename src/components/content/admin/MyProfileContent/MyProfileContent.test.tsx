import { render, screen, fireEvent } from '@testing-library/react';
import MyProfileContent from './MyProfileContent';
import { useAuth } from '@/services';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

// Mock all the dependencies
jest.mock('@/services', () => ({
   useAuth: jest.fn()
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

jest.mock('next/link', () => {
   const Link = ({ children, href, target, ...props }: any) => (
      <a href={href} target={target} {...props}>
         {children}
      </a>
   );
   Link.displayName = 'Link';
   return Link;
});

jest.mock('@/components/buttons', () => ({
   EditButtons: ({ editMode, setEditMode }: any) => (
      <button
         data-testid="edit-buttons"
         data-edit-mode={editMode}
         onClick={() => setEditMode(!editMode)}
      >
         {editMode ? 'Cancel' : 'Edit'}
      </button>
   )
}));

jest.mock('@/components/common', () => ({
   Card: ({ children, padding }: any) => (
      <div data-testid="card" data-padding={padding}>
         {children}
      </div>
   ),
   Container: ({ children }: any) => (
      <div data-testid="container">{children}</div>
   ),
   DateView: ({ type, date }: any) => (
      <span data-testid="date-view" data-type={type}>
         {date ? new Date(date).toLocaleDateString() : ''}
      </span>
   )
}));

jest.mock('@/components/headers', () => ({
   PageHeader: ({ title, description }: any) => (
      <header data-testid="page-header">
         <h1>{title}</h1>
         <p>{description}</p>
      </header>
   ),
   WidgetHeader: ({ title, children }: any) => (
      <div data-testid="widget-header">
         <h2>{title}</h2>
         {children}
      </div>
   )
}));

jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children }: any) => (
      <div data-testid="content-sidebar">{children}</div>
   ),
   DataContainer: ({ children, vertical }: any) => (
      <div data-testid="data-container" data-vertical={vertical}>
         {children}
      </div>
   )
}));

jest.mock('@/components/forms/users', () => ({
   EditUserAccountForm: () => <div data-testid="edit-user-account-form">Account Form</div>,
   EditUserPersonalForm: () => <div data-testid="edit-user-personal-form">Personal Form</div>,
   EditUserSocialForm: () => <div data-testid="edit-user-social-form">Social Form</div>
}));

jest.mock('@mui/icons-material', () => ({
   Camera: () => <span data-testid="CameraIcon">Camera</span>,
   GitHub: () => <span data-testid="GitHubIcon">GitHub</span>,
   LinkedIn: () => <span data-testid="LinkedInIcon">LinkedIn</span>,
   WhatsApp: () => <span data-testid="WhatsAppIcon">WhatsApp</span>
}));

jest.mock('@/helpers/parse.helpers', () => ({
   onlyNumbers: jest.fn((str) => str?.replace(/\D/g, '') || '')
}));

const mockUser = {
   id: 1,
   email: 'test@example.com',
   phone: '+1234567890',
   first_name: 'John',
   last_name: 'Doe',
   birth_date: new Date('1990-01-01'),
   city: 'New York',
   state: 'NY',
   country: 'USA',
   github_url: 'https://github.com/johndoe',
   linkedin_url: 'https://linkedin.com/in/johndoe',
   whatsapp_number: '+1234567890',
   portfolio_url: 'https://johndoe.com'
};

describe('MyProfileContent', () => {
   const mockTextResources = {
      getText: jest.fn(),
      currentLanguage: 'en'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      
      (useAuth as jest.Mock).mockReturnValue({
         user: mockUser
      });
      
      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'MyProfileContent.pageTitle': 'My Profile',
            'MyProfileContent.pageDescription': 'Manage your profile information',
            'MyProfileContent.widgetAccount.title': 'Account Information',
            'MyProfileContent.widgetPersonal.title': 'Personal Information',
            'MyProfileContent.widgetSocial.title': 'Social Links',
            'MyProfileContent.fields.email': 'Email',
            'MyProfileContent.fields.phoneNumber': 'Phone Number',
            'MyProfileContent.fields.firstName': 'First Name',
            'MyProfileContent.fields.lastName': 'Last Name',
            'MyProfileContent.fields.birthDate': 'Birth Date',
            'MyProfileContent.fields.city': 'City',
            'MyProfileContent.fields.state': 'State',
            'MyProfileContent.fields.country': 'Country',
            'MyProfileContent.fields.id': 'ID'
         };
         return texts[key] || key;
      });
   });

   it('renders the page header with title and description', () => {
      render(<MyProfileContent />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByText('My Profile')).toBeInTheDocument();
      expect(screen.getByText('Manage your profile information')).toBeInTheDocument();
   });

   it('renders all three main widgets', () => {
      render(<MyProfileContent />);

      expect(screen.getByText('Account Information')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Social Links')).toBeInTheDocument();
   });

   describe('Account Information Widget', () => {
      it('displays account information in view mode', () => {
         render(<MyProfileContent />);

         expect(screen.getByText('Email')).toBeInTheDocument();
         expect(screen.getByText('Phone Number')).toBeInTheDocument();
         
         const emailLink = screen.getByRole('link', { name: 'test@example.com' });
         expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
         
         const phoneLink = screen.getByRole('link', { name: '+1234567890' });
         expect(phoneLink).toHaveAttribute('href', 'tel:+1234567890');
      });

      it('switches to edit mode when edit button is clicked', () => {
         render(<MyProfileContent />);

         const editButtons = screen.getAllByTestId('edit-buttons');
         const accountEditButton = editButtons[0]; // First edit button is for account
         
         fireEvent.click(accountEditButton);
         
         expect(screen.getByTestId('edit-user-account-form')).toBeInTheDocument();
         expect(screen.queryByText('Email')).not.toBeInTheDocument();
      });
   });

   describe('Personal Information Widget', () => {
      it('displays personal information in view mode', () => {
         render(<MyProfileContent />);

         expect(screen.getByText('First Name')).toBeInTheDocument();
         expect(screen.getByText('Last Name')).toBeInTheDocument();
         expect(screen.getByText('Birth Date')).toBeInTheDocument();
         expect(screen.getByText('City')).toBeInTheDocument();
         expect(screen.getByText('State')).toBeInTheDocument();
         expect(screen.getByText('Country')).toBeInTheDocument();
         
         expect(screen.getByText('John')).toBeInTheDocument();
         expect(screen.getByText('Doe')).toBeInTheDocument();
         expect(screen.getByText('New York')).toBeInTheDocument();
         expect(screen.getByText('NY')).toBeInTheDocument();
         expect(screen.getByText('USA')).toBeInTheDocument();
      });

      it('switches to edit mode when edit button is clicked', () => {
         render(<MyProfileContent />);

         const editButtons = screen.getAllByTestId('edit-buttons');
         const personalEditButton = editButtons[1]; // Second edit button is for personal
         
         fireEvent.click(personalEditButton);
         
         expect(screen.getByTestId('edit-user-personal-form')).toBeInTheDocument();
         expect(screen.queryByText('First Name')).not.toBeInTheDocument();
      });
   });

   describe('Social Links Widget', () => {
      it('displays social links in view mode', () => {
         render(<MyProfileContent />);

         expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
         expect(screen.getByTestId('LinkedInIcon')).toBeInTheDocument();
         expect(screen.getByTestId('WhatsAppIcon')).toBeInTheDocument();
         expect(screen.getByTestId('CameraIcon')).toBeInTheDocument();
         
         const githubLink = screen.getByRole('link', { name: 'https://github.com/johndoe' });
         expect(githubLink).toHaveAttribute('href', 'https://github.com/johndoe');
         expect(githubLink).toHaveAttribute('target', '_blank');
      });

      it('switches to edit mode when edit button is clicked', () => {
         render(<MyProfileContent />);

         const editButtons = screen.getAllByTestId('edit-buttons');
         const socialEditButton = editButtons[2]; // Third edit button is for social
         
         fireEvent.click(socialEditButton);
         
         expect(screen.getByTestId('edit-user-social-form')).toBeInTheDocument();
         expect(screen.queryByTestId('GitHubIcon')).not.toBeInTheDocument();
      });
   });

   it('displays user ID in sidebar', () => {
      render(<MyProfileContent />);

      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
   });

   it('handles user without complete information', () => {
      (useAuth as jest.Mock).mockReturnValue({
         user: {
            id: 1,
            email: 'test@example.com',
            first_name: 'John'
            // Missing other fields
         }
      });

      expect(() => render(<MyProfileContent />)).not.toThrow();
   });

   it('uses TextResources for all text content', () => {
      render(<MyProfileContent />);

      expect(useTextResources).toHaveBeenCalledTimes(1);
      expect(mockTextResources.getText).toHaveBeenCalledWith('MyProfileContent.pageTitle');
      expect(mockTextResources.getText).toHaveBeenCalledWith('MyProfileContent.pageDescription');
      expect(mockTextResources.getText).toHaveBeenCalledWith('MyProfileContent.widgetAccount.title');
   });

   it('renders proper component structure', () => {
      render(<MyProfileContent />);

      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      
      const cards = screen.getAllByTestId('card');
      expect(cards.length).toBeGreaterThan(0);
      
      cards.forEach(card => {
         expect(card).toHaveAttribute('data-padding', 'm');
      });
   });
});
