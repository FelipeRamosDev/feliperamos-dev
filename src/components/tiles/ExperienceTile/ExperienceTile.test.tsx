import { render, screen } from '@testing-library/react';
import ExperienceTile from './ExperienceTile';
import { ExperienceData } from '@/types/database.types';

// Mock dayjs first
jest.mock('dayjs', () => {
   const originalDayjs = jest.requireActual('dayjs');
   const mockDayjs = jest.fn((date?: string | Date | number) => {
      const dayjsInstance = originalDayjs(date);
      
      return {
         ...dayjsInstance,
         locale: jest.fn().mockReturnThis(),
         format: jest.fn((format: string) => {
            // Mock format responses based on format string
            const formatMockResponses: Record<string, string> = {
               'LL': 'July 15, 2023',
               'MMM YYYY': 'Jan 2022',
               'MMMM YYYY': 'January 2022',
               'MMMM YY': 'January 22',
               'MMM YY': 'Jan 22'
            };
            return formatMockResponses[format] || 'Mock Date';
         })
      };
   });
   
   // Add locale as a static method on the mock function
   Object.assign(mockDayjs, {
      locale: jest.fn().mockReturnValue(mockDayjs)
   });
   
   return mockDayjs;
});

// Mock the Card and DateView components
jest.mock('@/components/common', () => ({
   Card: ({ children, className, elevation }: any) => (
      <div
         data-testid="card"
         className={className}
         data-elevation={elevation}
      >
         {children}
      </div>
   ),
   DateView: jest.fn(({ date, ...props }: any) => {
      const dayjs = require('dayjs');
      if (!date) {
         return <span data-testid="date-view" {...props}>---</span>;
      }
      return <span data-testid="date-view" {...props}>Jan 2022</span>;
   })
}));

// Mock Material-UI Avatar
jest.mock('@mui/material', () => ({
   Avatar: ({ className, src, alt }: any) => (
      <div 
         data-testid="avatar" 
         className={className}
         data-src={src}
         data-alt={alt}
      >
         Avatar
      </div>
   )
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn((className, defaultClasses) => {
      if (className) {
         return [...defaultClasses, className].join(' ');
      }
      return defaultClasses.join(' ');
   })
}));

// Mock SCSS modules
jest.mock('./ExperienceTile.module.scss', () => ({
   ExperienceTile: 'ExperienceTile',
   tileHeader: 'tileHeader',
   companyLogo: 'companyLogo',
   avatar: 'avatar',
   headerContent: 'headerContent',
   dateLine: 'dateLine'
}));

const mockExperienceData: ExperienceData = {
   id: 1,
   position: 'Senior Developer',
   start_date: new Date('2022-01-01'),
   end_date: new Date('2023-12-31'),
   title: 'Senior Software Developer',
   type: 'full_time',
   status: 'published',
   company_id: 1,
   company: {
      id: 1,
      company_id: 1,
      company_name: 'Tech Corp',
      location: 'New York, NY',
      logo_url: 'https://example.com/logo.png',
      site_url: 'https://techcorp.com',
      languageSets: [],
      created_at: new Date(),
      updated_at: new Date(),
      schemaName: 'companies_schema',
      tableName: 'companies'
   },
   skills: [],
   languageSets: [],
   created_at: new Date('2022-01-01'),
   updated_at: new Date('2022-01-01'),
   schemaName: 'experiences_schema',
   tableName: 'experiences'
};

describe('ExperienceTile', () => {
   it('renders experience tile with all content', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp (Senior Developer)')).toBeInTheDocument();
      expect(screen.getAllByTestId('date-view')).toHaveLength(2);
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
   });

   it('renders company logo with correct props', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-src', 'https://example.com/logo.png');
      expect(avatar).toHaveAttribute('data-alt', 'Tech Corp');
      expect(avatar).toHaveClass('avatar');
   });

   it('renders date range correctly', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      const dateViews = screen.getAllByTestId('date-view');
      expect(dateViews).toHaveLength(2);
      
      // Check that dates are formatted as "Jan 2022"
      expect(dateViews[0]).toHaveTextContent('Jan 2022');
      expect(dateViews[1]).toHaveTextContent('Jan 2022');
   });

   it('applies custom className', () => {
      render(<ExperienceTile experience={mockExperienceData} className="custom-class" />);

      const card = screen.getByTestId('card');
      expect(card).toHaveClass('ExperienceTile custom-class');
   });

   it('renders with correct Card props', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('data-elevation', 'none');
   });

   it('handles experience without company data', () => {
      const experienceWithoutCompany = {
         ...mockExperienceData,
         company: null as any
      };

      render(<ExperienceTile experience={experienceWithoutCompany} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      // Should still render but with null company handled gracefully
      expect(screen.getByText('(Senior Developer)')).toBeInTheDocument();
   });

   it('handles experience with partial company data', () => {
      const experienceWithPartialCompany = {
         ...mockExperienceData,
         company: {
            ...mockExperienceData.company!,
            logo_url: '',
            company_name: ''
         }
      };

      render(<ExperienceTile experience={experienceWithPartialCompany} />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-src', '');
      expect(avatar).toHaveAttribute('data-alt', '');
   });

   it('renders fallback when no experience data', () => {
      render(<ExperienceTile experience={null as any} />);

      expect(screen.getByText('No experience data available')).toBeInTheDocument();
      expect(screen.queryByTestId('card')).not.toBeInTheDocument();
   });

   it('renders proper heading structure', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Tech Corp (Senior Developer)');
   });

   it('renders semantic HTML structure', () => {
      render(<ExperienceTile experience={mockExperienceData} />);

      // Check for proper paragraph structure
      const dateParagraph = screen.getByText((content, element) => {
         return element?.tagName.toLowerCase() === 'p' && element?.className.includes('dateLine');
      });
      expect(dateParagraph).toBeInTheDocument();
   });

   it('handles missing dates gracefully', () => {
      const experienceWithoutDates = {
         ...mockExperienceData,
         start_date: null as any,
         end_date: null as any
      };

      render(<ExperienceTile experience={experienceWithoutDates} />);

      const dateViews = screen.getAllByTestId('date-view');
      expect(dateViews).toHaveLength(2);
      expect(dateViews[0]).toHaveTextContent('---');
      expect(dateViews[1]).toHaveTextContent('---');
   });
});
