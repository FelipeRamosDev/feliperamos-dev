import { render, screen } from '@testing-library/react';
import React from 'react';
import SocialLinks from './SocialLinks';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

interface LinkProps {
   children: React.ReactNode;
   href: string;
   [key: string]: unknown;
}

interface RoundButtonProps {
   children: React.ReactNode;
   title?: string;
   'aria-label'?: string;
   className?: string;
   color?: string;
   size?: string;
   [key: string]: unknown;
}

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
   const Link = ({ children, href, ...props }: LinkProps) => (
      <a href={href} {...props}>
         {children}
      </a>
   );
   Link.displayName = 'Link';
   return Link;
});

// Mock RoundButton component
jest.mock('@/components/buttons', () => ({
   RoundButton: ({ children, title, 'aria-label': ariaLabel, className, color, size, ...props }: RoundButtonProps) => (
      <button
         data-testid="round-button"
         title={title}
         aria-label={ariaLabel}
         className={className}
         data-color={color}
         data-size={size}
         {...props}
      >
         {children}
      </button>
   )
}));

// Mock Material-UI Icons
jest.mock('@mui/icons-material', () => ({
   EmailRounded: () => <span data-testid="email-icon">EmailRounded</span>,
   GitHub: () => <span data-testid="github-icon">GitHub</span>,
   LinkedIn: () => <span data-testid="linkedin-icon">LinkedIn</span>,
   Phone: () => <span data-testid="phone-icon">Phone</span>,
   WhatsApp: () => <span data-testid="whatsapp-icon">WhatsApp</span>
}));

describe('SocialLinks', () => {
   let mockTextResources: {
      getDisplayText: jest.Mock;
      getText: jest.Mock;
   };

   beforeEach(() => {
      mockTextResources = {
         getDisplayText: jest.fn(),
         getText: jest.fn()
      };

      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'SocialLinks.github': 'GitHub Profile',
            'SocialLinks.email': 'Email Felipe',
            'SocialLinks.linkedin': 'LinkedIn Profile',
            'SocialLinks.whatsapp': 'WhatsApp Felipe',
            'SocialLinks.phone': 'Call to Felipe'
         };
         return texts[key] || key;
      });

      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the social links container', () => {
         render(<SocialLinks />);

         const container = document.querySelector('.SocialLinks');
         expect(container).toBeInTheDocument();
      });

      it('renders all social media links', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         expect(links).toHaveLength(5);
      });

      it('renders all social media buttons', () => {
         render(<SocialLinks />);

         const buttons = screen.getAllByTestId('round-button');
         expect(buttons).toHaveLength(5);
      });

      it('renders all social media icons', () => {
         render(<SocialLinks />);

         expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
         expect(screen.getByTestId('EmailRoundedIcon')).toBeInTheDocument();
         expect(screen.getByTestId('LinkedInIcon')).toBeInTheDocument();
         expect(screen.getByTestId('WhatsAppIcon')).toBeInTheDocument();
         expect(screen.getByTestId('PhoneIcon')).toBeInTheDocument();
      });
   });

   describe('Link URLs and targets', () => {
      it('renders GitHub link with correct URL and attributes', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com/FelipeRamosDev');
         
         expect(githubLink).toBeInTheDocument();
         expect(githubLink).toHaveAttribute('href', 'https://github.com/FelipeRamosDev');
         expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
         expect(githubLink).toHaveAttribute('target', '_blank');
      });

      it('renders email link with correct mailto URL', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         const emailLink = links.find(link => link.getAttribute('href') === 'mailto:felipe@feliperamos.dev');
         
         expect(emailLink).toBeInTheDocument();
         expect(emailLink).toHaveAttribute('href', 'mailto:felipe@feliperamos.dev');
         expect(emailLink).toHaveAttribute('rel', 'noopener noreferrer');
         expect(emailLink).toHaveAttribute('target', '_blank');
      });

      it('renders LinkedIn link with correct URL and attributes', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         const linkedinLink = links.find(link => link.getAttribute('href') === 'https://www.linkedin.com/in/feliperamos-dev/');
         
         expect(linkedinLink).toBeInTheDocument();
         expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/feliperamos-dev/');
         expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
         expect(linkedinLink).toHaveAttribute('target', '_blank');
      });

      it('renders WhatsApp link with correct URL and attributes', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         const whatsappLink = links.find(link => link.getAttribute('href') === 'https://wa.me/5541991447756');
         
         expect(whatsappLink).toBeInTheDocument();
         expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/5541991447756');
         expect(whatsappLink).toHaveAttribute('rel', 'noopener noreferrer');
         expect(whatsappLink).toHaveAttribute('target', '_blank');
      });

      it('renders phone link with correct tel URL', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         const phoneLink = links.find(link => link.getAttribute('href') === 'tel:+5541991447756');
         
         expect(phoneLink).toBeInTheDocument();
         expect(phoneLink).toHaveAttribute('href', 'tel:+5541991447756');
         expect(phoneLink).toHaveAttribute('rel', 'noopener noreferrer');
         expect(phoneLink).toHaveAttribute('target', '_blank');
      });
   });

   describe('Button properties', () => {
      it('applies correct button properties to all buttons', () => {
         render(<SocialLinks />);

         const buttons = screen.getAllByTestId('round-button');
         
         buttons.forEach(button => {
            expect(button).toHaveClass('icon-button');
            expect(button).toHaveAttribute('data-color', 'background-dark');
            expect(button).toHaveAttribute('data-size', 'medium');
         });
      });

      it('applies correct title and aria-label to GitHub button', () => {
         render(<SocialLinks />);

         const githubButton = screen.getByRole('button', { name: /github profile/i });
         expect(githubButton).toHaveAttribute('title', 'GitHub Profile');
         expect(githubButton).toHaveAttribute('aria-label', 'GitHub Profile');
      });

      it('applies correct title and aria-label to email button', () => {
         render(<SocialLinks />);

         const emailButton = screen.getByRole('button', { name: /email felipe/i });
         expect(emailButton).toHaveAttribute('title', 'Email Felipe');
         expect(emailButton).toHaveAttribute('aria-label', 'Email Felipe');
      });

      it('applies correct title and aria-label to LinkedIn button', () => {
         render(<SocialLinks />);

         const linkedinButton = screen.getByRole('button', { name: /linkedin profile/i });
         expect(linkedinButton).toHaveAttribute('title', 'LinkedIn Profile');
         expect(linkedinButton).toHaveAttribute('aria-label', 'LinkedIn Profile');
      });

      it('applies correct title and aria-label to WhatsApp button', () => {
         render(<SocialLinks />);

         const whatsappButton = screen.getByRole('button', { name: /whatsapp felipe/i });
         expect(whatsappButton).toHaveAttribute('title', 'WhatsApp Felipe');
         expect(whatsappButton).toHaveAttribute('aria-label', 'WhatsApp Felipe');
      });

      it('applies correct title and aria-label to phone button', () => {
         render(<SocialLinks />);

         const phoneButton = screen.getByRole('button', { name: /call to felipe/i });
         expect(phoneButton).toHaveAttribute('title', 'Call to Felipe');
         expect(phoneButton).toHaveAttribute('aria-label', 'Call to Felipe');
      });
   });

   describe('Internationalization', () => {
      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'SocialLinks.github': 'Perfil GitHub',
               'SocialLinks.email': 'Enviar Email para o Felipe',
               'SocialLinks.linkedin': 'Perfil LinkedIn',
               'SocialLinks.whatsapp': 'Enviar WhatsApp para o Felipe',
               'SocialLinks.phone': 'Ligar para o Felipe'
            };
            return portugueseTexts[key] || key;
         });

         render(<SocialLinks />);

         expect(screen.getByRole('button', { name: /perfil github/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /enviar email para o felipe/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /perfil linkedin/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /enviar whatsapp para o felipe/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /ligar para o felipe/i })).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<SocialLinks />);

         // Component should still render even with empty text
         expect(screen.getAllByTestId('round-button')).toHaveLength(5);
         expect(screen.getAllByRole('link')).toHaveLength(5);
      });

      it('falls back to key when text resource is not found', () => {
         mockTextResources.getText.mockImplementation((key: string) => key);

         render(<SocialLinks />);

         expect(screen.getByRole('button', { name: /SocialLinks.github/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /SocialLinks.email/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /SocialLinks.linkedin/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /SocialLinks.whatsapp/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /SocialLinks.phone/i })).toBeInTheDocument();
      });
   });

   describe('TextResources integration', () => {
      it('uses TextResources for all text content', () => {
         render(<SocialLinks />);

         expect(useTextResources).toHaveBeenCalledTimes(1);
         expect(mockTextResources.getText).toHaveBeenCalledWith('SocialLinks.github');
         expect(mockTextResources.getText).toHaveBeenCalledWith('SocialLinks.email');
         expect(mockTextResources.getText).toHaveBeenCalledWith('SocialLinks.linkedin');
         expect(mockTextResources.getText).toHaveBeenCalledWith('SocialLinks.whatsapp');
         expect(mockTextResources.getText).toHaveBeenCalledWith('SocialLinks.phone');
      });

      it('calls TextResources with the correct text resource object', () => {
         render(<SocialLinks />);

         expect(useTextResources).toHaveBeenCalledWith(expect.any(Object));
      });
   });

   describe('Accessibility', () => {
      it('has proper semantic HTML structure', () => {
         render(<SocialLinks />);

         const container = document.querySelector('.SocialLinks');
         expect(container).toBeInTheDocument();
         
         const links = screen.getAllByRole('link');
         expect(links).toHaveLength(5);
         
         const buttons = screen.getAllByRole('button');
         expect(buttons).toHaveLength(5);
      });

      it('provides accessible labels for all buttons', () => {
         render(<SocialLinks />);

         const buttons = screen.getAllByTestId('round-button');
         
         buttons.forEach(button => {
            expect(button).toHaveAttribute('aria-label');
            expect(button).toHaveAttribute('title');
            expect(button.getAttribute('aria-label')).toBeTruthy();
            expect(button.getAttribute('title')).toBeTruthy();
         });
      });

      it('uses proper link attributes for external links', () => {
         render(<SocialLinks />);

         const externalLinks = screen.getAllByRole('link');
         
         externalLinks.forEach(link => {
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            expect(link).toHaveAttribute('target', '_blank');
         });
      });

      it('makes buttons keyboard accessible', () => {
         render(<SocialLinks />);

         const buttons = screen.getAllByRole('button');
         
         buttons.forEach(button => {
            expect(button).toHaveAttribute('aria-label');
            // Buttons should be focusable by default
            expect(button.tagName).toBe('BUTTON');
         });
      });
   });

   describe('Component integration', () => {
      it('integrates with RoundButton component', () => {
         render(<SocialLinks />);

         const roundButtons = screen.getAllByTestId('round-button');
         expect(roundButtons).toHaveLength(5);
         
         roundButtons.forEach(button => {
            expect(button).toHaveClass('icon-button');
            expect(button).toHaveAttribute('data-color', 'background-dark');
            expect(button).toHaveAttribute('data-size', 'medium');
         });
      });

      it('integrates with Next.js Link component', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         expect(links).toHaveLength(5);
         
         // Check that each link has proper href
         const expectedHrefs = [
            'https://github.com/FelipeRamosDev',
            'mailto:felipe@feliperamos.dev',
            'https://www.linkedin.com/in/feliperamos-dev/',
            'https://wa.me/5541991447756',
            'tel:+5541991447756'
         ];
         
         links.forEach(link => {
            expect(expectedHrefs).toContain(link.getAttribute('href'));
         });
      });

      it('integrates with Material-UI icons', () => {
         render(<SocialLinks />);

         expect(screen.getByTestId('GitHubIcon')).toBeInTheDocument();
         expect(screen.getByTestId('EmailRoundedIcon')).toBeInTheDocument();
         expect(screen.getByTestId('LinkedInIcon')).toBeInTheDocument();
         expect(screen.getByTestId('WhatsAppIcon')).toBeInTheDocument();
         expect(screen.getByTestId('PhoneIcon')).toBeInTheDocument();
      });
   });

   describe('Component structure', () => {
      it('renders buttons inside links', () => {
         render(<SocialLinks />);

         const links = screen.getAllByRole('link');
         
         links.forEach(link => {
            const button = link.querySelector('button');
            expect(button).toBeInTheDocument();
         });
      });

      it('renders icons inside buttons', () => {
         render(<SocialLinks />);

         const buttons = screen.getAllByTestId('round-button');
         
         buttons.forEach(button => {
            const icon = button.querySelector('svg');
            expect(icon).toBeInTheDocument();
         });
      });

      it('maintains proper DOM hierarchy', () => {
         render(<SocialLinks />);

         const container = document.querySelector('.SocialLinks');
         expect(container).toBeInTheDocument();
         
         const links = container!.querySelectorAll('a');
         expect(links).toHaveLength(5);
         
         links.forEach(link => {
            const button = link.querySelector('button');
            expect(button).toBeInTheDocument();
            
            const icon = button?.querySelector('svg');
            expect(icon).toBeInTheDocument();
         });
      });
   });

   describe('Edge cases', () => {
      it('handles special characters in text resources', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const specialTexts: Record<string, string> = {
               'SocialLinks.github': 'GitHub Profile — 特殊字符',
               'SocialLinks.email': 'Email Felipe & Contact',
               'SocialLinks.linkedin': 'LinkedIn Profile <>&',
               'SocialLinks.whatsapp': 'WhatsApp Felipe "quotes"',
               'SocialLinks.phone': 'Call to Felipe \'apostrophe\''
            };
            return specialTexts[key] || key;
         });

         render(<SocialLinks />);

         expect(screen.getByRole('button', { name: /GitHub Profile — 特殊字符/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /Email Felipe & Contact/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /LinkedIn Profile <>&/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /WhatsApp Felipe "quotes"/i })).toBeInTheDocument();
         expect(screen.getByRole('button', { name: /Call to Felipe 'apostrophe'/i })).toBeInTheDocument();
      });

      it('handles extremely long text resources', () => {
         mockTextResources.getText.mockImplementation(() => {
            return 'This is an extremely long text resource that should still work correctly in the component and not break the layout or functionality';
         });

         render(<SocialLinks />);

         const buttons = screen.getAllByTestId('round-button');
         expect(buttons).toHaveLength(5);
         
         buttons.forEach(button => {
            expect(button).toHaveAttribute('title');
            expect(button).toHaveAttribute('aria-label');
         });
      });
   });
});

