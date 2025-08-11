import { render, screen } from '@testing-library/react';
import AboutMe from './AboutMe';
import { CVData } from '@/types/database.types';

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn(() => ({
      textResources: {
         getText: jest.fn((key: string, param?: string) => {
            if (key === 'AboutMe.experienceTime') {
               return `${param} years of experience`;
            }
            return `Mocked text for ${key}`;
         })
      }
   }))
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
   return function MockImage({ 
      src, 
      alt, 
      width, 
      height,
      ...props 
   }: { 
      src: string; 
      alt: string; 
      width: number; 
      height: number; 
   }) {
      return (
         <img 
            src={src} 
            alt={alt} 
            width={width} 
            height={height}
            data-testid="about-me-avatar"
            {...props}
         />
      );
   };
});

// Mock common components
jest.mock('@/components/common', () => ({
   Container: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="container">{children}</div>
   ),
   Markdown: ({ className, value }: { className?: string; value?: string }) => (
      <div data-testid="markdown" className={className}>
         {value}
      </div>
   )
}));

// Mock layout components
jest.mock('@/components/layout', () => ({
   ContentSidebar: ({ className, children }: { className?: string; children: React.ReactNode }) => (
      <div data-testid="content-sidebar" className={className}>
         {children}
      </div>
   )
}));

// Mock SCSS module
jest.mock('./AboutMe.module.scss', () => ({
   AboutMe: 'AboutMe-module',
   contentFlex: 'contentFlex-module',
   avatar: 'avatar-module',
   sectionTitle: 'sectionTitle-module',
   jobTitle: 'jobTitle-module',
   experienceTime: 'experienceTime-module',
   aboutMeContent: 'aboutMeContent-module'
}));

const mockCVData: CVData = {
   id: 1,
   title: 'Senior Developer CV',
   experience_time: 5,
   is_master: true,
   job_title: 'Senior Software Developer',
   sub_title: 'Full Stack Developer',
   summary: 'Experienced developer with expertise in **React**, **Node.js**, and **TypeScript**. Passionate about creating scalable web applications.',
   language_set: 'en',
   user_id: 1,
   cv_id: 1,
   cv_owner_id: 1,
   user: {
      id: 1,
      email: 'john@example.com',
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      portfolio_url: 'https://johndoe.dev',
      github_url: 'https://github.com/johndoe',
      linkedin_url: 'https://linkedin.com/in/johndoe'
   },
   cv_experiences: [],
   cv_skills: [],
   languageSets: [],
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-01-15'),
   schemaName: 'curriculums_schema',
   tableName: 'cvs'
};

describe('AboutMe', () => {
   it('renders the section with correct structure', () => {
      render(<AboutMe cv={mockCVData} />);

      expect(screen.getByTestId('about-me-section')).toBeInTheDocument();
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
   });

   it('displays user avatar correctly', () => {
      render(<AboutMe cv={mockCVData} />);

      const avatar = screen.getByTestId('about-me-avatar');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', '/images/user-avatar.jpg');
      expect(avatar).toHaveAttribute('alt', 'John Doe User Avatar');
      expect(avatar).toHaveAttribute('width', '200');
      expect(avatar).toHaveAttribute('height', '200');
   });

   it('displays user name as section title', () => {
      render(<AboutMe cv={mockCVData} />);

      const sectionTitle = screen.getByRole('heading', { level: 2 });
      expect(sectionTitle).toHaveTextContent('John Doe');
      expect(sectionTitle).toHaveClass('sectionTitle-module');
   });

   it('displays job title', () => {
      render(<AboutMe cv={mockCVData} />);

      const jobTitle = screen.getByText('Senior Software Developer');
      expect(jobTitle).toBeInTheDocument();
      expect(jobTitle).toHaveClass('jobTitle-module');
   });

   it('displays experience time with localized text', () => {
      render(<AboutMe cv={mockCVData} />);

      const experienceTime = screen.getByText('5 years of experience');
      expect(experienceTime).toBeInTheDocument();
      expect(experienceTime).toHaveClass('experienceTime-module');
   });

   it('renders summary content using Markdown component', () => {
      render(<AboutMe cv={mockCVData} />);

      const markdown = screen.getByTestId('markdown');
      expect(markdown).toBeInTheDocument();
      expect(markdown).toHaveClass('aboutMeContent-module');
      expect(markdown).toHaveTextContent('Experienced developer with expertise in **React**, **Node.js**, and **TypeScript**. Passionate about creating scalable web applications.');
   });

   it('applies correct CSS classes', () => {
      render(<AboutMe cv={mockCVData} />);

      const section = screen.getByTestId('about-me-section');
      expect(section).toHaveClass('AboutMe-module');

      const contentSidebar = screen.getByTestId('content-sidebar');
      expect(contentSidebar).toHaveClass('contentFlex-module');
   });

   it('handles CV with no user data gracefully', () => {
      const cvWithoutUser: CVData = {
         ...mockCVData,
         user: undefined
      };

      render(<AboutMe cv={cvWithoutUser} />);

      const avatar = screen.getByTestId('about-me-avatar');
      expect(avatar).toHaveAttribute('alt', 'undefined User Avatar');

      // Section title should handle undefined user name
      const sectionTitle = screen.getByRole('heading', { level: 2 });
      expect(sectionTitle).toHaveTextContent('');
   });

   it('handles CV with no job title', () => {
      const cvWithoutJobTitle: CVData = {
         ...mockCVData,
         job_title: undefined
      };

      render(<AboutMe cv={cvWithoutJobTitle} />);

      // Should still render the paragraph element
      const jobTitleElements = screen.getByTestId('about-me-section').querySelectorAll('p');
      const jobTitleElement = Array.from(jobTitleElements).find(el => 
         el.classList.contains('jobTitle-module')
      );
      expect(jobTitleElement).toBeInTheDocument();
      expect(jobTitleElement).toHaveTextContent('');
   });

   it('handles zero experience time', () => {
      const cvWithZeroExperience: CVData = {
         ...mockCVData,
         experience_time: 0
      };

      render(<AboutMe cv={cvWithZeroExperience} />);

      const experienceTime = screen.getByText('0 years of experience');
      expect(experienceTime).toBeInTheDocument();
   });

   it('handles undefined experience time', () => {
      const cvWithoutExperience: CVData = {
         ...mockCVData,
         experience_time: undefined
      };

      render(<AboutMe cv={cvWithoutExperience} />);

      const experienceTime = screen.getByText('0 years of experience');
      expect(experienceTime).toBeInTheDocument();
   });

   it('handles empty summary', () => {
      const cvWithEmptySummary: CVData = {
         ...mockCVData,
         summary: ''
      };

      render(<AboutMe cv={cvWithEmptySummary} />);

      const markdown = screen.getByTestId('markdown');
      expect(markdown).toBeInTheDocument();
      expect(markdown).toHaveTextContent('');
   });

   it('handles undefined summary', () => {
      const cvWithoutSummary: CVData = {
         ...mockCVData,
         summary: undefined
      };

      render(<AboutMe cv={cvWithoutSummary} />);

      const markdown = screen.getByTestId('markdown');
      expect(markdown).toBeInTheDocument();
      expect(markdown).toHaveTextContent('');
   });

   it('handles decimal experience time', () => {
      const cvWithDecimalExperience: CVData = {
         ...mockCVData,
         experience_time: 5.7
      };

      render(<AboutMe cv={cvWithDecimalExperience} />);

      const experienceTime = screen.getByText('6 years of experience');
      expect(experienceTime).toBeInTheDocument();
   });

   it('displays different user information correctly', () => {
      const differentUser: CVData = {
         ...mockCVData,
         user: {
            id: 2,
            email: 'jane@example.com',
            name: 'Jane Smith',
            first_name: 'Jane',
            last_name: 'Smith'
         },
         job_title: 'UX Designer',
         experience_time: 3,
         summary: 'Creative designer with passion for **user experience** and **accessibility**.'
      };

      render(<AboutMe cv={differentUser} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Jane Smith');
      expect(screen.getByText('UX Designer')).toBeInTheDocument();
      expect(screen.getByText('3 years of experience')).toBeInTheDocument();
      expect(screen.getByTestId('about-me-avatar')).toHaveAttribute('alt', 'Jane Smith User Avatar');
      
      const markdown = screen.getByTestId('markdown');
      expect(markdown).toHaveTextContent('Creative designer with passion for **user experience** and **accessibility**.');
   });

   it('maintains section structure with minimal data', () => {
      const minimalCV: CVData = {
         id: 1,
         title: 'Basic CV',
         experience_time: 0,
         is_master: false,
         cv_experiences: [],
         cv_skills: [],
         languageSets: [],
         cv_owner_id: 1,
         language_set: 'en',
         user_id: 1,
         cv_id: 1,
         created_at: new Date(),
         schemaName: 'curriculums_schema',
         tableName: 'cvs'
      };

      render(<AboutMe cv={minimalCV} />);

      // Should still render all structural elements
      expect(screen.getByTestId('about-me-section')).toBeInTheDocument();
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('content-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('about-me-avatar')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByTestId('markdown')).toBeInTheDocument();
   });
});
