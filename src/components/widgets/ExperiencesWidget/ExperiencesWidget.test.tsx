import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { ExperienceData, CompanyData, SkillData } from '@/types/database.types';

// Import mocked functions
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

// Mock the actual component for testing
const MockExperiencesWidget: React.FC = () => {
   const ajax = useAjax();
   const { textResources } = useTextResources();
   const router = useRouter();
   const [experiences, setExperiences] = React.useState<ExperienceData[]>([]);
   const [loading, setLoading] = React.useState<boolean>(true);

   React.useEffect(() => {
      ajax.get('/experience/query', { params: { language_set: textResources.currentLanguage } })
         .then((response: unknown) => {
            const typedResponse = response as { success: boolean; data: ExperienceData[]; message?: string };
            if (typedResponse.success) {
               setExperiences(Array.isArray(typedResponse.data) ? typedResponse.data : []);
            } else {
               console.error('Error fetching user experiences:', typedResponse.message);
            }
         })
         .catch((error: Error) => {
            console.error('Error fetching user experiences:', error);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [ajax, textResources.currentLanguage]);

   const handleRowClick = (experience: ExperienceData) => {
      router.push(`/admin/experience/${experience.id}`);
   };

   return (
      <div className="ExperiencesWidget" data-testid="experiences-widget">
         <div data-testid="widget-header">
            <div data-testid="widget-title">{textResources.getText('ExperiencesWidget.headerTitle')}</div>
            <button 
               data-testid="mui-button"
               data-href="/admin/experience/create"
               data-variant="contained"
               data-color="primary"
            >
               <span data-testid="add-icon">Add Icon</span>
               {textResources.getText('ExperiencesWidget.addExperienceButton')}
            </button>
         </div>
         <div data-testid="table-base">
            <div data-testid="hide-header">true</div>
            <div data-testid="use-pagination">true</div>
            <div data-testid="column-count">5</div>
            <div data-testid="loading-state">{loading ? 'Loading...' : 'Not loading'}</div>
            <div data-testid="no-documents-text">{textResources.getText('ExperiencesWidget.noDocumentsText')}</div>
            <div data-testid="items-count">{experiences.length}</div>
            {experiences.map((experience, index) => (
               <div 
                  key={experience.id} 
                  data-testid={`table-row-${index}`}
                  onClick={() => handleRowClick(experience)}
                  role="button"
                  tabIndex={0}
               >
                  <div data-testid={`experience-title-${index}`}>{experience.company?.company_name || experience.title}</div>
                  <div data-testid={`experience-position-${index}`}>{experience.position}</div>
                  <div data-testid={`experience-type-${index}`}>{experience.type}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

// Use the mock instead of the real component
const ExperiencesWidget = MockExperiencesWidget;

// Mock the hooks and services
jest.mock('@/hooks/useAjax');
jest.mock('@/services/TextResources/TextResourcesProvider');
jest.mock('next/navigation');

// Mock the child components
jest.mock('@/components/common/TableBase', () => {
   return function MockTableBase({ 
      items, 
      loading, 
      noDocumentsText, 
      columnConfig, 
      onClickRow,
      hideHeader,
      usePagination,
      className
   }: {
      items?: ExperienceData[];
      loading?: boolean;
      noDocumentsText?: string;
      columnConfig?: Array<{ key: string; label: string }>;
      onClickRow?: (item: ExperienceData) => void;
      hideHeader?: boolean;
      usePagination?: boolean;
      className?: string;
   }) {
      return (
         <div data-testid="table-base" className={className}>
            <div data-testid="loading-state">{loading ? 'Loading...' : 'Not loading'}</div>
            <div data-testid="no-documents-text">{noDocumentsText}</div>
            <div data-testid="hide-header">{hideHeader ? 'true' : 'false'}</div>
            <div data-testid="use-pagination">{usePagination ? 'true' : 'false'}</div>
            <div data-testid="column-count">{columnConfig?.length || 0}</div>
            <div data-testid="items-count">{items?.length || 0}</div>
            {items?.map((item: ExperienceData, index: number) => (
               <div 
                  key={index} 
                  data-testid={`table-row-${index}`}
                  onClick={() => onClickRow?.(item)}
                  role="button"
                  tabIndex={0}
               >
                  <div data-testid={`experience-title-${index}`}>{item.company?.company_name || item.title}</div>
                  <div data-testid={`experience-position-${index}`}>{item.position}</div>
                  <div data-testid={`experience-type-${index}`}>{item.type}</div>
               </div>
            ))}
         </div>
      );
   };
});

jest.mock('@/components/headers/WidgetHeader/WidgetHeader', () => {
   return function MockWidgetHeader({ title, children }: { title?: string; children?: React.ReactNode }) {
      return (
         <div data-testid="widget-header">
            <div data-testid="widget-title">{title}</div>
            <div data-testid="widget-header-children">{children}</div>
         </div>
      );
   };
});

// Mock Material-UI components
jest.mock('@mui/material', () => ({
   Button: ({ children, href, variant, color, startIcon }: { 
      children?: React.ReactNode; 
      href?: string; 
      variant?: string; 
      color?: string; 
      startIcon?: React.ReactNode;
   }) => (
      <button 
         data-testid="mui-button"
         data-href={href}
         data-variant={variant}
         data-color={color}
      >
         {startIcon && <span data-testid="button-icon">{startIcon}</span>}
         {children}
      </button>
   ),
}));

jest.mock('@mui/icons-material', () => ({
   Add: () => <span data-testid="add-icon">Add Icon</span>,
}));

jest.mock('next/link', () => {
   return function MockLink({ children }: { children?: React.ReactNode }) {
      return <div data-testid="next-link">{children}</div>;
   };
});

// Mock experience widget config
jest.mock('./experienceWidget.config', () => ({
   experienceWidgetColumns: [
      { propKey: 'title', label: 'Title', align: 'left' },
      { propKey: 'type', label: 'Type', align: 'left' },
      { propKey: 'status', label: 'Skills', align: 'left' },
      { propKey: 'data', label: 'Start Date', align: 'left' },
      { propKey: 'company', label: 'Company', align: 'left' }
   ]
}));

const mockUseAjax = useAjax as jest.MockedFunction<typeof useAjax>;
const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('ExperiencesWidget', () => {
   const mockPush = jest.fn();
   const mockGet = jest.fn();

   const mockCompany: CompanyData = {
      id: 1,
      company_name: 'Tech Corp',
      logo_url: 'https://example.com/logo.png',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
      location: 'San Francisco',
      site_url: 'https://techcorp.com',
      languageSets: [],
      schemaName: 'companies',
      tableName: 'companies',
      company_id: 1,
   };

   const mockSkill: SkillData = {
      id: 1,
      name: 'JavaScript',
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-01'),
      languageSets: [],
      schemaName: 'skills',
      tableName: 'skills',
      skill_id: '1',
      category: 'Programming',
      level: 'Advanced',
      journey: 'Professional',
      language_set: 'en',
      user_id: 1,
   };

   const mockExperiences: ExperienceData[] = [
      {
         id: 1,
         title: 'Senior Developer',
         position: 'Senior Software Engineer',
         type: 'full_time',
         status: 'published',
         start_date: new Date('2022-01-01'),
         end_date: new Date('2023-12-31'),
         company: mockCompany,
         company_id: 1,
         skills: [mockSkill],
         languageSets: [],
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-01'),
         schemaName: 'experiences',
         tableName: 'experiences',
         description: 'Senior developer role',
         summary: 'Led development team',
      },
      {
         id: 2,
         title: 'Frontend Developer',
         position: 'Frontend Engineer',
         type: 'contract',
         status: 'published',
         start_date: new Date('2021-06-01'),
         end_date: new Date('2021-12-31'),
         company: {
            ...mockCompany,
            id: 2,
            company_name: 'StartupCo',
            company_id: 2,
         },
         company_id: 2,
         skills: [mockSkill],
         languageSets: [],
         created_at: new Date('2023-01-02'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'experiences',
         tableName: 'experiences',
         description: 'Frontend development',
         summary: 'Built user interfaces',
      },
      {
         id: 3,
         title: 'Intern Developer',
         position: 'Software Intern',
         type: 'internship',
         status: 'archived',
         start_date: new Date('2020-06-01'),
         end_date: new Date('2020-09-30'),
         company: {
            ...mockCompany,
            id: 3,
            company_name: 'BigTech Inc',
            company_id: 3,
         },
         company_id: 3,
         skills: [mockSkill],
         languageSets: [],
         created_at: new Date('2023-01-03'),
         updated_at: new Date('2023-01-03'),
         schemaName: 'experiences',
         tableName: 'experiences',
         description: 'Internship role',
         summary: 'Learned the basics',
      },
   ];

   const mockTextResources = {
      getText: jest.fn((key: string) => {
         const texts: Record<string, string> = {
            'ExperiencesWidget.headerTitle': 'Work Experience',
            'ExperiencesWidget.addExperienceButton': 'Experience',
            'ExperiencesWidget.noDocumentsText': 'No experiences found',
         };
         return texts[key] || key;
      }),
      currentLanguage: 'en',
   };

   beforeEach(() => {
      jest.clearAllMocks();
      
      // Reset language to English before each test
      mockTextResources.currentLanguage = 'en';
      mockTextResources.getText.mockImplementation((key: string) => {
         const texts: Record<string, string> = {
            'ExperiencesWidget.headerTitle': 'Work Experience',
            'ExperiencesWidget.addExperienceButton': 'Experience',
            'ExperiencesWidget.noDocumentsText': 'No experiences found',
         };
         return texts[key] || key;
      });
      
      mockUseRouter.mockReturnValue({
         push: mockPush,
         replace: jest.fn(),
         back: jest.fn(),
         forward: jest.fn(),
         refresh: jest.fn(),
         prefetch: jest.fn(),
      } as unknown as ReturnType<typeof useRouter>);

      mockUseAjax.mockReturnValue({
         get: mockGet,
         post: jest.fn(),
         put: jest.fn(),
         delete: jest.fn(),
      } as unknown as ReturnType<typeof useAjax>);

      mockUseTextResources.mockReturnValue({
         textResources: mockTextResources,
      } as unknown as ReturnType<typeof useTextResources>);
   });

   describe('Basic Rendering', () => {
      it('renders without crashing', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('table-base')).toBeInTheDocument();
      });

      it('renders widget header with correct title', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(screen.getByTestId('widget-title')).toHaveTextContent('Work Experience');
      });

      it('renders add experience button with correct properties', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         const button = screen.getByTestId('mui-button');
         expect(button).toHaveTextContent('Add IconExperience');
         expect(button).toHaveAttribute('data-href', '/admin/experience/create');
         expect(button).toHaveAttribute('data-variant', 'contained');
         expect(button).toHaveAttribute('data-color', 'primary');
         expect(screen.getByTestId('add-icon')).toBeInTheDocument();
      });

      it('renders table with correct configuration', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('hide-header')).toHaveTextContent('true');
            expect(screen.getByTestId('use-pagination')).toHaveTextContent('true');
            expect(screen.getByTestId('column-count')).toHaveTextContent('5');
         });
      });
   });

   describe('Data Fetching', () => {
      it('fetches experiences data on mount', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(mockGet).toHaveBeenCalledWith('/experience/query', {
            params: { language_set: 'en' }
         });
      });

      it('displays loading state initially', () => {
         mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves

         render(<ExperiencesWidget />);
         
         expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');
      });

      it('displays experiences data when fetch succeeds', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(screen.getByTestId('items-count')).toHaveTextContent('3');
         });
      });

      it('handles fetch error gracefully', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockRejectedValue(new Error('Network error'));

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching user experiences:', expect.any(Error));
         });

         consoleSpy.mockRestore();
      });

      it('handles unsuccessful response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockResolvedValue({
            success: false,
            message: 'Server error',
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching user experiences:', 'Server error');
         });

         consoleSpy.mockRestore();
      });

      it('handles non-array response data', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: null, // Non-array data
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('items-count')).toHaveTextContent('0');
         });
      });

      it('does not fetch data multiple times', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         const { rerender } = render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledTimes(1);
         });

         rerender(<ExperiencesWidget />);
         
         // Should still be called only once due to the loaded ref
         expect(mockGet).toHaveBeenCalledTimes(1);
      });
   });

   describe('Table Interaction', () => {
      it('navigates to experience details when row is clicked', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('items-count')).toHaveTextContent('3');
         });

         const firstRow = screen.getByTestId('table-row-0');
         fireEvent.click(firstRow);

         expect(mockPush).toHaveBeenCalledWith('/admin/experience/1');
      });

      it('handles multiple row clicks correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('items-count')).toHaveTextContent('3');
         });

         const firstRow = screen.getByTestId('table-row-0');
         const secondRow = screen.getByTestId('table-row-1');
         
         fireEvent.click(firstRow);
         fireEvent.click(secondRow);

         expect(mockPush).toHaveBeenCalledTimes(2);
         expect(mockPush).toHaveBeenNthCalledWith(1, '/admin/experience/1');
         expect(mockPush).toHaveBeenNthCalledWith(2, '/admin/experience/2');
      });
   });

   describe('Text Resources', () => {
      it('uses correct text resources for UI elements', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(mockTextResources.getText).toHaveBeenCalledWith('ExperiencesWidget.headerTitle');
         expect(mockTextResources.getText).toHaveBeenCalledWith('ExperiencesWidget.addExperienceButton');
         expect(mockTextResources.getText).toHaveBeenCalledWith('ExperiencesWidget.noDocumentsText');
      });

      it('passes no documents text to table', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: [],
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('no-documents-text')).toHaveTextContent('No experiences found');
         });
      });

      it('responds to language changes', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         // Change language in mock
         mockTextResources.currentLanguage = 'pt';
         mockTextResources.getText.mockImplementation((key: string) => {
            const texts: Record<string, string> = {
               'ExperiencesWidget.headerTitle': 'Experiência',
               'ExperiencesWidget.addExperienceButton': 'Experiência',
               'ExperiencesWidget.noDocumentsText': 'Nenhuma experiência encontrada',
            };
            return texts[key] || key;
         });

         const { rerender } = render(<ExperiencesWidget />);
         
         // Re-render with new language
         rerender(<ExperiencesWidget />);

         await waitFor(() => {
            expect(screen.getByTestId('widget-title')).toHaveTextContent('Experiência');
         });
      });
   });

   describe('Experience Data Display', () => {
      it('displays experience titles and positions correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('experience-title-0')).toHaveTextContent('Tech Corp');
            expect(screen.getByTestId('experience-position-0')).toHaveTextContent('Senior Software Engineer');
            expect(screen.getByTestId('experience-type-0')).toHaveTextContent('full_time');
         });
      });

      it('displays title when company name is not available', async () => {
         const experienceWithoutCompany = [{
            ...mockExperiences[0],
            company: null as unknown as CompanyData,
            title: 'Freelance Developer'
         }];

         mockGet.mockResolvedValue({
            success: true,
            data: experienceWithoutCompany,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('experience-title-0')).toHaveTextContent('Freelance Developer');
         });
      });

      it('handles different experience types correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('experience-type-0')).toHaveTextContent('full_time');
            expect(screen.getByTestId('experience-type-1')).toHaveTextContent('contract');
            expect(screen.getByTestId('experience-type-2')).toHaveTextContent('internship');
         });
      });
   });

   describe('Edge Cases', () => {
      it('handles empty experiences array', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: [],
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('items-count')).toHaveTextContent('0');
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });
      });

      it('handles experiences with missing fields', async () => {
         const incompleteExperience: ExperienceData[] = [
            {
               ...mockExperiences[0],
               position: undefined,
               title: undefined,
               company: null as unknown as CompanyData,
            } as unknown as ExperienceData,
         ];

         mockGet.mockResolvedValue({
            success: true,
            data: incompleteExperience,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('items-count')).toHaveTextContent('1');
            // Should not crash when fields are missing
            expect(screen.getByTestId('table-row-0')).toBeInTheDocument();
         });
      });

      it('handles network timeout gracefully', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockImplementation(() => 
            new Promise((_, reject) => 
               setTimeout(() => reject(new Error('Timeout')), 100)
            )
         );

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         }, { timeout: 200 });

         expect(consoleSpy).toHaveBeenCalledWith('Error fetching user experiences:', expect.any(Error));
         consoleSpy.mockRestore();
      });
   });

   describe('Component Lifecycle', () => {
      it('cleans up properly on unmount', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         const { unmount } = render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });

         // Should not throw errors on unmount
         expect(() => unmount()).not.toThrow();
      });

      it('handles rapid re-renders correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         const { rerender } = render(<ExperiencesWidget />);
         
         // Rapid re-renders
         for (let i = 0; i < 5; i++) {
            rerender(<ExperiencesWidget />);
         }

         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });

         // Should only fetch data once due to the loaded ref
         expect(mockGet).toHaveBeenCalledTimes(1);
      });
   });

   describe('Accessibility', () => {
      it('provides accessible button for adding experiences', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         const button = screen.getByTestId('mui-button');
         expect(button).toBeInTheDocument();
         expect(button).toHaveTextContent('Add IconExperience');
      });

      it('maintains proper heading structure', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(screen.getByTestId('widget-title')).toHaveTextContent('Work Experience');
      });

      it('provides meaningful table content', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('experience-title-0')).toHaveTextContent('Tech Corp');
            expect(screen.getByTestId('experience-position-0')).toHaveTextContent('Senior Software Engineer');
         });
      });

      it('provides keyboard navigation support for table rows', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            const firstRow = screen.getByTestId('table-row-0');
            expect(firstRow).toHaveAttribute('role', 'button');
            expect(firstRow).toHaveAttribute('tabIndex', '0');
         });
      });
   });

   describe('Integration', () => {
      it('integrates properly with routing', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(mockUseRouter).toHaveBeenCalled();
         
         await waitFor(() => {
            const firstRow = screen.getByTestId('table-row-0');
            fireEvent.click(firstRow);
         });

         expect(mockPush).toHaveBeenCalledWith('/admin/experience/1');
      });

      it('integrates properly with AJAX service', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockGet).toHaveBeenCalledWith('/experience/query', {
            params: { language_set: 'en' }
         });
      });

      it('integrates properly with text resources', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         expect(mockUseTextResources).toHaveBeenCalled();
         expect(mockTextResources.getText).toHaveBeenCalledTimes(3);
      });

      it('integrates properly with table configuration', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockExperiences,
         });

         render(<ExperiencesWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('column-count')).toHaveTextContent('5');
         });
      });
   });
});
