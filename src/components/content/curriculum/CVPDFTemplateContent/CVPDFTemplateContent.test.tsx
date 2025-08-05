import { render, screen } from '@testing-library/react';
import CVPDFTemplateContent from './CVPDFTemplateContent';
import { CVData, ExperienceData, SkillData } from '@/types/database.types';
import React from 'react';

// Mock the parseCSS helper
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn((className, moduleClass) => {
      if (moduleClass) {
         return `${className} ${moduleClass}`;
      }
      return className;
   })
}));

// Mock the SCSS module
jest.mock('./CVPDFTemplateContent.module.scss', () => ({
   CVPDFTemplateContent: 'CVPDFTemplateContent-module'
}));

// Mock the CVPDFTemplateProvider
jest.mock('./CVPDFTemplateContext', () => {
   return function MockCVPDFTemplateProvider({ cv, children }: { cv: CVData; children: React.ReactNode }) {
      return (
         <div data-testid="cv-pdf-template-provider" data-cv={JSON.stringify({ id: cv.id, title: cv.title })}>
            {children}
         </div>
      );
   };
});

// Mock the section components
jest.mock('./sections/CVPDFHeader', () => {
   return function MockCVPDFHeader() {
      return <div data-testid="cv-pdf-header">CV PDF Header</div>;
   };
});

jest.mock('./sections/CVPDFSkills', () => {
   return function MockCVPDFSkills() {
      return <div data-testid="cv-pdf-skills">CV PDF Skills</div>;
   };
});

jest.mock('./sections/CVPDFExperience', () => {
   return function MockCVPDFExperiences() {
      return <div data-testid="cv-pdf-experiences">CV PDF Experiences</div>;
   };
});

const mockCVData: CVData = {
   id: 1,
   title: 'Senior Developer CV',
   experience_time: 5,
   is_master: true,
   notes: 'Professional CV for senior developer position',
   cv_experiences: [],
   cv_skills: [],
   languageSets: [],
   cv_owner_id: 1,
   job_title: 'Senior Software Developer',
   sub_title: 'Full Stack Developer',
   summary: 'Experienced developer with 5+ years in web development',
   language_set: 'en',
   user_id: 1,
   cv_id: 1,
   user: {
      id: 1,
      email: 'john@example.com',
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe'
   },
   created_at: new Date('2023-01-01'),
   updated_at: new Date('2023-01-15'),
   schemaName: 'curriculums_schema',
   tableName: 'cvs'
};

describe('CVPDFTemplateContent', () => {
   it('renders the main structure correctly', () => {
      render(<CVPDFTemplateContent cv={mockCVData} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-header')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-skills')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-experiences')).toBeInTheDocument();
   });

   it('passes CV data to the provider correctly', () => {
      render(<CVPDFTemplateContent cv={mockCVData} />);

      const provider = screen.getByTestId('cv-pdf-template-provider');
      const cvData = JSON.parse(provider.getAttribute('data-cv') || '{}');
      
      expect(cvData.id).toBe(1);
      expect(cvData.title).toBe('Senior Developer CV');
   });

   it('applies correct CSS classes', () => {
      const { container } = render(<CVPDFTemplateContent cv={mockCVData} />);

      const mainDiv = container.querySelector('div[class*="CVPDFTemplateContent"]');
      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass('CVPDFTemplateContent CVPDFTemplateContent-module');
   });

   it('renders all sections in correct order', () => {
      render(<CVPDFTemplateContent cv={mockCVData} />);

      const container = screen.getByTestId('cv-pdf-template-provider');
      
      // Check order of sections within the main div
      const mainDiv = container.querySelector('div[class*="CVPDFTemplateContent"]');
      const sectionElements = mainDiv?.children;
      
      expect(sectionElements).toHaveLength(3);
      expect(sectionElements?.[0]).toHaveAttribute('data-testid', 'cv-pdf-header');
      expect(sectionElements?.[1]).toHaveAttribute('data-testid', 'cv-pdf-skills');
      expect(sectionElements?.[2]).toHaveAttribute('data-testid', 'cv-pdf-experiences');
   });

   it('handles minimal CV data', () => {
      const minimalCV: CVData = {
         id: 2,
         title: 'Basic CV',
         experience_time: 0,
         is_master: false,
         cv_experiences: [],
         cv_skills: [],
         languageSets: [],
         cv_owner_id: 2,
         language_set: 'en',
         user_id: 2,
         cv_id: 2,
         created_at: new Date(),
         schemaName: 'curriculums_schema',
         tableName: 'cvs'
      };

      render(<CVPDFTemplateContent cv={minimalCV} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-header')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-skills')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-experiences')).toBeInTheDocument();
   });

   it('provides CV context to child components', () => {
      render(<CVPDFTemplateContent cv={mockCVData} />);

      const provider = screen.getByTestId('cv-pdf-template-provider');
      expect(provider).toHaveAttribute('data-cv');
      
      // Verify the CV data is properly passed through context
      const cvData = JSON.parse(provider.getAttribute('data-cv') || '{}');
      expect(cvData.id).toBe(mockCVData.id);
      expect(cvData.title).toBe(mockCVData.title);
   });

   it('renders with different CV languages', () => {
      const portugueseCV: CVData = {
         ...mockCVData,
         id: 3,
         title: 'CV Desenvolvedor Senior',
         language_set: 'pt',
         job_title: 'Desenvolvedor de Software Senior',
         sub_title: 'Desenvolvedor Full Stack'
      };

      render(<CVPDFTemplateContent cv={portugueseCV} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      
      const provider = screen.getByTestId('cv-pdf-template-provider');
      const cvData = JSON.parse(provider.getAttribute('data-cv') || '{}');
      expect(cvData.title).toBe('CV Desenvolvedor Senior');
   });

   it('handles CV with experience and skills data', () => {
      const fullCV: CVData = {
         ...mockCVData,
         cv_experiences: [
            {
               id: 1,
               position: 'Senior Developer',
               title: 'Senior Software Developer',
               company_id: 1,
               company: {
                  id: 1,
                  company_id: 1,
                  company_name: 'Tech Corp',
                  location: 'New York',
                  logo_url: 'logo.png',
                  site_url: 'https://techcorp.com',
                  languageSets: [],
                  created_at: new Date(),
                  schemaName: 'companies_schema',
                  tableName: 'companies'
               },
               start_date: new Date('2020-01-01'),
               end_date: new Date('2023-12-31'),
               type: 'full_time',
               status: 'published',
               skills: [],
               languageSets: [],
               created_at: new Date(),
               schemaName: 'experiences_schema',
               tableName: 'experiences'
            }
         ] as ExperienceData[],
         cv_skills: [
            {
               id: 1,
               name: 'JavaScript',
               category: 'Programming',
               level: 'Expert',
               journey: '5 years experience',
               language_set: 'en',
               skill_id: '1',
               user_id: 1,
               languageSets: [],
               created_at: new Date(),
               schemaName: 'skills_schema',
               tableName: 'skills'
            }
         ] as SkillData[]
      };

      render(<CVPDFTemplateContent cv={fullCV} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-header')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-skills')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-experiences')).toBeInTheDocument();
   });

   it('maintains component structure with user data', () => {
      const cvWithUser: CVData = {
         ...mockCVData,
         user: {
            id: 1,
            email: 'jane@example.com',
            name: 'Jane Smith',
            first_name: 'Jane',
            last_name: 'Smith',
            portfolio_url: 'https://janesmith.dev',
            github_url: 'https://github.com/janesmith',
            linkedin_url: 'https://linkedin.com/in/janesmith'
         }
      };

      render(<CVPDFTemplateContent cv={cvWithUser} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      
      // All sections should still render regardless of user data complexity
      expect(screen.getByTestId('cv-pdf-header')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-skills')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-experiences')).toBeInTheDocument();
   });

   it('handles master CV flag correctly', () => {
      const masterCV: CVData = {
         ...mockCVData,
         is_master: true,
         notes: 'This is the master CV template'
      };

      render(<CVPDFTemplateContent cv={masterCV} />);

      expect(screen.getByTestId('cv-pdf-template-provider')).toBeInTheDocument();
      
      // Component should render the same way regardless of master flag
      expect(screen.getByTestId('cv-pdf-header')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-skills')).toBeInTheDocument();
      expect(screen.getByTestId('cv-pdf-experiences')).toBeInTheDocument();
   });
});
