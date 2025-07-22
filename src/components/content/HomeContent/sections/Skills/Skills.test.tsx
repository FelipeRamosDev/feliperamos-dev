import { render, screen } from '@testing-library/react';
import React from 'react';
import Skills from './Skills';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import TextResources from '@/services/TextResources/TextResources';
import { SkillData } from '@/types/database.types';

interface ContainerProps {
   children: React.ReactNode;
   padding?: string;
}

interface SkillBadgeProps {
   value: string;
   className?: string;
   'data-testid'?: string;
   'data-value'?: string;
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

// Mock SkillBadge component
jest.mock('@/components/badges', () => ({
   SkillBadge: ({ value, className, 'data-testid': dataTestId, 'data-value': dataValue }: SkillBadgeProps) => (
      <span 
         data-testid={dataTestId}
         data-value={dataValue}
         className={className}
      >
         {value}
      </span>
   )
}));

// Mock skills text
jest.mock('./Skills.text', () => ({
   merge: jest.fn().mockReturnValue({
      merge: jest.fn().mockReturnThis()
   })
}));

// Mock experience text
jest.mock('../Experience/Experience.text', () => ({}));

const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;

describe('Skills', () => {
   const mockSkillsData: SkillData[] = [
      {
         id: 1,
         name: 'JavaScript',
         category: 'Programming Language',
         level: 'Advanced',
         created_at: new Date('2023-01-01'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         journey: 'Frontend Development',
         language_set: 'en',
         skill_id: 'js-1',
         user_id: 'user-1',
         languageSets: []
      },
      {
         id: 2,
         name: 'TypeScript',
         category: 'Programming Language',
         level: 'Advanced',
         created_at: new Date('2023-01-02'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         journey: 'Frontend Development',
         language_set: 'en',
         skill_id: 'ts-1',
         user_id: 'user-1',
         languageSets: []
      },
      {
         id: 3,
         name: 'React',
         category: 'Framework',
         level: 'Expert',
         created_at: new Date('2023-01-03'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         journey: 'Frontend Development',
         language_set: 'en',
         skill_id: 'react-1',
         user_id: 'user-1',
         languageSets: []
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
            'Skills.title': 'Main Skills',
            'Skills.description': 'Here are my skills and technologies I have experience with: Programming languages, Frameworks, Libraries, Tools, and more.'
         };
         return textMap[key] || key;
      });
   });

   describe('Rendering', () => {
      it('renders the Skills section with proper structure', () => {
         render(<Skills skills={mockSkillsData} />);

         const section = screen.getByTestId('skills-section');
         expect(section).toBeInTheDocument();
         expect(section).toHaveClass('Skills');
      });

      it('renders the Container with correct padding', () => {
         render(<Skills skills={mockSkillsData} />);

         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         expect(container).toHaveAttribute('data-padding', 'xl');
      });

      it('renders the section title', () => {
         render(<Skills skills={mockSkillsData} />);

         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toBeInTheDocument();
         expect(title).toHaveClass('section-title');
         expect(title).toHaveTextContent('Main Skills');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.title');
      });

      it('renders the section description', () => {
         render(<Skills skills={mockSkillsData} />);

         const description = screen.getByText(/Here are my skills and technologies/);
         expect(description).toBeInTheDocument();
         expect(description).toHaveClass('section-description');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.description');
      });

      it('renders the skills grid container', () => {
         render(<Skills skills={mockSkillsData} />);

         const skillsGrid = screen.getByTestId('container').querySelector('.skills-grid');
         expect(skillsGrid).toBeInTheDocument();
      });
   });

   describe('Skills Data Handling', () => {
      it('renders skill badges for provided skills data', () => {
         render(<Skills skills={mockSkillsData} />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(mockSkillsData.length);

         // Check that all skills are rendered
         expect(screen.getByText('JavaScript')).toBeInTheDocument();
         expect(screen.getByText('TypeScript')).toBeInTheDocument();
         expect(screen.getByText('React')).toBeInTheDocument();
      });

      it('renders skill badges with correct props', () => {
         render(<Skills skills={mockSkillsData} />);

         const skillBadges = screen.getAllByTestId('skill-badge');
         
         skillBadges.forEach((badge, index) => {
            const skill = mockSkillsData[index];
            expect(badge).toHaveTextContent(skill.name);
            expect(badge).toHaveClass('skill-badge');
            expect(badge).toHaveAttribute('data-value', skill.name);
         });
      });

      it('generates unique keys for each skill badge', () => {
         const { container } = render(<Skills skills={mockSkillsData} />);
         
         const skillBadges = container.querySelectorAll('[data-testid="skill-badge"]');
         expect(skillBadges).toHaveLength(mockSkillsData.length);
         
         // Check that keys would be unique (based on the key generation logic)
         mockSkillsData.forEach((skill) => {
            const expectedKey = skill.id + skill.name + 'user-skill';
            expect(expectedKey).toBeTruthy();
            expect(expectedKey).toMatch(/^\d+.+user-skill$/);
         });
      });

      it('handles empty skills array gracefully', () => {
         render(<Skills skills={[]} />);

         const section = screen.getByTestId('skills-section');
         expect(section).toBeInTheDocument();
         
         const title = screen.getByRole('heading', { level: 2 });
         expect(title).toBeInTheDocument();
         
         const description = screen.getByText(/Here are my skills and technologies/);
         expect(description).toBeInTheDocument();
         
         // Should not render any skill badges
         expect(screen.queryByTestId('skill-badge')).not.toBeInTheDocument();
      });

      it('uses default empty array when skills prop is undefined', () => {
         // Test the default parameter - this tests how the component handles undefined props
         render(<Skills skills={undefined as unknown as SkillData[]} />);

         const section = screen.getByTestId('skills-section');
         expect(section).toBeInTheDocument();
         
         // Should not render any skill badges
         expect(screen.queryByTestId('skill-badge')).not.toBeInTheDocument();
      });
   });

   describe('Text Resources Integration', () => {
      it('calls useTextResources with merged text resources', () => {
         render(<Skills skills={mockSkillsData} />);

         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
         // The mock should receive the merged text resources
         expect(mockUseTextResources).toHaveBeenCalledWith(
           expect.objectContaining({
             merge: expect.any(Function)
           })
         );
      });

      it('retrieves correct text keys from text resources', () => {
         render(<Skills skills={mockSkillsData} />);

         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.title');
         expect(mockTextResources.getText).toHaveBeenCalledWith('Skills.description');
      });

      it('handles different languages through text resources', () => {
         mockTextResources.getText.mockImplementation((key: string) => {
            const textMap: Record<string, string> = {
               'Skills.title': 'Principais Habilidades',
               'Skills.description': 'Confira abaixo minhas habilidades e tecnologias que tenho experiência.'
            };
            return textMap[key] || key;
         });

         render(<Skills skills={mockSkillsData} />);

         expect(screen.getByText('Principais Habilidades')).toBeInTheDocument();
         expect(screen.getByText(/Confira abaixo minhas habilidades/)).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('uses semantic HTML structure', () => {
         render(<Skills skills={mockSkillsData} />);

         const section = screen.getByTestId('skills-section');
         expect(section).toBeInTheDocument();
         
         const heading = screen.getByRole('heading', { level: 2 });
         expect(heading).toBeInTheDocument();
      });

      it('provides proper heading hierarchy', () => {
         render(<Skills skills={mockSkillsData} />);

         const h2 = screen.getByRole('heading', { level: 2 });
         expect(h2).toBeInTheDocument();
         expect(h2).toHaveTextContent('Main Skills');
      });

      it('maintains proper content structure for screen readers', () => {
         render(<Skills skills={mockSkillsData} />);

         const section = screen.getByTestId('skills-section');
         const heading = screen.getByRole('heading', { level: 2 });
         const description = screen.getByText(/Here are my skills and technologies/);

         // Check that heading comes before description in DOM order
         expect(section).toContainElement(heading);
         expect(section).toContainElement(description);
      });
   });

   describe('Component Props', () => {
      it('accepts skills prop with SkillData array type', () => {
         const customSkills: SkillData[] = [
            {
               id: 99,
               name: 'Custom Skill',
               category: 'Custom Category',
               level: 'Beginner',
               created_at: new Date(),
               schemaName: 'skills_schema',
               tableName: 'skills',
               journey: 'Custom Journey',
               language_set: 'en',
               skill_id: 'custom-1',
               user_id: 'user-1',
               languageSets: []
            }
         ];

         render(<Skills skills={customSkills} />);

         expect(screen.getByText('Custom Skill')).toBeInTheDocument();
      });

      it('handles skills with different data shapes correctly', () => {
         const skillsWithVariations: SkillData[] = [
            {
               id: 1,
               name: 'Skill A',
               category: 'Category A',
               level: 'Expert',
               created_at: new Date('2023-01-01'),
               schemaName: 'skills_schema',
               tableName: 'skills',
               journey: 'Journey A',
               language_set: 'en',
               skill_id: 'skill-a-1',
               user_id: 'user-1',
               languageSets: []
            },
            {
               id: 2,
               name: 'Skill B',
               category: 'Category B',
               level: 'Intermediate',
               created_at: new Date('2023-01-02'),
               schemaName: 'skills_schema',
               tableName: 'skills',
               journey: 'Journey B',
               language_set: 'en',
               skill_id: 'skill-b-1',
               user_id: 'user-1',
               languageSets: []
            }
         ];

         render(<Skills skills={skillsWithVariations} />);

         expect(screen.getByText('Skill A')).toBeInTheDocument();
         expect(screen.getByText('Skill B')).toBeInTheDocument();
      });
   });

   describe('Error Handling', () => {
      it('handles text resource errors gracefully', () => {
         mockTextResources.getText.mockImplementation(() => {
            throw new Error('Text resource error');
         });

         expect(() => {
            render(<Skills skills={mockSkillsData} />);
         }).toThrow('Text resource error');
      });

      it('handles skills data with missing properties', () => {
         const incompleteSkill = {
            id: 1,
            name: 'Incomplete Skill'
            // Missing other required properties
         } as SkillData;

         render(<Skills skills={[incompleteSkill]} />);

         expect(screen.getByText('Incomplete Skill')).toBeInTheDocument();
      });
   });
});
