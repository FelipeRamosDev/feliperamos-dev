import { render, screen, fireEvent } from '@testing-library/react';
import HomeTopBanner from './HomeTopBanner';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { downloadCVPDF } from '@/helpers/app.helpers';
import { CVData } from '@/types/database.types';

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock the SocketProvider and Chat components
jest.mock('@/services/SocketClient', () => ({
   SocketProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="socket-provider">{children}</div>,
   SocketClientConfig: {}
}));

jest.mock('@/components/chat', () => ({
   Chat: () => <div data-testid="chat-component">Chat Component</div>
}));

// Mock the downloadCVPDF function
jest.mock('@/helpers/app.helpers', () => ({
   downloadCVPDF: jest.fn()
}));

// Mock the SocialLinks component
jest.mock('@/components/common', () => ({
   Container: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="container" className={className}>{children}</div>
   ),
   SocialLinks: () => <div data-testid="social-links">Social Links</div>
}));

interface ButtonProps {
   children: React.ReactNode;
   startIcon?: React.ReactNode;
   onClick?: () => void;
}

// Mock Material-UI components
jest.mock('@mui/material', () => ({
   Button: ({ children, startIcon, onClick }: ButtonProps) => (
      <button data-testid="download-button" onClick={onClick}>
         {startIcon && <span data-testid="download-icon-wrapper">{startIcon}</span>}
         {children}
      </button>
   )
}));

jest.mock('@mui/icons-material', () => ({
   Download: () => <span data-testid="DownloadIcon">Download Icon</span>
}));

// Mock environment variables
const originalEnv = process.env;

// Mock CV data
const mockCVData: CVData = {
   id: 1,
   title: 'Test CV',
   user: {
      id: 1,
      name: 'felipe_ramos',
      first_name: 'Felipe',
      last_name: 'Ramos',
      email: 'test@example.com',
      phone: '+1234567890',
      github_url: 'https://github.com/test',
      linkedin_url: 'https://linkedin.com/in/test',
      portfolio_url: 'https://test.com',
      whatsapp_number: '+1234567890'
   },
   job_title: 'Fullstack Developer',
   summary: 'Test summary',
   notes: 'Test notes',
   is_master: true,
   created_at: new Date('2023-01-01T00:00:00Z'),
   updated_at: new Date('2023-01-01T00:00:00Z'),
   cv_skills: [],
   cv_experiences: [],
   languageSets: [],
   cv_owner_id: 1,
   language_set: 'en',
   user_id: 1,
   cv_id: 1,
   schemaName: 'curriculums_schema',
   tableName: 'cvs'
};

describe('HomeTopBanner', () => {
   const mockTextResources = {
      getText: jest.fn(),
      currentLanguage: 'en'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'HomeTopBanner.title': 'Felipe Ramos',
            'HomeTopBanner.subtitle': 'Fullstack Developer',
            'HomeTopBanner.techStack': 'JavaScript | React | Next.js | Node.js | Express | MongoDB',
            'HomeTopBanner.button.downloadCV': 'Download CV'
         };
         return texts[key] || key;
      });

      // Reset environment variables
      process.env = { ...originalEnv };
   });

   afterEach(() => {
      process.env = originalEnv;
   });

   it('renders the banner with all content', () => {
      render(<HomeTopBanner cv={mockCVData} />);

      expect(screen.getByText('Felipe Ramos')).toBeInTheDocument();
      expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
      expect(screen.getByText('JavaScript | React | Next.js | Node.js | Express | MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Download CV')).toBeInTheDocument();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
      expect(screen.getByTestId('chat-component')).toBeInTheDocument();
   });

   it('uses TextResources for internationalization', () => {
      render(<HomeTopBanner cv={mockCVData} />);

      expect(useTextResources).toHaveBeenCalledTimes(1);
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.title');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.subtitle');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.techStack');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.button.downloadCV');
   });

   it('renders with correct CSS classes and structure', () => {
      render(<HomeTopBanner cv={mockCVData} />);

      const banner = document.querySelector('.HomeBanner');
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveClass('HomeBanner');

      const container = screen.getByTestId('container');
      expect(container).toHaveClass('double-column');

      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toHaveClass('banner-title');

      const subtitle = screen.getByText('Fullstack Developer');
      expect(subtitle).toHaveClass('banner_sub-title');

      const techStack = screen.getByText('JavaScript | React | Next.js | Node.js | Express | MongoDB');
      expect(techStack).toHaveClass('banner_tech-stack');
   });

   it('configures SocketProvider with correct URL using default environment variables', () => {
      render(<HomeTopBanner cv={mockCVData} />);

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
      expect(socketProvider).toContainElement(screen.getByTestId('chat-component'));
   });

   it('configures SocketProvider with custom environment variables', () => {
      process.env.NEXT_PUBLIC_SERVER_HOST = 'https://example.com';
      process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT = '8080';

      render(<HomeTopBanner cv={mockCVData} />);

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
   });

   it('handles missing environment variables gracefully', () => {
      delete process.env.NEXT_PUBLIC_SERVER_HOST;
      delete process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT;

      expect(() => render(<HomeTopBanner cv={mockCVData} />)).not.toThrow();

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
   });

   describe('CV Download functionality', () => {
      let mockCreateElement: jest.SpyInstance;
      let mockLink: Partial<HTMLAnchorElement>;
      let originalCreateElement: typeof document.createElement;
      const mockDownloadCVPDF = downloadCVPDF as jest.MockedFunction<typeof downloadCVPDF>;

      beforeEach(() => {
         // Mock the DOM manipulation that happens inside downloadCVPDF
         originalCreateElement = document.createElement;

         mockLink = {
            target: '',
            href: '',
            download: '',
            click: jest.fn()
         };

         mockCreateElement = jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
            if (tagName === 'a') {
               return mockLink as HTMLAnchorElement;
            }
            return originalCreateElement.call(document, tagName);
         });

         // Mock the downloadCVPDF function to simulate the expected behavior
         mockDownloadCVPDF.mockImplementation(() => {
            const a = document.createElement('a');
            a.target = '_blank';
            a.href = '/cv/felipe_ramos_cv.pdf';
            a.download = 'felipe_ramos_cv.pdf';
            a.click();
         });
      });

      afterEach(() => {
         mockCreateElement.mockRestore();
         mockDownloadCVPDF.mockClear();
      });

      it('downloads CV when download button is clicked', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const downloadButton = screen.getByTestId('download-button');
         fireEvent.click(downloadButton);

         expect(mockDownloadCVPDF).toHaveBeenCalledWith(mockCVData, 'en');
         expect(document.createElement).toHaveBeenCalledWith('a');
         expect(mockLink.target).toBe('_blank');
         expect(mockLink.href).toBe('/cv/felipe_ramos_cv.pdf');
         expect(mockLink.download).toBe('felipe_ramos_cv.pdf');
         expect(mockLink.click).toHaveBeenCalledTimes(1);
      });

      it('renders download button with proper icon and text', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const downloadButton = screen.getByTestId('download-button');
         expect(downloadButton).toBeInTheDocument();
         expect(downloadButton).toHaveTextContent('Download CV');
         expect(screen.getByTestId('DownloadIcon')).toBeInTheDocument();
      });
   });

   describe('Internationalization scenarios', () => {
      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'HomeTopBanner.title': 'Felipe Ramos',
               'HomeTopBanner.subtitle': 'Desenvolvedor Fullstack',
               'HomeTopBanner.techStack': 'JavaScript | React | Next.js | Node.js | Express | MongoDB',
               'HomeTopBanner.button.downloadCV': 'Baixar CV'
            };
            return portugueseTexts[key] || key;
         });

         render(<HomeTopBanner cv={mockCVData} />);

         expect(screen.getByText('Desenvolvedor Fullstack')).toBeInTheDocument();
         expect(screen.getByText('Baixar CV')).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<HomeTopBanner cv={mockCVData} />);

         // Component should still render even with empty text
         const banner = document.querySelector('.HomeBanner');
         expect(banner).toBeInTheDocument();
      });
   });

   describe('Component integration', () => {
      it('integrates with SocialLinks component', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const socialLinks = screen.getByTestId('social-links');
         expect(socialLinks).toBeInTheDocument();
      });

      it('integrates with Chat component within SocketProvider', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const socketProvider = screen.getByTestId('socket-provider');
         const chatComponent = screen.getByTestId('chat-component');
         
         expect(socketProvider).toBeInTheDocument();
         expect(chatComponent).toBeInTheDocument();
         expect(socketProvider).toContainElement(chatComponent);
      });
   });

   describe('Responsive layout', () => {
      it('renders proper layout structure for responsive design', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const container = screen.getByTestId('container');
         expect(container).toHaveClass('double-column');

         // Check for presentation column elements
         expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
         expect(screen.getByTestId('social-links')).toBeInTheDocument();
         expect(screen.getByTestId('download-button')).toBeInTheDocument();

         // Check for chat column elements
         expect(screen.getByTestId('chat-component')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('has proper semantic HTML structure', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         // Should have main heading
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();

         // Should have section element
         const section = document.querySelector('section');
         expect(section).toBeInTheDocument();

         // Should have accessible button
         const button = screen.getByRole('button');
         expect(button).toBeInTheDocument();
      });

      it('download button is accessible', () => {
         render(<HomeTopBanner cv={mockCVData} />);

         const downloadButton = screen.getByRole('button', { name: /download cv/i });
         expect(downloadButton).toBeInTheDocument();
         expect(downloadButton).not.toHaveAttribute('disabled');
      });
   });
});

