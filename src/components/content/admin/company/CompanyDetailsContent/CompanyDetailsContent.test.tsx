import { render, screen } from '@testing-library/react';
import React from 'react';
import CompanyDetailsContent from './CompanyDetailsContent';
import { CompanyData } from '@/types/database.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

// Mock all the components used by CompanyDetailsContent
jest.mock('@/components/common', () => ({
   Container: function MockContainer({ children }: { children: React.ReactNode }) {
      return <div data-testid="container">{children}</div>;
   }
}));

jest.mock('@/components/headers', () => ({
   PageHeader: function MockPageHeader({ title, description }: { title: string; description: string }) {
      return (
         <div data-testid="page-header">
            <h1 data-testid="page-title">{title}</h1>
            <p data-testid="page-description">{description}</p>
         </div>
      );
   }
}));

jest.mock('@/components/layout', () => ({
   ContentSidebar: function MockContentSidebar({ children }: { children: React.ReactNode }) {
      return (
         <div data-testid="content-sidebar">
            {Array.isArray(children) ? children.map((child, index) => (
               <div key={index} data-testid={`sidebar-section-${index}`}>
                  {child}
               </div>
            )) : children}
         </div>
      );
   }
}));

// Mock the slice components
jest.mock('./slices/CompanyDetailsInfo', () => {
   return function MockCompanyDetailsInfo() {
      return <div data-testid="company-details-info">Company Details Info Component</div>;
   };
});

jest.mock('./slices/CompanyDetailsSets', () => {
   return function MockCompanyDetailsSets() {
      return <div data-testid="company-details-sets">Company Details Sets Component</div>;
   };
});

jest.mock('./slices/CompanyDetailsSidebar', () => {
   return function MockCompanyDetailsSidebar() {
      return <div data-testid="company-details-sidebar">Company Details Sidebar Component</div>;
   };
});

// Mock the context provider
jest.mock('./CompanyDetailsContext', () => {
   return function MockCompanyDetailsProvider({ company, children }: { company: CompanyData; children: React.ReactNode }) {
      return (
         <div data-testid="company-details-provider" data-company={JSON.stringify(company)}>
            {children}
         </div>
      );
   };
});

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;

// Sample company data for testing
const sampleCompanyData: CompanyData = {
   id: 1,
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-06-01'),
   schemaName: 'companies_schema',
   tableName: 'companies',
   company_id: 1,
   company_name: 'Test Company Inc.',
   location: 'San Francisco, CA',
   logo_url: 'https://example.com/logo.png',
   site_url: 'https://testcompany.com',
   description: 'A test company for unit testing',
   industry: 'Technology',
   language_set: 'en',
   languageSets: [
      {
         id: 2,
         created_at: new Date('2023-01-01'),
         schemaName: 'companies_schema',
         tableName: 'companies',
         company_id: 1,
         description: 'Empresa de teste para testes unitários',
         industry: 'Tecnologia',
         language_set: 'pt'
      }
   ]
};

describe('CompanyDetailsContent', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      
      // Default mock implementation for text resources
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               const textMap: Record<string, string> = {
                  'CompanyDetailsContent.pageHeader.title': 'Company Details',
                  'CompanyDetailsContent.pageHeader.description': 'View and manage company details'
               };
               return textMap[key] || key;
            })
         }
      } as unknown as ReturnType<typeof useTextResources>);
   });

   describe('Basic rendering', () => {
      it('renders with company data', () => {
         const { container } = render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const companyDetailsContent = container.querySelector('.CompanyDetailsContent');
         expect(companyDetailsContent).toBeInTheDocument();
      });

      it('renders page header with correct title and description', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('page-header')).toBeInTheDocument();
         expect(screen.getByTestId('page-title')).toHaveTextContent('Company Details');
         expect(screen.getByTestId('page-description')).toHaveTextContent('View and manage company details');
      });

      it('renders container component', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('renders content sidebar', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      });
   });

   describe('Context provider integration', () => {
      it('wraps content with CompanyDetailsProvider', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const provider = screen.getByTestId('company-details-provider');
         expect(provider).toBeInTheDocument();
         
         // Verify company data is passed to provider
         const companyDataAttr = provider.getAttribute('data-company');
         expect(companyDataAttr).toBeTruthy();
         
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         expect(parsedCompanyData.company_name).toBe('Test Company Inc.');
         expect(parsedCompanyData.location).toBe('San Francisco, CA');
         expect(parsedCompanyData.industry).toBe('Technology');
      });

      it('passes all company properties to context provider', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const provider = screen.getByTestId('company-details-provider');
         const companyDataAttr = provider.getAttribute('data-company');
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         
         // Verify all main properties are passed
         expect(parsedCompanyData.id).toBe(1);
         expect(parsedCompanyData.company_id).toBe(1);
         expect(parsedCompanyData.logo_url).toBe('https://example.com/logo.png');
         expect(parsedCompanyData.site_url).toBe('https://testcompany.com');
         expect(parsedCompanyData.description).toBe('A test company for unit testing');
         expect(parsedCompanyData.language_set).toBe('en');
         expect(parsedCompanyData.languageSets).toHaveLength(1);
      });
   });

   describe('Slice components rendering', () => {
      it('renders CompanyDetailsInfo component', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('company-details-info')).toBeInTheDocument();
         expect(screen.getByText('Company Details Info Component')).toBeInTheDocument();
      });

      it('renders CompanyDetailsSets component', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('company-details-sets')).toBeInTheDocument();
         expect(screen.getByText('Company Details Sets Component')).toBeInTheDocument();
      });

      it('renders CompanyDetailsSidebar component', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(screen.getByTestId('company-details-sidebar')).toBeInTheDocument();
         expect(screen.getByText('Company Details Sidebar Component')).toBeInTheDocument();
      });

      it('renders main content and sidebar in correct layout structure', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         const mainSections = contentSidebar.querySelectorAll('[data-testid^="sidebar-section-"]');
         
         // Should have main content section and sidebar section
         expect(mainSections).toHaveLength(2);
         
         // First section should contain main content (Info and Sets)
         const mainContentSection = mainSections[0];
         expect(mainContentSection.querySelector('[data-testid="company-details-info"]')).toBeInTheDocument();
         expect(mainContentSection.querySelector('[data-testid="company-details-sets"]')).toBeInTheDocument();
         
         // Second section should contain sidebar
         const sidebarSection = mainSections[1];
         expect(sidebarSection.querySelector('[data-testid="company-details-sidebar"]')).toBeInTheDocument();
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for page header title', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'CompanyDetailsContent.pageHeader.title') return 'Detalhes da Empresa';
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         } as unknown as ReturnType<typeof useTextResources>);
         
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('CompanyDetailsContent.pageHeader.title');
         expect(screen.getByTestId('page-title')).toHaveTextContent('Detalhes da Empresa');
      });

      it('uses text resources for page header description', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'CompanyDetailsContent.pageHeader.description') return 'Visualizar e gerenciar detalhes da empresa';
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         } as unknown as ReturnType<typeof useTextResources>);
         
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('CompanyDetailsContent.pageHeader.description');
         expect(screen.getByTestId('page-description')).toHaveTextContent('Visualizar e gerenciar detalhes da empresa');
      });

      it('calls useTextResources with correct texts module', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
         // The texts module should be passed as parameter
         expect(mockUseTextResources).toHaveBeenCalledWith(expect.any(Object));
      });
   });

   describe('Company data variations', () => {
      it('handles company with minimal required data', () => {
         const minimalCompany: CompanyData = {
            id: 2,
            created_at: new Date('2023-01-01'),
            schemaName: 'companies_schema',
            tableName: 'companies',
            company_id: 2,
            company_name: 'Minimal Company',
            location: 'Unknown',
            logo_url: '',
            site_url: '',
            languageSets: []
         };
         
         expect(() => {
            render(<CompanyDetailsContent company={minimalCompany} />);
         }).not.toThrow();
         
         const provider = screen.getByTestId('company-details-provider');
         const companyDataAttr = provider.getAttribute('data-company');
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         
         expect(parsedCompanyData.company_name).toBe('Minimal Company');
         expect(parsedCompanyData.languageSets).toHaveLength(0);
      });

      it('handles company with multiple language sets', () => {
         const multiLangCompany: CompanyData = {
            ...sampleCompanyData,
            languageSets: [
               {
                  id: 2,
                  created_at: new Date('2023-01-01'),
                  schemaName: 'companies_schema',
                  tableName: 'companies',
                  company_id: 1,
                  description: 'Empresa de teste',
                  industry: 'Tecnologia',
                  language_set: 'pt'
               },
               {
                  id: 3,
                  created_at: new Date('2023-01-01'),
                  schemaName: 'companies_schema',
                  tableName: 'companies',
                  company_id: 1,
                  description: 'Empresa de prueba',
                  industry: 'Tecnología',
                  language_set: 'es'
               }
            ]
         };
         
         render(<CompanyDetailsContent company={multiLangCompany} />);
         
         const provider = screen.getByTestId('company-details-provider');
         const companyDataAttr = provider.getAttribute('data-company');
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         
         expect(parsedCompanyData.languageSets).toHaveLength(2);
         expect(parsedCompanyData.languageSets[0].language_set).toBe('pt');
         expect(parsedCompanyData.languageSets[1].language_set).toBe('es');
      });

      it('handles company with updated_at date', () => {
         const updatedCompany: CompanyData = {
            ...sampleCompanyData,
            updated_at: new Date('2023-12-01')
         };
         
         render(<CompanyDetailsContent company={updatedCompany} />);
         
         const provider = screen.getByTestId('company-details-provider');
         const companyDataAttr = provider.getAttribute('data-company');
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         
         expect(new Date(parsedCompanyData.updated_at)).toEqual(new Date('2023-12-01'));
      });
   });

   describe('Component structure and accessibility', () => {
      it('has correct root CSS class', () => {
         const { container } = render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const rootElement = container.querySelector('.CompanyDetailsContent');
         expect(rootElement).toBeInTheDocument();
         expect(rootElement?.tagName).toBe('DIV');
      });

      it('maintains proper component hierarchy', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         // Verify the structure: Provider > Content > Header + Container > Sidebar > Sections
         const provider = screen.getByTestId('company-details-provider');
         const content = provider.querySelector('.CompanyDetailsContent');
         expect(content).toBeInTheDocument();
         
         const header = content?.querySelector('[data-testid="page-header"]');
         expect(header).toBeInTheDocument();
         
         const container = content?.querySelector('[data-testid="container"]');
         expect(container).toBeInTheDocument();
         
         const sidebar = container?.querySelector('[data-testid="content-sidebar"]');
         expect(sidebar).toBeInTheDocument();
      });

      it('renders semantic page structure', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         // Should have a clear page title
         const pageTitle = screen.getByTestId('page-title');
         expect(pageTitle.tagName).toBe('H1');
         
         // Should have a page description
         const pageDescription = screen.getByTestId('page-description');
         expect(pageDescription.tagName).toBe('P');
      });
   });

   describe('Error handling and edge cases', () => {
      it('handles empty company name gracefully', () => {
         const companyWithEmptyName: CompanyData = {
            ...sampleCompanyData,
            company_name: ''
         };
         
         expect(() => {
            render(<CompanyDetailsContent company={companyWithEmptyName} />);
         }).not.toThrow();
         
         const provider = screen.getByTestId('company-details-provider');
         const companyDataAttr = provider.getAttribute('data-company');
         const parsedCompanyData = JSON.parse(companyDataAttr!);
         
         expect(parsedCompanyData.company_name).toBe('');
      });

      it('handles company with no optional fields', () => {
         const companyNoOptional: CompanyData = {
            id: 3,
            created_at: new Date('2023-01-01'),
            schemaName: 'companies_schema',
            tableName: 'companies',
            company_id: 3,
            company_name: 'Basic Company',
            location: 'Nowhere',
            logo_url: '',
            site_url: '',
            languageSets: []
         };
         
         expect(() => {
            render(<CompanyDetailsContent company={companyNoOptional} />);
         }).not.toThrow();
         
         // All components should still render
         expect(screen.getByTestId('company-details-info')).toBeInTheDocument();
         expect(screen.getByTestId('company-details-sets')).toBeInTheDocument();
         expect(screen.getByTestId('company-details-sidebar')).toBeInTheDocument();
      });

      it('handles text resources failure gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn((key: string) => {
                  if (key === 'CompanyDetailsContent.pageHeader.title') return 'Fallback Title';
                  if (key === 'CompanyDetailsContent.pageHeader.description') return 'Fallback Description';
                  return 'Fallback Text';
               })
            }
         } as unknown as ReturnType<typeof useTextResources>);
         
         expect(() => {
            render(<CompanyDetailsContent company={sampleCompanyData} />);
         }).not.toThrow();
         
         expect(screen.getByText('Fallback Title')).toBeInTheDocument();
         expect(screen.getByText('Fallback Description')).toBeInTheDocument();
      });
   });

   describe('Integration with sub-components', () => {
      it('provides context to all child components', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         // All slice components should be wrapped by the provider
         const provider = screen.getByTestId('company-details-provider');
         
         expect(provider.querySelector('[data-testid="company-details-info"]')).toBeInTheDocument();
         expect(provider.querySelector('[data-testid="company-details-sets"]')).toBeInTheDocument();
         expect(provider.querySelector('[data-testid="company-details-sidebar"]')).toBeInTheDocument();
      });

      it('maintains correct layout structure for responsive design', () => {
         render(<CompanyDetailsContent company={sampleCompanyData} />);
         
         const contentSidebar = screen.getByTestId('content-sidebar');
         expect(contentSidebar).toBeInTheDocument();
         
         // Should have Fragment wrapper for main content
         const sections = contentSidebar.querySelectorAll('[data-testid^="sidebar-section-"]');
         expect(sections).toHaveLength(2);
         
         // First section contains main content (wrapped in Fragment)
         const mainSection = sections[0];
         expect(mainSection.querySelector('[data-testid="company-details-info"]')).toBeInTheDocument();
         expect(mainSection.querySelector('[data-testid="company-details-sets"]')).toBeInTheDocument();
      });
   });
});
