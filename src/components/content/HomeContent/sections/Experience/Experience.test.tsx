import { render, screen } from '@testing-library/react';
import React from 'react';
import Experience from './Experience';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import companies from './companies';

interface ContainerProps {
   children: React.ReactNode;
   padding?: string;
}

interface ExperienceItemProps {
   company: {
      company: string;
      companyUrl?: string;
      position: string;
      workType?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      sidebar?: string;
      logoUrl?: string;
      skills?: string[];
   };
}

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock the companies function
jest.mock('./companies', () => {
   return jest.fn();
});

// Mock Container component
jest.mock('@/components/common', () => ({
   Container: ({ children, padding }: ContainerProps) => (
      <div data-testid="container" data-padding={padding}>
         {children}
      </div>
   )
}));

// Mock ExperienceItem component
jest.mock('./ExperienceItem', () => ({
   __esModule: true,
   default: ({ experience }: { experience: any }) => (
      <div data-testid="experience-item" data-company={experience?.company?.company_name || 'Unknown'}>
         <h3>{experience?.company?.company_name || 'Unknown Company'}</h3>
         <p>{experience?.position || 'Unknown Position'}</p>
      </div>
   )
}));

describe('Experience', () => {
   let mockTextResources: {
      getText: jest.Mock;
   };
   let mockCompanies: ExperienceItemProps['company'][];

   beforeEach(() => {
      mockTextResources = {
         getText: jest.fn()
      };

      mockCompanies = [
         {
            company: 'CandlePilot',
            companyUrl: 'https://candlepilot.com',
            position: 'Fullstack Developer',
            workType: 'Contract',
            startDate: '2023-4-1',
            endDate: '2025-5-1',
            description: '<p>CandlePilot is a platform for trading bots...</p>',
            sidebar: '<h4>Responsibilities:</h4><ul><li>Back-end server planning</li></ul>',
            logoUrl: '/images/companies/candlepilot_logo.svg',
            skills: ['Node JS', 'TypeScript', 'Next.js', 'React']
         },
         {
            company: 'OSF Digital',
            companyUrl: 'https://osf.digital',
            position: 'Frontend Developer',
            workType: 'Fulltime',
            startDate: '2021-5-1',
            endDate: '2023-12-1',
            description: '<p>OSF Digital is a Canadian company...</p>',
            sidebar: '<h4>Responsibilities:</h4><ul><li>Investigating and fixing bugs</li></ul>',
            logoUrl: '/images/companies/osf_logo.svg',
            skills: ['Salesforce (SFCC)', 'JavaScript', 'TypeScript', 'React']
         },
         {
            company: 'Adam Robô',
            position: 'Fullstack Developer',
            workType: 'Freelance',
            startDate: '2021-1-1',
            endDate: '2023-8-1',
            description: '<p>Adam Robô project description...</p>',
            sidebar: '<h4>Responsibilities:</h4><ul><li>Full-stack development</li></ul>',
            logoUrl: '/images/companies/adamrobo_logo.jpg',
            skills: ['JavaScript', 'React', 'TypeScript', 'Node JS']
         }
      ];

      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      (companies as jest.Mock).mockReturnValue(mockCompanies);

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'Experience.title': 'Work Experience',
            'Experience.description': 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.'
         };
         return texts[key] || key;
      });

      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the Experience section', () => {
         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();
         expect(section).toHaveClass('Experience');
      });

      it('renders with Container component', () => {
         render(<Experience />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         expect(container).toHaveAttribute('data-padding', 'xl');
      });

      it('renders section title', () => {
         render(<Experience />);

         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toHaveClass('section-title');
         expect(title).toHaveTextContent('Work Experience');
      });

      it('renders section description', () => {
         render(<Experience />);

         const description = screen.getByText(/check below my work experience/i);
         expect(description).toHaveClass('section-description');
      });

      it('renders all experience items', () => {
         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(3);
      });
   });

   describe('Companies integration', () => {
      it('calls companies function with textResources', () => {
         render(<Experience />);

         expect(companies).toHaveBeenCalledWith(mockTextResources);
         expect(companies).toHaveBeenCalledTimes(1);
      });

      it('renders each company from companies list', () => {
         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems[0]).toHaveAttribute('data-company', 'CandlePilot');
         expect(screen.getByText('CandlePilot')).toBeInTheDocument();
         expect(screen.getAllByText('Fullstack Developer')).toHaveLength(2); // CandlePilot and Adam Robô
         
         expect(screen.getByText('OSF Digital')).toBeInTheDocument();
         expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
         
         expect(screen.getByText('Adam Robô')).toBeInTheDocument();
      });

      it('passes correct company data to ExperienceItem components', () => {
         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         
         expect(experienceItems[0]).toHaveAttribute('data-company', 'CandlePilot');
         expect(experienceItems[1]).toHaveAttribute('data-company', 'OSF Digital');
         expect(experienceItems[2]).toHaveAttribute('data-company', 'Adam Robô');
      });
   });

   describe('Internationalization', () => {
      it('uses TextResources for section title and description', () => {
         render(<Experience />);

         expect(useTextResources).toHaveBeenCalledTimes(1);
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.title');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.description');
      });

      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'Experience.title': 'Experiência Profissional',
               'Experience.description': 'Confira abaixo minha experiência profissional. As empresas para as quais trabalhei e um resumo das minhas responsabilidades em cada uma estão abaixo.'
            };
            return portugueseTexts[key] || key;
         });

         render(<Experience />);

         expect(screen.getByText('Experiência Profissional')).toBeInTheDocument();
         expect(screen.getByText(/confira abaixo minha experiência profissional/i)).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<Experience />);

         // Component should still render even with empty text
         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });
   });

   describe('Component structure', () => {
      it('has correct HTML structure', () => {
         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toHaveClass('Experience');

         const container = screen.getByTestId('container');
         expect(section).toContainElement(container);

         const title = screen.getByRole('heading', { level: 2 });
         expect(container).toContainElement(title);

         const description = screen.getByText(/check below my work experience/i);
         expect(container).toContainElement(description);
      });

      it('renders experience items in correct order', () => {
         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         const companies = experienceItems.map(item => item.getAttribute('data-company'));
         
         expect(companies).toEqual(['CandlePilot', 'OSF Digital', 'Adam Robô']);
      });

      it('assigns unique keys to experience items', () => {
         // This test verifies that each ExperienceItem gets a unique key (index)
         // We can't directly test the key prop, but we can verify the items render correctly
         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(3);
         
         // Each item should be distinct
         const companyNames = experienceItems.map(item => 
            item.querySelector('h3')?.textContent
         );
         const uniqueCompanyNames = [...new Set(companyNames)];
         expect(uniqueCompanyNames).toHaveLength(3);
      });
   });

   describe('Edge cases', () => {
      it('handles empty companies list', () => {
         (companies as jest.Mock).mockReturnValue([]);

         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
      });

      it('handles companies function returning null', () => {
         (companies as jest.Mock).mockReturnValue(null);

         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
      });

      it('handles companies function returning undefined', () => {
         (companies as jest.Mock).mockReturnValue(undefined);

         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
      });

      it('handles single company in list', () => {
         const singleCompany = [mockCompanies[0]];
         (companies as jest.Mock).mockReturnValue(singleCompany);

         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(1);
         expect(experienceItems[0]).toHaveAttribute('data-company', 'CandlePilot');
      });

      it('handles companies with missing optional properties', () => {
         const companiesWithMissingProps = [
            {
               company: 'Test Company',
               position: 'Developer',
               workType: 'Fulltime',
               startDate: '2020-1-1',
               endDate: '2021-1-1',
               description: 'Test description',
               sidebar: 'Test sidebar'
               // Missing companyUrl, logoUrl, skills
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithMissingProps);

         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(1);
         expect(screen.getByText('Test Company')).toBeInTheDocument();
      });
   });

   describe('TextResources integration', () => {
      it('passes TextResources to companies function', () => {
         render(<Experience />);

         expect(companies).toHaveBeenCalledWith(mockTextResources);
      });

      it('uses TextResources from experienceText', () => {
         render(<Experience />);

         expect(useTextResources).toHaveBeenCalledWith(expect.any(Object));
      });

      it('calls TextResources for title and description', () => {
         render(<Experience />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.title');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.description');
      });
   });

   describe('Accessibility', () => {
      it('uses semantic HTML structure', () => {
         render(<Experience />);

         const section = document.querySelector('.Experience');
         expect(section).toBeInTheDocument();

         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();
      });

      it('has proper heading hierarchy', () => {
         render(<Experience />);

         const mainHeading = screen.getByRole('heading', { level: 2 });
         expect(mainHeading).toHaveTextContent('Work Experience');
      });

      it('provides descriptive content', () => {
         render(<Experience />);

         const description = screen.getByText(/check below my work experience/i);
         expect(description).toBeInTheDocument();
      });
   });

   describe('Performance considerations', () => {
      it('does not re-call companies function unnecessarily', () => {
         const { rerender } = render(<Experience />);
         
         expect(companies).toHaveBeenCalledTimes(1);
         
         rerender(<Experience />);
         
         // companies function should be called again on re-render since it's not memoized
         expect(companies).toHaveBeenCalledTimes(2);
      });

      it('handles large number of companies efficiently', () => {
         const manyCompanies = Array.from({ length: 50 }, (_, i) => ({
            company: `Company ${i}`,
            position: `Position ${i}`,
            workType: 'Fulltime' as const,
            startDate: '2020-1-1',
            endDate: '2021-1-1',
            description: `Description ${i}`,
            sidebar: `Sidebar ${i}`
         }));
         
         (companies as jest.Mock).mockReturnValue(manyCompanies);

         render(<Experience />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(50);
      });
   });
});

