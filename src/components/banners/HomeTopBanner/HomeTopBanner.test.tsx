import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HomeTopBanner from './HomeTopBanner';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

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

// Mock the SocialLinks component
jest.mock('@/components/common', () => ({
   Container: ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <div data-testid="container" className={className}>{children}</div>
   ),
   SocialLinks: () => <div data-testid="social-links">Social Links</div>
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
   Button: ({ children, startIcon, onClick }: any) => (
      <button data-testid="download-button" onClick={onClick}>
         {startIcon && <span data-testid="download-icon-wrapper">{startIcon}</span>}
         {children}
      </button>
   )
}));

jest.mock('@mui/icons-material', () => ({
   Download: () => <span data-testid="download-icon">Download Icon</span>
}));

// Mock environment variables
const originalEnv = process.env;

describe('HomeTopBanner', () => {
   const mockTextResources = {
      getText: jest.fn()
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
      render(<HomeTopBanner />);

      expect(screen.getByText('Felipe Ramos')).toBeInTheDocument();
      expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
      expect(screen.getByText('JavaScript | React | Next.js | Node.js | Express | MongoDB')).toBeInTheDocument();
      expect(screen.getByText('Download CV')).toBeInTheDocument();
      expect(screen.getByTestId('social-links')).toBeInTheDocument();
      expect(screen.getByTestId('chat-component')).toBeInTheDocument();
   });

   it('uses TextResources for internationalization', () => {
      render(<HomeTopBanner />);

      expect(useTextResources).toHaveBeenCalledTimes(1);
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.title');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.subtitle');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.techStack');
      expect(mockTextResources.getText).toHaveBeenCalledWith('HomeTopBanner.button.downloadCV');
   });

   it('renders with correct CSS classes and structure', () => {
      render(<HomeTopBanner />);

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
      render(<HomeTopBanner />);

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
      expect(socketProvider).toContainElement(screen.getByTestId('chat-component'));
   });

   it('configures SocketProvider with custom environment variables', () => {
      process.env.NEXT_PUBLIC_SERVER_HOST = 'https://example.com';
      process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT = '8080';

      render(<HomeTopBanner />);

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
   });

   it('handles missing environment variables gracefully', () => {
      delete process.env.NEXT_PUBLIC_SERVER_HOST;
      delete process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT;

      expect(() => render(<HomeTopBanner />)).not.toThrow();

      const socketProvider = screen.getByTestId('socket-provider');
      expect(socketProvider).toBeInTheDocument();
   });

   describe('CV Download functionality', () => {
      let mockCreateElement: jest.SpyInstance;
      let mockLink: Partial<HTMLAnchorElement>;
      let originalCreateElement: typeof document.createElement;

      beforeEach(() => {
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
      });

      afterEach(() => {
         mockCreateElement.mockRestore();
      });

      it('downloads CV when download button is clicked', () => {
         render(<HomeTopBanner />);

         const downloadButton = screen.getByTestId('download-button');
         fireEvent.click(downloadButton);

         expect(document.createElement).toHaveBeenCalledWith('a');
         expect(mockLink.target).toBe('_blank');
         expect(mockLink.href).toBe('/cv/felipe_ramos_cv.pdf');
         expect(mockLink.download).toBe('felipe_ramos_cv.pdf');
         expect(mockLink.click).toHaveBeenCalledTimes(1);
      });

      it('renders download button with proper icon and text', () => {
         render(<HomeTopBanner />);

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

         render(<HomeTopBanner />);

         expect(screen.getByText('Desenvolvedor Fullstack')).toBeInTheDocument();
         expect(screen.getByText('Baixar CV')).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<HomeTopBanner />);

         // Component should still render even with empty text
         const banner = document.querySelector('.HomeBanner');
         expect(banner).toBeInTheDocument();
      });
   });

   describe('Component integration', () => {
      it('integrates with SocialLinks component', () => {
         render(<HomeTopBanner />);

         const socialLinks = screen.getByTestId('social-links');
         expect(socialLinks).toBeInTheDocument();
      });

      it('integrates with Chat component within SocketProvider', () => {
         render(<HomeTopBanner />);

         const socketProvider = screen.getByTestId('socket-provider');
         const chatComponent = screen.getByTestId('chat-component');
         
         expect(socketProvider).toBeInTheDocument();
         expect(chatComponent).toBeInTheDocument();
         expect(socketProvider).toContainElement(chatComponent);
      });
   });

   describe('Responsive layout', () => {
      it('renders proper layout structure for responsive design', () => {
         render(<HomeTopBanner />);

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
         render(<HomeTopBanner />);

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
         render(<HomeTopBanner />);

         const downloadButton = screen.getByRole('button', { name: /download cv/i });
         expect(downloadButton).toBeInTheDocument();
         expect(downloadButton).not.toHaveAttribute('disabled');
      });
   });
});

