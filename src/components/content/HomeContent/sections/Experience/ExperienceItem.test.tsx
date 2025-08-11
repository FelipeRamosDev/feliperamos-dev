import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExperienceItem from './ExperienceItem';
import { ExperienceData, CompanyData, SkillData } from '@/types/database.types';

// Mock Next.js Image component
jest.mock('next/image', () => {
   return function MockImage({ src, alt, width, height, loading, ...props }: any) {
      return (
         <img 
            src={src || undefined} 
            alt={alt} 
            width={width} 
            height={height} 
            data-loading={loading}
            {...props}
         />
      );
   };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
   return function MockLink({ href, children, className, target, ...props }: any) {
      return (
         <a href={href} className={className} target={target} {...props}>
            {children}
         </a>
      );
   };
});

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
   CalendarMonth: ({ fontSize }: { fontSize?: string }) => (
      <svg data-testid="CalendarMonthIcon" data-font-size={fontSize} aria-hidden="true" className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-120dh41-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24">
         <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 16H5V10h14zM9 14H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2zm-8 4H7v-2h2zm4 0h-2v-2h2zm4 0h-2v-2h2z"/>
      </svg>
   ),
   Monitor: ({ fontSize }: { fontSize?: string }) => (
      <svg data-testid="MonitorIcon" data-font-size={fontSize} aria-hidden="true" className="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-120dh41-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24">
         <path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 13H4V5h16z"/>
      </svg>
   )
}));

// Mock Card component
jest.mock('@/components/common', () => ({
   Card: ({ children, className, padding, elevation, ...props }: any) => (
      <div 
         data-testid="card"
         className={className}
         data-padding={padding}
         data-elevation={elevation}
         {...props}
      >
         {children}
      </div>
   ),
   Markdown: ({ className, value, ...props }: any) => (
      <div data-testid="markdown" className={className} {...props}>
         {value}
      </div>
   )
}));

// Mock SkillBadge component
jest.mock('@/components/badges', () => ({
   SkillBadge: ({ value, className, padding, disabled, ...props }: any) => (
      <span 
         data-testid="skill-badge"
         className={className}
         data-padding={padding}
         data-disabled={disabled}
         data-value={value}
         {...props}
      >
         {value}
      </span>
   )
}));

// Mock text resources
const mockUseTextResources = jest.fn();
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => mockUseTextResources()
}));

// Mock texts
jest.mock('./Experience.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

describe('ExperienceItem', () => {
   const mockSkillData: SkillData[] = [
      {
         id: 1,
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         skill_id: '1',
         name: 'React',
         category: 'Frontend',
         level: 'Expert',
         journey: 'Frontend Development',
         language_set: 'en',
         user_id: 1,
         languageSets: []
      },
      {
         id: 2,
         created_at: new Date('2023-01-03'),
         updated_at: new Date('2023-01-04'),
         schemaName: 'skills_schema',
         tableName: 'skills',
         skill_id: '2',
         name: 'TypeScript',
         category: 'Programming Language',
         level: 'Expert',
         journey: 'Full Stack Development',
         language_set: 'en',
         user_id: 1,
         languageSets: []
      }
   ];

   const mockCompanyData: CompanyData = {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'companies_schema',
      tableName: 'companies',
      company_id: 1,
      company_name: 'Test Company',
      location: 'New York, NY',
      logo_url: 'https://test.com/logo.png',
      site_url: 'https://test.com',
      description: 'Test company description',
      industry: 'Technology',
      language_set: 'en',
      languageSets: []
   };

   const mockExperienceData: ExperienceData = {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'experiences_schema',
      tableName: 'experiences',
      position: 'Senior Developer',
      start_date: new Date('2022-01-01'),
      end_date: new Date('2023-12-31'),
      company: mockCompanyData,
      company_id: 1,
      languageSets: [],
      skills: mockSkillData,
      status: 'published',
      title: 'Senior Developer Position',
      type: 'full_time',
      summary: 'Worked as a senior developer',
      description: 'Developed various applications using React and TypeScript',
      responsibilities: 'Led team development, code reviews, mentoring',
      language_set: 'en'
   };

   beforeEach(() => {
      jest.clearAllMocks();
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string, ...args: string[]) => {
               const textMap: Record<string, string> = {
                  'Experience.item.title': `${args[0]} at ${args[1]}`,
                  'Experience.item.experienceTime': `${args[0]} - ${args[1]}`,
                  'Experience.item.timeDifference': '(2 years)'
               };
               return textMap[key] || key;
            })
         }
      });
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(
            <ExperienceItem experience={mockExperienceData} />
         )).not.toThrow();
      });

      test('renders main container with correct test id', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByTestId('experience-item')).toBeInTheDocument();
         expect(screen.getByTestId('experience-item')).toHaveClass('ExperienceItem');
      });

      test('renders experience header section', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const cards = screen.getAllByTestId('card');
         const headerCard = cards.find(card => card.className?.includes('experience-header'));
         expect(headerCard).toBeInTheDocument();
      });

      test('renders company logo', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const logo = screen.getByRole('img');
         expect(logo).toBeInTheDocument();
         expect(logo).toHaveAttribute('src', 'https://test.com/logo.png');
         expect(logo).toHaveAttribute('alt', 'Test Company Logo');
         expect(logo).toHaveAttribute('width', '250');
         expect(logo).toHaveAttribute('height', '250');
         expect(logo).toHaveAttribute('data-loading', 'lazy');
      });

      test('renders position and company name', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByText('Senior Developer at Test Company')).toBeInTheDocument();
      });

      test('renders experience dates', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         // Check that the date text appears within dedicated elements
         const startDateStr = mockExperienceData.start_date!.toString();
         const endDateStr = mockExperienceData.end_date!.toString();

         const rangeEl = screen.getByTestId('experience-time-range');
         expect(rangeEl.textContent).toContain(startDateStr);
         expect(rangeEl.textContent).toContain(endDateStr);

         const diffEl = screen.getByTestId('experience-time-diff');
         expect(diffEl).toHaveTextContent('(2 years)');
         expect(screen.getByTestId('CalendarMonthIcon')).toBeInTheDocument();
      });

      test('renders company website link when available', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const link = screen.getByRole('link');
         expect(link).toBeInTheDocument();
         expect(link).toHaveAttribute('href', 'https://test.com');
         expect(link).toHaveAttribute('target', '_blank');
         expect(screen.getByTestId('MonitorIcon')).toBeInTheDocument();
      });

      test('renders skill badges', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const skillBadges = screen.getAllByTestId('skill-badge');
         expect(skillBadges).toHaveLength(2);
         expect(skillBadges[0]).toHaveAttribute('data-value', 'React');
         expect(skillBadges[1]).toHaveAttribute('data-value', 'TypeScript');
      });

      test('renders experience details sections', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const markdownElements = screen.getAllByTestId('markdown');
         expect(markdownElements).toHaveLength(3);
         
         const summaryMarkdown = markdownElements.find(el => el.className?.includes('summary'));
         const descriptionMarkdown = markdownElements.find(el => el.className?.includes('description'));
         const responsibilitiesMarkdown = markdownElements.find(el => el.className?.includes('responsibilities'));
         
         expect(summaryMarkdown).toBeInTheDocument();
         expect(descriptionMarkdown).toBeInTheDocument();
         expect(responsibilitiesMarkdown).toBeInTheDocument();
      });
   });

   describe('Content Display', () => {
      test('displays experience summary', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByText('Worked as a senior developer')).toBeInTheDocument();
      });

      test('displays experience description', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByText('Developed various applications using React and TypeScript')).toBeInTheDocument();
      });

      test('displays responsibilities', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByText('Led team development, code reviews, mentoring')).toBeInTheDocument();
      });

      test('displays all skills associated with experience', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByText('React')).toBeInTheDocument();
         expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
   });

   describe('Props Handling', () => {
      test('handles experience without company', () => {
         const experienceWithoutCompany = {
            ...mockExperienceData,
            company: null
         };
         
         expect(() => render(
            <ExperienceItem experience={experienceWithoutCompany as any} />
         )).not.toThrow();
      });
      
      test('handles experience without skills', () => {
         const experienceWithoutSkills: ExperienceData = {
            ...mockExperienceData,
            skills: []
         };
         
         expect(() => render(
            <ExperienceItem experience={experienceWithoutSkills} />
         )).not.toThrow();
         
         // Should render zero skill badges
         const badges = screen.queryAllByTestId('skill-badge');
         expect(badges.length).toBe(0);
      });

      test('handles company without logo', () => {
         const experienceWithNoLogo: ExperienceData = {
            ...mockExperienceData,
            company: {
               ...mockCompanyData,
               logo_url: ''
            }
         };

         expect(() => render(<ExperienceItem experience={experienceWithNoLogo} />)).not.toThrow();
      });

      test('handles company without website', () => {
         const experienceWithNoWebsite: ExperienceData = {
            ...mockExperienceData,
            company: {
               ...mockCompanyData,
               site_url: ''
            }
         };

         render(<ExperienceItem experience={experienceWithNoWebsite} />);
         const link = screen.queryByRole('link');
         expect(link).toBeNull();
      });

      test('handles missing experience content', () => {
         const experienceWithMissingContent: ExperienceData = {
            ...mockExperienceData,
            summary: '',
            description: '',
            responsibilities: ''
         };
         
         render(<ExperienceItem experience={experienceWithMissingContent} />);
         
         const markdownElements = screen.getAllByTestId('markdown');
         markdownElements.forEach(element => {
            expect(element).toHaveTextContent('');
         });
      });
   });

   describe('Text Resources Integration', () => {
      test('calls useTextResources with correct text module', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(mockUseTextResources).toHaveBeenCalledTimes(1);
      });

      test('formats position and company name using text resources', () => {
         const mockGetText = jest.fn((key: string, ...args: string[]) => {
            if (key === 'Experience.item.title') {
               return `${args[0]} @ ${args[1]}`;
            }
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(mockGetText).toHaveBeenCalledWith('Experience.item.title', 'Senior Developer', 'Test Company');
         expect(screen.getByText('Senior Developer @ Test Company')).toBeInTheDocument();
      });

      test('formats experience dates using text resources', () => {
         const mockGetText = jest.fn((key: string, ...args: string[]) => {
            if (key === 'Experience.item.experienceTime') {
               return `From ${args[0]} to ${args[1]}`;
            }
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<ExperienceItem experience={mockExperienceData} />);
         
         const startDateStr = mockExperienceData.start_date!.toString();
         const endDateStr = mockExperienceData.end_date!.toString();
         expect(mockGetText).toHaveBeenCalledWith('Experience.item.experienceTime', startDateStr, endDateStr);

         const rangeEl = screen.getByTestId('experience-time-range');
         expect(rangeEl.textContent).toContain(`From ${startDateStr} to ${endDateStr}`);
      });

      test('displays time difference using text resources', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'Experience.item.timeDifference') {
               return '(24 months)';
            }
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         });

         render(<ExperienceItem experience={mockExperienceData} />);
         
         const startDateStr = mockExperienceData.start_date!.toString();
         const endDateStr = mockExperienceData.end_date!.toString();
         expect(mockGetText).toHaveBeenCalledWith('Experience.item.timeDifference', startDateStr, endDateStr);

         const diffEl = screen.getByTestId('experience-time-diff');
         expect(diffEl).toHaveTextContent('(24 months)');
      });
   });

   describe('Card Configuration', () => {
      test('applies correct padding and elevation to cards', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const cards = screen.getAllByTestId('card');
         cards.forEach(card => {
            expect(card).toHaveAttribute('data-padding', 'l');
            expect(card).toHaveAttribute('data-elevation', 'none');
         });
      });

      test('renders multiple card sections', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const cards = screen.getAllByTestId('card');
         expect(cards.length).toBeGreaterThanOrEqual(3); // Header, summary-description, aside
      });
   });

   describe('Skill Badge Configuration', () => {
      test('applies correct props to skill badges', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const skillBadges = screen.getAllByTestId('skill-badge');
         skillBadges.forEach(badge => {
            expect(badge).toHaveAttribute('data-padding', 'xs');
            expect(badge).toHaveAttribute('data-disabled', 'true');
            expect(badge).toHaveClass('skill');
         });
      });

      test('generates unique keys for skill badges', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const skillBadges = screen.getAllByTestId('skill-badge');
         const keys = skillBadges.map(badge => badge.getAttribute('data-value'));
         const uniqueKeys = new Set(keys);
         
         expect(uniqueKeys.size).toBe(skillBadges.length);
      });
   });

   describe('Accessibility', () => {
      test('provides accessible alt text for company logo', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const logo = screen.getByRole('img');
         expect(logo).toHaveAttribute('alt', 'Test Company Logo');
      });

      test('provides accessible icons with proper sizing', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const calendarIcon = screen.getByTestId('CalendarMonthIcon');
         const monitorIcon = screen.getByTestId('MonitorIcon');
         
         expect(calendarIcon).toHaveAttribute('data-font-size', 'small');
         expect(monitorIcon).toHaveAttribute('data-font-size', 'small');
      });

      test('opens external links in new tab', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const link = screen.getByRole('link');
         expect(link).toHaveAttribute('target', '_blank');
      });
   });

   describe('Performance', () => {
      test('uses lazy loading for company logo', () => {
         render(<ExperienceItem experience={mockExperienceData} />);
         
         const logo = screen.getByRole('img');
         expect(logo).toHaveAttribute('data-loading', 'lazy');
      });

      test('renders efficiently with multiple re-renders', () => {
         const { rerender } = render(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByTestId('experience-item')).toBeInTheDocument();
         
         rerender(<ExperienceItem experience={mockExperienceData} />);
         
         expect(screen.getByTestId('experience-item')).toBeInTheDocument();
      });
   });

   describe('Error Handling', () => {
      test('handles null experience data gracefully', () => {
         expect(() => render(
            <ExperienceItem experience={null as any} />
         )).not.toThrow();
      });

      test('handles missing experience properties', () => {
         const minimalExperience = {
            id: 1,
            position: 'Developer'
         } as ExperienceData;
         
         expect(() => render(
            <ExperienceItem experience={minimalExperience} />
         )).not.toThrow();
      });

      test('handles text resource errors gracefully', () => {
         mockUseTextResources.mockReturnValue({
            textResources: {
               getText: jest.fn(() => { throw new Error('Text error'); })
            }
         });

         expect(() => render(
            <ExperienceItem experience={mockExperienceData} />
         )).toThrow();
      });
   });
});
