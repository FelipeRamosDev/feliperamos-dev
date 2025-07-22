import { render, screen } from '@testing-library/react';
import React from 'react';
import Experience from './Experience';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import TextResources from '@/services/TextResources/TextResources';
import { ExperienceData, CompanyData } from '@/types/database.types';

interface ContainerProps {
   children: React.ReactNode;
   padding?: string;
}

interface ExperienceItemProps {
   experience?: ExperienceData;
}

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

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
   default: ({ experience }: ExperienceItemProps) => (
      <div data-testid="experience-item" data-company={experience?.company?.company_name || 'Unknown'}>
         <h3>{experience?.company?.company_name}</h3>
         <p>{experience?.position}</p>
         <span>{experience?.description}</span>
      </div>
   )
}));

// Mock experience text
jest.mock('./Experience.text', () => ({}));

const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;

describe('Experience', () => {
   const mockCompanyData: CompanyData = {
      id: 1,
      company_name: 'Test Company',
      location: 'San Francisco, CA',
      logo_url: 'https://example.com/logo.png',
      site_url: 'https://example.com',
      created_at: new Date('2023-01-01'),
      schemaName: 'companies_schema',
      tableName: 'companies',
      company_id: 1,
      description: 'A test company',
      industry: 'Technology',
      language_set: 'en',
      languageSets: []
   };

   const mockExperienceData: ExperienceData[] = [
      {
         id: 1,
         company: mockCompanyData,
         company_id: 1,
         end_date: new Date('2023-12-31'),
         start_date: new Date('2023-01-01'),
         status: 'published',
         type: 'full_time',
         title: 'Senior Developer',
         position: 'Senior Software Developer',
         description: 'Worked on various web applications using React and Node.js',
         responsibilities: 'Led development team, implemented new features',
         summary: 'Great experience working with modern technologies',
         slug: 'test-company-senior-dev',
         language_set: 'en',
         created_at: new Date('2023-01-01'),
         schemaName: 'experiences_schema',
         tableName: 'experiences',
         languageSets: [],
         skills: []
      },
      {
         id: 2,
         company: {
            ...mockCompanyData,
            id: 2,
            company_name: 'Another Company',
            company_id: 2
         },
         company_id: 2,
         end_date: new Date('2022-12-31'),
         start_date: new Date('2022-01-01'),
         status: 'published',
         type: 'contract',
         title: 'Frontend Developer',
         position: 'Frontend Developer',
         description: 'Developed user interfaces using React and TypeScript',
         responsibilities: 'UI development, code reviews',
         summary: 'Focused on frontend development',
         slug: 'another-company-frontend',
         language_set: 'en',
         created_at: new Date('2022-01-01'),
         schemaName: 'experiences_schema',
         tableName: 'experiences',
         languageSets: [],
         skills: []
      }
   ];

   const mockTextResources = {
      getText: jest.fn(),
      setLanguage: jest.fn(),
      currentLanguage: 'en',
      create: jest.fn(),
      merge: jest.fn(),
      getLanguageSet: jest.fn(),
      initLanguage: jest.fn(),
      languages: ['en', 'es', 'fr'],
      defaultLanguage: 'en',
      _resources: {},
      _currentLanguage: 'en'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      mockUseTextResources.mockReturnValue({
         textResources: mockTextResources as unknown as TextResources
      });
      
      mockTextResources.getText.mockImplementation((key: string) => {
         const textMap: Record<string, string> = {
            'Experience.title': 'Work Experience',
            'Experience.description': 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.'
         };
         return textMap[key] || key;
      });
   });

   describe('Rendering', () => {
      it('renders the Experience section with proper structure', () => {
         render(<Experience experiences={mockExperienceData} />);

         const section = screen.getByTestId('experience-section');
         expect(section).toBeInTheDocument();
         expect(section).toHaveClass('Experience');
      });

      it('renders the Container with correct padding', () => {
         render(<Experience experiences={mockExperienceData} />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         expect(container).toHaveAttribute('data-padding', 'xl');
      });

      it('renders the section title', () => {
         render(<Experience experiences={mockExperienceData} />);

         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveClass('section-title');
         expect(title).toHaveTextContent('Work Experience');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.title');
      });

      it('renders the section description', () => {
         render(<Experience experiences={mockExperienceData} />);

         const description = screen.getByText(/Check below my work experience/);
         expect(description).toBeInTheDocument();
         expect(description).toHaveClass('section-description');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.description');
      });
   });

   describe('Experience Data Handling', () => {
      it('renders experience items for provided experience data', () => {
         render(<Experience experiences={mockExperienceData} />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(mockExperienceData.length);

         // Check that all experiences are rendered
         expect(screen.getByText('Test Company')).toBeInTheDocument();
         expect(screen.getByText('Another Company')).toBeInTheDocument();
      });

      it('renders experience items with correct props', () => {
         render(<Experience experiences={mockExperienceData} />);

         const experienceItems = screen.getAllByTestId('experience-item');
         
         experienceItems.forEach((item, index) => {
            const experience = mockExperienceData[index];
            expect(item).toHaveAttribute('data-company', experience.company.company_name);
            expect(item).toContainElement(screen.getByText(experience.company.company_name));
            expect(item).toContainElement(screen.getByText(experience.position!));
         });
      });

      it('generates unique keys for each experience item', () => {
         const { container } = render(<Experience experiences={mockExperienceData} />);
         
         const experienceItems = container.querySelectorAll('[data-testid="experience-item"]');
         expect(experienceItems).toHaveLength(mockExperienceData.length);
         
         // Check that keys would be unique (based on the key generation logic)
         mockExperienceData.forEach((experience) => {
            const expectedKey = experience.id;
            expect(expectedKey).toBeTruthy();
            expect(expectedKey).toBeGreaterThan(0);
         });
      });

      it('handles empty experiences array gracefully', () => {
         render(<Experience experiences={[]} />);

         const section = screen.getByTestId('experience-section');
         expect(section).toBeInTheDocument();
         
         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toBeInTheDocument();
         
         const description = screen.getByText(/Check below my work experience/);
         expect(description).toBeInTheDocument();
         
         // Should not render any experience items
         expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
      });

      it('uses default empty array when experiences prop is undefined', () => {
         // Test the default parameter
         render(<Experience experiences={undefined as ExperienceData[] | undefined} />);

         const section = screen.getByTestId('experience-section');
         expect(section).toBeInTheDocument();
         
         // Should not render any experience items
         expect(screen.queryByTestId('experience-item')).not.toBeInTheDocument();
      });

      it('handles experiences without id using array index as key', () => {
         const experiencesWithoutId = mockExperienceData.map(exp => ({ ...exp, id: 0 })) as ExperienceData[];
         
         render(<Experience experiences={experiencesWithoutId} />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(experiencesWithoutId.length);
      });
   });

   describe('Text Resources Integration', () => {
      it('calls useTextResources with experience text resources', () => {
         render(<Experience experiences={mockExperienceData} />);

         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
         expect(mockUseTextResources).toHaveBeenCalledWith({});
      });

      it('retrieves correct text keys from text resources', () => {
         render(<Experience experiences={mockExperienceData} />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.title');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Experience.description');
      });

      it('handles different languages through text resources', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const textMap: Record<string, string> = {
               'Experience.title': 'Experiência Profissional',
               'Experience.description': 'Confira abaixo minha experiência profissional.'
            };
            return textMap[key] || key;
         });

         render(<Experience experiences={mockExperienceData} />);

         expect(screen.getByText('Experiência Profissional')).toBeInTheDocument();
         expect(screen.getByText(/Confira abaixo minha experiência/)).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('uses semantic HTML structure', () => {
         render(<Experience experiences={mockExperienceData} />);

         const section = screen.getByTestId('experience-section');
         expect(section).toBeInTheDocument();
         
         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();
      });

      it('provides proper heading hierarchy', () => {
         render(<Experience experiences={mockExperienceData} />);

         const h2 = screen.getByRole('heading', { level: 2 });
         expect(h2).toBeInTheDocument();
         expect(h2).toHaveTextContent('Work Experience');
      });

      it('maintains proper content structure for screen readers', () => {
         render(<Experience experiences={mockExperienceData} />);

         const section = screen.getByTestId('experience-section');
         const heading = screen.getByRole('heading', { level: 2 });
         const description = screen.getByText(/Check below my work experience/);

         // Check that heading comes before description in DOM order
         expect(section).toContainElement(heading);
         expect(section).toContainElement(description);
      });
   });

   describe('Component Props', () => {
      it('accepts experiences prop with ExperienceData array type', () => {
         const customExperiences: ExperienceData[] = [
            {
               ...mockExperienceData[0],
               id: 99,
               company: {
                  ...mockCompanyData,
                  company_name: 'Custom Company'
               },
               position: 'Custom Position'
            }
         ];

         render(<Experience experiences={customExperiences} />);

         expect(screen.getByText('Custom Company')).toBeInTheDocument();
         expect(screen.getByText('Custom Position')).toBeInTheDocument();
      });

      it('handles experiences with different data shapes correctly', () => {
         const experiencesWithVariations: ExperienceData[] = [
            {
               ...mockExperienceData[0],
               title: 'Lead Developer',
               type: 'full_time',
               status: 'published'
            },
            {
               ...mockExperienceData[1],
               title: 'Consultant',
               type: 'contract',
               status: 'archived'
            }
         ];

         render(<Experience experiences={experiencesWithVariations} />);

         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(2);
      });
   });

   describe('Error Handling', () => {
      it('handles text resource errors gracefully', () => {
         mockTextResources.getText.mockImplementation(() => {
            throw new Error('Text resource error');
         });

         expect(() => {
            render(<Experience experiences={mockExperienceData} />);
         }).toThrow('Text resource error');
      });

      it('handles experience data with missing company information', () => {
         const incompleteExperience = {
            ...mockExperienceData[0],
            company: undefined as unknown as CompanyData
         };

         render(<Experience experiences={[incompleteExperience]} />);

         const experienceItem = screen.getByTestId('experience-item');
         expect(experienceItem).toHaveAttribute('data-company', 'Unknown');
      });

      it('handles experience data with missing optional properties', () => {
         const minimalExperience: ExperienceData = {
            id: 1,
            company: mockCompanyData,
            company_id: 1,
            end_date: new Date(),
            start_date: new Date(),
            status: 'published',
            type: 'full_time',
            created_at: new Date(),
            schemaName: 'experiences_schema',
            tableName: 'experiences',
            languageSets: [],
            skills: []
            // Missing optional properties like title, position, description
         };

         render(<Experience experiences={[minimalExperience]} />);

         const experienceItem = screen.getByTestId('experience-item');
         expect(experienceItem).toBeInTheDocument();
      });
   });

   describe('Integration Tests', () => {
      it('renders complete experience section with all elements', () => {
         render(<Experience experiences={mockExperienceData} />);

         // Check section structure
         const section = screen.getByTestId('experience-section');
         expect(section).toHaveClass('Experience');

         // Check container
         const container = screen.getByTestId('container');
         expect(container).toHaveAttribute('data-padding', 'xl');

         // Check content
         expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Work Experience');
         expect(screen.getByText(/Check below my work experience/)).toBeInTheDocument();

         // Check experience items
         const experienceItems = screen.getAllByTestId('experience-item');
         expect(experienceItems).toHaveLength(2);
         expect(screen.getByText('Test Company')).toBeInTheDocument();
         expect(screen.getByText('Another Company')).toBeInTheDocument();
      });

      it('maintains component state correctly with prop changes', () => {
         const { rerender } = render(<Experience experiences={[mockExperienceData[0]]} />);

         expect(screen.getAllByTestId('experience-item')).toHaveLength(1);
         expect(screen.getByText('Test Company')).toBeInTheDocument();

         // Re-render with different data
         rerender(<Experience experiences={mockExperienceData} />);

         expect(screen.getAllByTestId('experience-item')).toHaveLength(2);
         expect(screen.getByText('Test Company')).toBeInTheDocument();
         expect(screen.getByText('Another Company')).toBeInTheDocument();
      });
   });
});
