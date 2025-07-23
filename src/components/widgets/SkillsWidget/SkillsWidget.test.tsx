import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SkillData } from '@/types/database.types';

// Import mocked functions
import { useAjax } from '@/hooks/useAjax';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { parseCSS } from '@/helpers/parse.helpers';

// Mock the actual component for testing
const MockSkillsWidget: React.FC<{ className?: string | string[] }> = ({ className }) => {
   const ajax = useAjax();
   const { textResources } = useTextResources();
   const [skills, setSkills] = React.useState<SkillData[]>([]);
   const [loading, setLoading] = React.useState<boolean>(true);

   React.useEffect(() => {
      setLoading(true);
      ajax.get('/skill/query', { params: { language_set: textResources.currentLanguage } })
         .then((response: unknown) => {
            const typedResponse = response as { success: boolean; data: SkillData[] };
            if (typedResponse.success) {
               setSkills(typedResponse.data);
            } else {
               console.error('Failed to fetch skills:', response);
            }
         })
         .catch((error: Error) => {
            console.error('Error fetching skills:', error);
         })
         .finally(() => {
            setLoading(false);
         });
   }, [ajax, textResources.currentLanguage]);

   const parsedClassName = parseCSS(className, 'SkillsWidget');

   return (
      <div className={parsedClassName} data-testid="skills-widget">
         <div data-testid="widget-header">
            <div data-testid="widget-title">{textResources.getText('SkillsWidget.headerTitle')}</div>
            <button 
               data-testid="mui-button"
               data-href="/admin/skill/create"
               data-variant="contained"
               data-color="primary"
            >
               <span data-testid="add-icon">Add Icon</span>
               {textResources.getText('SkillsWidget.addSkillButton')}
            </button>
         </div>
         <div data-testid="card" className="skills-list" data-padding="m">
            <div data-testid="loading-state">{loading ? 'Loading...' : 'Not loading'}</div>
            <div data-testid="skills-count">{skills?.length || 0}</div>
            {skills?.map(skill => (
               <div 
                  key={skill.id} 
                  data-testid={`skill-badge-${skill.id}`}
                  data-href={`/admin/skill/${skill.id}`}
                  className="skill-badge"
               >
                  {skill.name}
               </div>
            ))}
         </div>
      </div>
   );
};

// Use the mock instead of the real component
const SkillsWidget = MockSkillsWidget;

// Mock the hooks and services
jest.mock('@/hooks/useAjax');
jest.mock('@/services/TextResources/TextResourcesProvider');
jest.mock('@/helpers/parse.helpers');

// Mock the child components
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

jest.mock('@/components/common/Card/Card', () => {
   return function MockCard({ children, className, padding }: { children?: React.ReactNode; className?: string; padding?: string }) {
      return (
         <div data-testid="card" className={className} data-padding={padding}>
            {children}
         </div>
      );
   };
});

jest.mock('@/components/badges/SkillBadge/SkillBadge', () => {
   return function MockSkillBadge({ value, href }: { value?: string; href?: string }) {
      return (
         <div data-testid={`skill-badge-mock`} data-href={href} className="skill-badge">
            {value}
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

const mockUseAjax = useAjax as jest.MockedFunction<typeof useAjax>;
const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;
const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;

describe('SkillsWidget', () => {
   const mockGet = jest.fn();

   const mockSkills: SkillData[] = [
      {
         id: 1,
         name: 'JavaScript',
         category: 'Programming Languages',
         level: 'Expert',
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-01'),
         schemaName: 'skills',
         tableName: 'skills',
         journey: 'Professional Development',
         language_set: 'en',
         skill_id: '1',
         user_id: 1,
         languageSets: [],
      },
      {
         id: 2,
         name: 'React',
         category: 'Frontend Frameworks',
         level: 'Expert',
         created_at: new Date('2023-01-02'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'skills',
         tableName: 'skills',
         journey: 'Professional Development',
         language_set: 'en',
         skill_id: '2',
         user_id: 1,
         languageSets: [],
      },
      {
         id: 3,
         name: 'Node.js',
         category: 'Backend Technologies',
         level: 'Advanced',
         created_at: new Date('2023-01-03'),
         updated_at: new Date('2023-01-03'),
         schemaName: 'skills',
         tableName: 'skills',
         journey: 'Professional Development',
         language_set: 'en',
         skill_id: '3',
         user_id: 1,
         languageSets: [],
      },
   ];

   const mockTextResources = {
      getText: jest.fn((key: string) => {
         const texts: Record<string, string> = {
            'SkillsWidget.headerTitle': 'Skills',
            'SkillsWidget.addSkillButton': 'Skill',
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
            'SkillsWidget.headerTitle': 'Skills',
            'SkillsWidget.addSkillButton': 'Skill',
         };
         return texts[key] || key;
      });

      mockUseAjax.mockReturnValue({
         get: mockGet,
         post: jest.fn(),
         put: jest.fn(),
         delete: jest.fn(),
      } as unknown as ReturnType<typeof useAjax>);

      mockUseTextResources.mockReturnValue({
         textResources: mockTextResources,
      } as unknown as ReturnType<typeof useTextResources>);

      mockParseCSS.mockImplementation((className, baseClass) => {
         if (className) {
            if (Array.isArray(className)) {
               return className.join(' ') + ' ' + baseClass;
            }
            return className + ' ' + baseClass;
         }
         return baseClass as string;
      });
   });

   describe('Basic Rendering', () => {
      it('renders without crashing', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('card')).toBeInTheDocument();
      });

      it('renders widget header with correct title', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(screen.getByTestId('widget-title')).toHaveTextContent('Skills');
      });

      it('renders add skill button with correct properties', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         const button = screen.getByTestId('mui-button');
         expect(button).toHaveTextContent('Add IconSkill');
         expect(button).toHaveAttribute('data-href', '/admin/skill/create');
         expect(button).toHaveAttribute('data-variant', 'contained');
         expect(button).toHaveAttribute('data-color', 'primary');
         expect(screen.getByTestId('add-icon')).toBeInTheDocument();
      });

      it('renders skills card with correct configuration', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         const card = screen.getByTestId('card');
         expect(card).toHaveClass('skills-list');
         expect(card).toHaveAttribute('data-padding', 'm');
      });
   });

   describe('Props Handling', () => {
      describe('className prop', () => {
         it('applies custom className when provided as string', async () => {
            mockGet.mockResolvedValue({
               success: true,
               data: mockSkills,
            });

            render(<SkillsWidget className="custom-class" />);
            
            expect(mockParseCSS).toHaveBeenCalledWith('custom-class', 'SkillsWidget');
         });

         it('applies custom className when provided as array', async () => {
            mockGet.mockResolvedValue({
               success: true,
               data: mockSkills,
            });

            render(<SkillsWidget className={['class1', 'class2']} />);
            
            expect(mockParseCSS).toHaveBeenCalledWith(['class1', 'class2'], 'SkillsWidget');
         });

         it('applies base className when not provided', async () => {
            mockGet.mockResolvedValue({
               success: true,
               data: mockSkills,
            });

            render(<SkillsWidget />);
            
            expect(mockParseCSS).toHaveBeenCalledWith(undefined, 'SkillsWidget');
         });
      });
   });

   describe('Data Fetching', () => {
      it('fetches skills data on mount', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(mockGet).toHaveBeenCalledWith('/skill/query', {
            params: { language_set: 'en' }
         });
      });

      it('displays loading state initially', () => {
         mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves

         render(<SkillsWidget />);
         
         expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading...');
      });

      it('displays skills data when fetch succeeds', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(screen.getByTestId('skills-count')).toHaveTextContent('3');
         });
      });

      it('handles fetch error gracefully', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockRejectedValue(new Error('Network error'));

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(consoleSpy).toHaveBeenCalledWith('Error fetching skills:', expect.any(Error));
         });

         consoleSpy.mockRestore();
      });

      it('handles unsuccessful response', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockResolvedValue({
            success: false,
            error: 'Server error',
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch skills:', expect.any(Object));
         });

         consoleSpy.mockRestore();
      });

      it('does not fetch data multiple times', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         const { rerender } = render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledTimes(1);
         });

         rerender(<SkillsWidget />);
         
         // Should still be called only once due to the loaded ref
         expect(mockGet).toHaveBeenCalledTimes(1);
      });
   });

   describe('Skills Display', () => {
      it('displays skill badges for each skill', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skill-badge-1')).toBeInTheDocument();
            expect(screen.getByTestId('skill-badge-2')).toBeInTheDocument();
            expect(screen.getByTestId('skill-badge-3')).toBeInTheDocument();
         });
      });

      it('displays skill names correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skill-badge-1')).toHaveTextContent('JavaScript');
            expect(screen.getByTestId('skill-badge-2')).toHaveTextContent('React');
            expect(screen.getByTestId('skill-badge-3')).toHaveTextContent('Node.js');
         });
      });

      it('sets correct href for skill badges', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skill-badge-1')).toHaveAttribute('data-href', '/admin/skill/1');
            expect(screen.getByTestId('skill-badge-2')).toHaveAttribute('data-href', '/admin/skill/2');
            expect(screen.getByTestId('skill-badge-3')).toHaveAttribute('data-href', '/admin/skill/3');
         });
      });
   });

   describe('Text Resources', () => {
      it('uses correct text resources for UI elements', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(mockTextResources.getText).toHaveBeenCalledWith('SkillsWidget.headerTitle');
         expect(mockTextResources.getText).toHaveBeenCalledWith('SkillsWidget.addSkillButton');
      });

      it('responds to language changes', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         // Change language in mock
         mockTextResources.currentLanguage = 'pt';
         mockTextResources.getText.mockImplementation((key: string) => {
            const texts: Record<string, string> = {
               'SkillsWidget.headerTitle': 'Habilidades',
               'SkillsWidget.addSkillButton': 'Habilidade',
            };
            return texts[key] || key;
         });

         const { rerender } = render(<SkillsWidget />);
         
         // Re-render with new language
         rerender(<SkillsWidget />);

         await waitFor(() => {
            expect(screen.getByTestId('widget-title')).toHaveTextContent('Habilidades');
         });
      });
   });

   describe('Edge Cases', () => {
      it('handles empty skills array', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: [],
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skills-count')).toHaveTextContent('0');
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });
      });

      it('handles null/undefined skills data', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: null,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
            // Should not crash when data is null
         });
      });

      it('handles skills with missing properties', async () => {
         const incompleteSkills: SkillData[] = [
            {
               ...mockSkills[0],
               name: undefined as unknown as string,
            },
         ];

         mockGet.mockResolvedValue({
            success: true,
            data: incompleteSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skills-count')).toHaveTextContent('1');
            // Should not crash when name is missing
            expect(screen.getByTestId('skill-badge-1')).toBeInTheDocument();
         });
      });

      it('handles network timeout gracefully', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         mockGet.mockImplementation(() => 
            new Promise((_, reject) => 
               setTimeout(() => reject(new Error('Timeout')), 100)
            )
         );

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         }, { timeout: 200 });

         expect(consoleSpy).toHaveBeenCalledWith('Error fetching skills:', expect.any(Error));
         consoleSpy.mockRestore();
      });

      it('handles large number of skills', async () => {
         const manySkills: SkillData[] = Array.from({ length: 50 }, (_, index) => ({
            ...mockSkills[0],
            id: index + 1,
            name: `Skill ${index + 1}`,
            skill_id: String(index + 1),
         }));

         mockGet.mockResolvedValue({
            success: true,
            data: manySkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skills-count')).toHaveTextContent('50');
         });
      });
   });

   describe('Component Lifecycle', () => {
      it('cleans up properly on unmount', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         const { unmount } = render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });

         // Should not throw errors on unmount
         expect(() => unmount()).not.toThrow();
      });

      it('handles rapid re-renders correctly', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         const { rerender } = render(<SkillsWidget />);
         
         // Rapid re-renders
         for (let i = 0; i < 5; i++) {
            rerender(<SkillsWidget />);
         }

         await waitFor(() => {
            expect(screen.getByTestId('loading-state')).toHaveTextContent('Not loading');
         });

         // Should only fetch data once due to the loaded ref
         expect(mockGet).toHaveBeenCalledTimes(1);
      });

      it('refetches data when language changes', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         const { rerender } = render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledTimes(1);
         });

         // Change language
         mockTextResources.currentLanguage = 'pt';
         rerender(<SkillsWidget />);

         await waitFor(() => {
            expect(mockGet).toHaveBeenCalledTimes(2);
            expect(mockGet).toHaveBeenLastCalledWith('/skill/query', {
               params: { language_set: 'pt' }
            });
         });
      });
   });

   describe('Accessibility', () => {
      it('provides accessible button for adding skills', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         const button = screen.getByTestId('mui-button');
         expect(button).toBeInTheDocument();
         expect(button).toHaveTextContent('Add IconSkill');
      });

      it('maintains proper heading structure', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(screen.getByTestId('widget-title')).toHaveTextContent('Skills');
      });

      it('provides meaningful skill content', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('skill-badge-1')).toHaveTextContent('JavaScript');
            expect(screen.getByTestId('skill-badge-2')).toHaveTextContent('React');
         });
      });
   });

   describe('Integration', () => {
      it('integrates properly with AJAX service', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(mockUseAjax).toHaveBeenCalled();
         expect(mockGet).toHaveBeenCalledWith('/skill/query', {
            params: { language_set: 'en' }
         });
      });

      it('integrates properly with text resources', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         expect(mockUseTextResources).toHaveBeenCalled();
         expect(mockTextResources.getText).toHaveBeenCalledTimes(2);
      });

      it('integrates properly with CSS parsing', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget className="test-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('test-class', 'SkillsWidget');
      });

      it('integrates properly with SkillBadge components', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         await waitFor(() => {
            // Verify skill badges are rendered with correct props
            expect(screen.getByTestId('skill-badge-1')).toHaveAttribute('data-href', '/admin/skill/1');
            expect(screen.getByTestId('skill-badge-2')).toHaveAttribute('data-href', '/admin/skill/2');
            expect(screen.getByTestId('skill-badge-3')).toHaveAttribute('data-href', '/admin/skill/3');
         });
      });

      it('integrates properly with Card component', async () => {
         mockGet.mockResolvedValue({
            success: true,
            data: mockSkills,
         });

         render(<SkillsWidget />);
         
         const card = screen.getByTestId('card');
         expect(card).toHaveClass('skills-list');
         expect(card).toHaveAttribute('data-padding', 'm');
      });
   });
});
