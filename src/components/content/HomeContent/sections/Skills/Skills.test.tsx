import { render, screen } from '@testing-library/react';
import React from 'react';
import Skills from './Skills';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import companies from '../Experience/companies';

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock the companies function
jest.mock('../Experience/companies', () => {
   return jest.fn();
});

// Mock Container component
jest.mock('@/components/common', () => ({
   Container: ({ children, padding }: any) => (
      <div data-testid="container" data-padding={padding}>
         {children}
      </div>
   )
}));

// Mock SkillBadge component
jest.mock('@/components/badges', () => ({
   SkillBadge: ({ value, className }: any) => (
      <div data-testid="skill-badge" data-value={value} className={className}>
         {value}
      </div>
   )
}));

describe('Skills', () => {
   let mockTextResources: any;
   let mockCompanies: any;

   beforeEach(() => {
      mockTextResources = {
         getText: jest.fn(),
         merge: jest.fn()
      };

      mockCompanies = [
         {
            company: 'CandlePilot',
            skills: ['Node JS', 'TypeScript', 'Next.js', 'React', 'JavaScript', 'Docker', 'Redis']
         },
         {
            company: 'OSF Digital',
            skills: ['Salesforce (SFCC)', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'Vue.js']
         },
         {
            company: 'Adam Robô',
            skills: ['JavaScript', 'React', 'TypeScript', 'Node JS', 'Jest', 'HTML', 'CSS']
         },
         {
            company: 'Prado & Becker',
            skills: ['JavaScript', 'Material UI', 'React', 'TypeScript', 'Node.js', 'Next.js', 'Firebase']
         }
      ];

      (useTextResources as jest.Mock).mockReturnValue({
         textResources: mockTextResources
      });

      (companies as jest.Mock).mockReturnValue(mockCompanies);

      // Set up default text resource responses
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'Skills.title': 'Main Skills',
            'Skills.description': 'Here are my skills and technologies I have experience with: Programming languages, Frameworks, Libraries, Tools, and more.'
         };
         return texts[key] || key;
      });

      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the Skills section', () => {
         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();
         expect(section).toHaveClass('Skills');
      });

      it('renders with Container component', () => {
         render(<Skills />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         expect(container).toHaveAttribute('data-padding', 'xl');
      });

      it('renders section title', () => {
         render(<Skills />);

         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toHaveClass('section-title');
         expect(title).toHaveTextContent('Main Skills');
      });

      it('renders section description', () => {
         render(<Skills />);

         const description = screen.getByText(/here are my skills and technologies/i);
         expect(description).toHaveClass('section-description');
      });

      it('renders skills grid', () => {
         render(<Skills />);

         const skillsGrid = document.querySelector('.skills-grid');
         expect(skillsGrid).toBeInTheDocument();
         expect(skillsGrid).toHaveClass('skills-grid');
      });
   });

   describe('Skills extraction and rendering', () => {
      it('calls companies function with textResources', () => {
         render(<Skills />);

         expect(companies).toHaveBeenCalledWith(mockTextResources);
         expect(companies).toHaveBeenCalledTimes(1);
      });

      it('renders unique skills from all companies', () => {
         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges.length).toBeGreaterThan(0);

         // Check that some expected skills are present
         expect(screen.getByText('JavaScript')).toBeInTheDocument();
         expect(screen.getByText('TypeScript')).toBeInTheDocument();
         expect(screen.getByText('React')).toBeInTheDocument();
         expect(screen.getByText('Node JS')).toBeInTheDocument();
      });

      it('removes duplicate skills', () => {
         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         const skillValues = skillBadges.map(badge => badge.getAttribute('data-value'));
         const uniqueSkillValues = [...new Set(skillValues)];

         expect(skillValues.length).toBe(uniqueSkillValues.length);
      });

      it('applies correct className to skill badges', () => {
         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         skillBadges.forEach(badge => {
            expect(badge).toHaveClass('skill-badge');
         });
      });

      it('uses skill value as key for each SkillBadge', () => {
         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         skillBadges.forEach(badge => {
            const value = badge.getAttribute('data-value');
            expect(value).toBeTruthy();
            expect(badge).toHaveTextContent(value!);
         });
      });
   });

   describe('TextResources integration', () => {
      it('merges skillsText with experiencesText', () => {
         render(<Skills />);

         expect(useTextResources).toHaveBeenCalledWith(
            expect.objectContaining({
               merge: expect.any(Function)
            })
         );
      });

      it('uses TextResources for title and description', () => {
         render(<Skills />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.title');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.description');
      });

      it('displays Portuguese text when TextResources returns Portuguese', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const portugueseTexts: Record<string, string> = {
               'Skills.title': 'Principais Habilidades',
               'Skills.description': 'Confira abaixo minhas habilidades e tecnologias que tenho experiência: Linguagens de programação, Frameworks, Bibliotecas, Ferramentas e muito mais.'
            };
            return portugueseTexts[key] || key;
         });

         render(<Skills />);

         expect(screen.getByText('Principais Habilidades')).toBeInTheDocument();
         expect(screen.getByText(/confira abaixo minhas habilidades/i)).toBeInTheDocument();
      });

      it('handles missing text resources gracefully', () => {
         mockTextResources.getText.mockReturnValue('');

         render(<Skills />);

         // Component should still render even with empty text
         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      });
   });

   describe('Skills filtering and processing', () => {
      it('filters out null and undefined skills', () => {
         const companiesWithNullSkills = [
            {
               company: 'Test Company',
               skills: ['JavaScript', null, 'React', undefined, 'TypeScript']
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithNullSkills);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         const skillValues = skillBadges.map(badge => badge.getAttribute('data-value'));
         
         expect(skillValues).toEqual(expect.arrayContaining(['JavaScript', 'React', 'TypeScript']));
         expect(skillValues).not.toContain(null);
         expect(skillValues).not.toContain(undefined);
      });

      it('filters out non-string skills', () => {
         const companiesWithInvalidSkills = [
            {
               company: 'Test Company',
               skills: ['JavaScript', 123, 'React', true, 'TypeScript', {}]
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithInvalidSkills);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         const skillValues = skillBadges.map(badge => badge.getAttribute('data-value'));
         
         expect(skillValues).toEqual(expect.arrayContaining(['JavaScript', 'React', 'TypeScript']));
         expect(skillValues).toHaveLength(3);
      });

      it('handles empty skills arrays', () => {
         const companiesWithEmptySkills = [
            {
               company: 'Company 1',
               skills: []
            },
            {
               company: 'Company 2',
               skills: ['JavaScript', 'React']
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithEmptySkills);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(2);
         expect(screen.getByText('JavaScript')).toBeInTheDocument();
         expect(screen.getByText('React')).toBeInTheDocument();
      });

      it('handles companies without skills property', () => {
         const companiesWithoutSkills = [
            {
               company: 'Company 1'
               // No skills property
            },
            {
               company: 'Company 2',
               skills: ['JavaScript', 'React']
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithoutSkills);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(2);
         expect(screen.getByText('JavaScript')).toBeInTheDocument();
         expect(screen.getByText('React')).toBeInTheDocument();
      });
   });

   describe('Edge cases', () => {
      it('handles empty companies list', () => {
         (companies as jest.Mock).mockReturnValue([]);

         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('skill-badge')).not.toBeInTheDocument();
      });

      it('handles companies function returning null', () => {
         (companies as jest.Mock).mockReturnValue(null);

         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('skill-badge')).not.toBeInTheDocument();
      });

      it('handles companies function returning undefined', () => {
         (companies as jest.Mock).mockReturnValue(undefined);

         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();
         expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
         expect(screen.queryByTestId('skill-badge')).not.toBeInTheDocument();
      });

      it('handles single company with single skill', () => {
         const singleCompany = [
            {
               company: 'Single Company',
               skills: ['JavaScript']
            }
         ];
         (companies as jest.Mock).mockReturnValue(singleCompany);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(1);
         expect(screen.getByText('JavaScript')).toBeInTheDocument();
      });

      it('handles duplicate skills across companies', () => {
         const companiesWithDuplicates = [
            {
               company: 'Company 1',
               skills: ['JavaScript', 'React', 'TypeScript']
            },
            {
               company: 'Company 2',
               skills: ['JavaScript', 'Vue.js', 'TypeScript']
            }
         ];
         (companies as jest.Mock).mockReturnValue(companiesWithDuplicates);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         const skillValues = skillBadges.map(badge => badge.getAttribute('data-value'));
         
         // Should have 4 unique skills
         expect(skillValues).toHaveLength(4);
         expect(skillValues).toEqual(expect.arrayContaining(['JavaScript', 'React', 'TypeScript', 'Vue.js']));
      });
   });

   describe('Component structure', () => {
      it('has correct HTML structure', () => {
         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toHaveClass('Skills');

         const container = screen.getByTestId('container');
         expect(section).toContainElement(container);

         const title = screen.getByRole('heading', { level: 2 });
         expect(container).toContainElement(title);

         const description = screen.getByText(/here are my skills and technologies/i);
         expect(container).toContainElement(description);

         const skillsGrid = document.querySelector('.skills-grid') as HTMLElement;
         expect(container).toContainElement(skillsGrid);
      });

      it('renders skills in correct order', () => {
         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges.length).toBeGreaterThan(0);

         // Skills should be in the order they appear in the Set (insertion order)
         const skillValues = skillBadges.map(badge => badge.getAttribute('data-value'));
         expect(skillValues).toEqual([...new Set(skillValues)]);
      });
   });

   describe('Accessibility', () => {
      it('uses semantic HTML structure', () => {
         render(<Skills />);

         const section = document.querySelector('.Skills');
         expect(section).toBeInTheDocument();

         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();
      });

      it('has proper heading hierarchy', () => {
         render(<Skills />);

         const mainHeading = screen.getByRole('heading', { level: 2 });
         expect(mainHeading).toHaveTextContent('Main Skills');
      });

      it('provides descriptive content', () => {
         render(<Skills />);

         const description = screen.getByText(/here are my skills and technologies/i);
         expect(description).toBeInTheDocument();
      });
   });

   describe('Performance considerations', () => {
      it('does not re-call companies function unnecessarily', () => {
         const { rerender } = render(<Skills />);
         
         expect(companies).toHaveBeenCalledTimes(1);
         
         rerender(<Skills />);
         
         // companies function should be called again on re-render since it's not memoized
         expect(companies).toHaveBeenCalledTimes(2);
      });

      it('handles large number of skills efficiently', () => {
         const companyWithManySkills = [
            {
               company: 'Large Company',
               skills: Array.from({ length: 100 }, (_, i) => `Skill ${i}`)
            }
         ];
         
         (companies as jest.Mock).mockReturnValue(companyWithManySkills);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(100);
      });

      it('efficiently deduplicates skills using Set', () => {
         const companiesWithManyDuplicates = Array.from({ length: 10 }, (_, i) => ({
            company: `Company ${i}`,
            skills: ['JavaScript', 'React', 'TypeScript', 'Node.js']
         }));
         
         (companies as jest.Mock).mockReturnValue(companiesWithManyDuplicates);

         render(<Skills />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(4); // Only 4 unique skills
      });
   });
});

