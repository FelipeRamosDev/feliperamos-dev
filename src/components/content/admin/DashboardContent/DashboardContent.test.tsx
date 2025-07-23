import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardContent from './DashboardContent';

// Mock dependencies
jest.mock('@/components/common', () => ({
   Container: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="container" {...props}>
         {children}
      </div>
   )
}));

jest.mock('@/components/headers', () => ({
   PageHeader: ({ title, description, ...props }: { title: string; description: string } & Record<string, unknown>) => (
      <div data-testid="page-header" {...props}>
         <h1 data-testid="page-title">{title}</h1>
         <p data-testid="page-description">{description}</p>
      </div>
   )
}));

jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
      <div data-testid="content-sidebar" {...props}>
         {Array.isArray(children) ? (
            children.map((child, index) => (
               <div key={index} data-testid={`sidebar-section-${index}`}>
                  {child}
               </div>
            ))
         ) : (
            <div data-testid="sidebar-section-0">{children}</div>
         )}
      </div>
   )
}));

jest.mock('./sections/DashboardArticle/DashboardArticle', () => {
   return function DashboardArticle(props: Record<string, unknown>) {
      return (
         <div data-testid="dashboard-article" {...props}>
            Dashboard Article Component
         </div>
      );
   };
});

jest.mock('./sections/DashboardSidebar/DashboardSidebar', () => {
   return function DashboardSidebar(props: Record<string, unknown>) {
      return (
         <div data-testid="dashboard-sidebar" {...props}>
            Dashboard Sidebar Component
         </div>
      );
   };
});

const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

jest.mock('./DashboardContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('DashboardContent', () => {
   beforeEach(() => {
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               switch (key) {
                  case 'DashboardContent.pageHeader.title':
                     return 'Admin Dashboard';
                  case 'DashboardContent.pageHeader.description':
                     return 'This is the admin dashboard where you can manage the application settings and user data.';
                  default:
                     return 'Default Text';
               }
            })
         }
      });
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders without crashing', () => {
         expect(() => {
            render(<DashboardContent />);
         }).not.toThrow();
      });

      it('renders the root component with correct CSS class', () => {
         render(<DashboardContent />);
         const rootElement = screen.getByText('Admin Dashboard').closest('.DashboardContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement).toHaveClass('DashboardContent');
      });

      it('renders page header component', () => {
         render(<DashboardContent />);
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
      });

      it('renders section wrapper', () => {
         render(<DashboardContent />);
         const sectionElement = screen.getByTestId('container').closest('section');
         expect(sectionElement).toBeInTheDocument();
      });

      it('renders container component', () => {
         render(<DashboardContent />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('renders content sidebar', () => {
         render(<DashboardContent />);
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for page header title', () => {
         render(<DashboardContent />);
         expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
         expect(screen.getByTestId('page-title')).toHaveTextContent('Admin Dashboard');
      });

      it('uses text resources for page header description', () => {
         render(<DashboardContent />);
         expect(screen.getByText('This is the admin dashboard where you can manage the application settings and user data.')).toBeInTheDocument();
         expect(screen.getByTestId('page-description')).toHaveTextContent('This is the admin dashboard where you can manage the application settings and user data.');
      });

      it('calls useTextResources with correct texts module', () => {
         render(<DashboardContent />);
         expect(mockUseTextResources).toHaveBeenCalled();
      });

      it('calls getText with correct keys for title and description', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'DashboardContent.pageHeader.title':
                  return 'Admin Dashboard';
               case 'DashboardContent.pageHeader.description':
                  return 'This is the admin dashboard where you can manage the application settings and user data.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<DashboardContent />);

         expect(mockGetText).toHaveBeenCalledWith('DashboardContent.pageHeader.title');
         expect(mockGetText).toHaveBeenCalledWith('DashboardContent.pageHeader.description');
      });
   });

   describe('Section components rendering', () => {
      it('renders DashboardArticle component', () => {
         render(<DashboardContent />);
         expect(screen.getByTestId('dashboard-article')).toBeInTheDocument();
         expect(screen.getByText('Dashboard Article Component')).toBeInTheDocument();
      });

      it('renders DashboardSidebar component', () => {
         render(<DashboardContent />);
         expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
         expect(screen.getByText('Dashboard Sidebar Component')).toBeInTheDocument();
      });

      it('renders main content and sidebar in correct layout structure', () => {
         render(<DashboardContent />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         const dashboardArticle = screen.getByTestId('dashboard-article');
         const dashboardSidebar = screen.getByTestId('dashboard-sidebar');
         
         expect(contentSidebar).toContainElement(dashboardArticle);
         expect(contentSidebar).toContainElement(dashboardSidebar);
      });

      it('places components in correct sidebar sections', () => {
         render(<DashboardContent />);
         
         expect(screen.getByTestId('sidebar-section-0')).toContainElement(screen.getByTestId('dashboard-article'));
         expect(screen.getByTestId('sidebar-section-1')).toContainElement(screen.getByTestId('dashboard-sidebar'));
      });
   });

   describe('Component structure and layout', () => {
      it('maintains proper component hierarchy', () => {
         const { container } = render(<DashboardContent />);
         
         const rootDiv = container.querySelector('.DashboardContent');
         expect(rootDiv).toBeInTheDocument();

         const pageHeader = screen.getByTestId('page-header');
         const section = container.querySelector('section');
         
         expect(rootDiv).toContainElement(pageHeader);
         expect(rootDiv).toContainElement(section);
      });

      it('renders content within section and container', () => {
         render(<DashboardContent />);
         
         const section = screen.getByTestId('container').closest('section');
         const containerElement = screen.getByTestId('container');
         const contentSidebar = screen.getByTestId('content-sidebar');
         
         expect(section).toContainElement(containerElement);
         expect(containerElement).toContainElement(contentSidebar);
      });

      it('renders semantic page structure', () => {
         render(<DashboardContent />);
         
         const title = screen.getByRole('heading', { level: 1 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveTextContent('Admin Dashboard');

         const section = screen.getByTestId('container').closest('section');
         expect(section).toBeInTheDocument();
      });

      it('has correct layout order - header first, then section', () => {
         const { container } = render(<DashboardContent />);
         
         const rootDiv = container.querySelector('.DashboardContent');
         const children = Array.from(rootDiv?.children || []);
         
         expect(children[0]).toHaveAttribute('data-testid', 'page-header');
         expect(children[1].tagName.toLowerCase()).toBe('section');
      });
   });

   describe('Component integration', () => {
      it('passes correct props to PageHeader', () => {
         render(<DashboardContent />);
         
         const pageHeader = screen.getByTestId('page-header');
         const title = screen.getByTestId('page-title');
         const description = screen.getByTestId('page-description');
         
         expect(pageHeader).toBeInTheDocument();
         expect(title).toHaveTextContent('Admin Dashboard');
         expect(description).toHaveTextContent('This is the admin dashboard where you can manage the application settings and user data.');
      });

      it('integrates all section components correctly', () => {
         render(<DashboardContent />);
         
         // Verify all main components are present
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('container')).toBeInTheDocument();
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
         expect(screen.getByTestId('dashboard-article')).toBeInTheDocument();
         expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
         
         // Verify text content
         expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
         expect(screen.getByText('This is the admin dashboard where you can manage the application settings and user data.')).toBeInTheDocument();
         expect(screen.getByText('Dashboard Article Component')).toBeInTheDocument();
         expect(screen.getByText('Dashboard Sidebar Component')).toBeInTheDocument();
      });

      it('renders section components without additional props', () => {
         render(<DashboardContent />);
         
         const article = screen.getByTestId('dashboard-article');
         const sidebar = screen.getByTestId('dashboard-sidebar');
         
         expect(article).toBeInTheDocument();
         expect(sidebar).toBeInTheDocument();
      });
   });

   describe('Text resources variations', () => {
      it('handles different text resource values', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'DashboardContent.pageHeader.title':
                        return 'Custom Dashboard Title';
                     case 'DashboardContent.pageHeader.description':
                        return 'Custom dashboard description text.';
                     default:
                        return 'Default Text';
                  }
               })
            }
         });

         render(<DashboardContent />);
         
         expect(screen.getByText('Custom Dashboard Title')).toBeInTheDocument();
         expect(screen.getByText('Custom dashboard description text.')).toBeInTheDocument();
      });

      it('handles Portuguese text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  switch (key) {
                     case 'DashboardContent.pageHeader.title':
                        return 'Painel de Administração';
                     case 'DashboardContent.pageHeader.description':
                        return 'Este é o painel de administração onde você pode gerenciar as configurações do aplicativo e os dados do usuário.';
                     default:
                        return 'Texto Padrão';
                  }
               })
            }
         });

         render(<DashboardContent />);
         
         expect(screen.getByText('Painel de Administração')).toBeInTheDocument();
         expect(screen.getByText('Este é o painel de administração onde você pode gerenciar as configurações do aplicativo e os dados do usuário.')).toBeInTheDocument();
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'DashboardContent.pageHeader.title') return 'Fallback Title';
                  if (key === 'DashboardContent.pageHeader.description') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         });
         
         expect(() => {
            render(<DashboardContent />);
         }).not.toThrow();
         
         expect(screen.getByText('Fallback Title')).toBeInTheDocument();
         expect(screen.getByText('Fallback Description')).toBeInTheDocument();
      });

      it('handles empty text resources', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => '')
            }
         });
         
         expect(() => {
            render(<DashboardContent />);
         }).not.toThrow();
         
         // Component should still render even with empty text
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('dashboard-article')).toBeInTheDocument();
         expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
      });

      it('handles missing textResources object', () => {
         mockUseTextResources.mockReturnValue({
            textResources: null
         });
         
         expect(() => {
            render(<DashboardContent />);
         }).toThrow();
      });
   });

   describe('Accessibility', () => {
      it('has proper heading structure', () => {
         render(<DashboardContent />);
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         expect(heading).toHaveTextContent('Admin Dashboard');
      });

      it('maintains semantic HTML structure', () => {
         const { container } = render(<DashboardContent />);
         
         // Check for proper section structure
         const section = container.querySelector('section');
         expect(section).toBeInTheDocument();
         
         // Check for proper div structure
         const rootDiv = container.querySelector('.DashboardContent');
         expect(rootDiv).toBeInTheDocument();
         
         // Verify heading is accessible
         const heading = screen.getByRole('heading');
         expect(heading).toBeInTheDocument();
      });

      it('provides descriptive page content', () => {
         render(<DashboardContent />);
         
         // Title should be descriptive
         expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
         
         // Description should provide context
         expect(screen.getByText('This is the admin dashboard where you can manage the application settings and user data.')).toBeInTheDocument();
      });

      it('uses semantic section element for main content', () => {
         const { container } = render(<DashboardContent />);
         
         const section = container.querySelector('section');
         expect(section).toBeInTheDocument();
         
         const container_element = screen.getByTestId('container');
         expect(section).toContainElement(container_element);
      });
   });

   describe('Performance and optimization', () => {
      it('only calls text resources once per render', () => {
         const mockGetText = jest.fn((key: string) => {
            switch (key) {
               case 'DashboardContent.pageHeader.title':
                  return 'Admin Dashboard';
               case 'DashboardContent.pageHeader.description':
                  return 'This is the admin dashboard where you can manage the application settings and user data.';
               default:
                  return 'Default Text';
            }
         });

         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<DashboardContent />);
         
         // Should call getText exactly twice - once for title, once for description
         expect(mockGetText).toHaveBeenCalledTimes(2);
      });

      it('maintains component purity - same render produces same output', () => {
         const { container: container1 } = render(<DashboardContent />);
         const { container: container2 } = render(<DashboardContent />);
         
         expect(container1.innerHTML).toBe(container2.innerHTML);
      });

      it('renders section components efficiently', () => {
         render(<DashboardContent />);
         
         // Verify components are rendered once
         expect(screen.getAllByTestId('dashboard-article')).toHaveLength(1);
         expect(screen.getAllByTestId('dashboard-sidebar')).toHaveLength(1);
      });
   });
});
