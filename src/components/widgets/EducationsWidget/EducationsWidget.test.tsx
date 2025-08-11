import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EducationsWidget from './EducationsWidget';
import { EducationData } from '@/types/database.types';

// Mock TextResourcesProvider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({
      textResources: {
         getText: (key: string) => {
            const texts: Record<string, string> = {
               'EducationsWidget.headerTitle': 'Educations',
               'EducationsWidget.addButton': 'Add',
               'EducationsWidget.noData': 'No educations'
            };
            return texts[key] || key;
         },
         currentLanguage: 'en'
      }
   })
}));

// Mock useAjax hook
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      get: jest.fn().mockResolvedValue({
         data: [],
         error: false,
         message: 'Success'
      }),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
   })
}));

// Mock Next.js useRouter
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn()
   })
}));

// (Legacy DataContainer / EducationTile mocks removed – component now renders a TableBase only)

// Mock WidgetHeader component
jest.mock('@/components/headers/WidgetHeader/WidgetHeader', () => {
   return function MockWidgetHeader({ title, children, ...props }: any) {
      return (
         <div data-testid="widget-header" {...props}>
            {title}
            {children}
         </div>
      );
   };
});

// Mock TableBase component
jest.mock('@/components/common/TableBase/TableBase', () => {
   return function MockTableBase({ items, columnConfig, noDocumentsText, loading, onClickRow, ...props }: any) {
      if (loading) {
         return <div data-testid="table-base" data-loading="true">Loading...</div>;
      }
      
      if (!items || items.length === 0) {
         return <div data-testid="table-base" data-no-documents="true">{noDocumentsText}</div>;
      }

      return (
         <div data-testid="table-base" {...props}>
            {items.map((item: any, index: number) => (
               <div 
                  key={item.id || index} 
                  data-testid="table-row" 
                  onClick={() => onClickRow?.(item)}
               >
                  {columnConfig[0]?.format?.(null, item) || JSON.stringify(item)}
               </div>
            ))}
         </div>
      );
   };
});

// Mock DateView component
jest.mock('@/components/common/DateView/DateView', () => {
   return function MockDateView({ date, ...props }: any) {
      const formatDate = (dateValue: any) => {
         if (!dateValue) return '---';
         if (dateValue instanceof Date) {
            return dateValue.toLocaleDateString();
         }
         if (typeof dateValue === 'string') {
            return new Date(dateValue).toLocaleDateString();
         }
         return String(dateValue);
      };
      
      return <span data-testid="date-view" {...props}>{formatDate(date)}</span>;
   };
});

// Mock RoundButton component
jest.mock('@/components/buttons/RoundButton/RoundButton', () => {
   return function MockRoundButton({ title, href, children, ...props }: any) {
      return (
         <button data-testid="round-button" data-href={href} title={title} {...props}>
            {children}
         </button>
      );
   };
});

// Mock Next.js Link
jest.mock('next/link', () => {
   return function MockLink({ href, children, ...props }: any) {
      return <a href={href} {...props}>{children}</a>;
   };
});

// Mock Material-UI icons
jest.mock('@mui/icons-material', () => ({
   Add: () => <svg data-testid="add-icon">+</svg>
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (className: string | string[], defaultClasses: string[]) => 
      [className, ...defaultClasses].flat().filter(Boolean).join(' '),
   parsePadding: (padding?: string | number) => 
      padding ? `padding-${padding}` : '',
   parseElevation: (elevation?: string | number) => 
      elevation ? `elevation-${elevation}` : '',
   parseRadius: (radius?: string | number) => 
      radius ? `radius-${radius}` : ''
}));

// Mock styles
jest.mock('./EducationsWidget.module.scss', () => ({
   EducationsWidget: 'educations-widget'
}));

describe('EducationsWidget', () => {
   const mockEducationData: EducationData[] = [
      {
         id: 1,
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'educations_schema',
         tableName: 'educations',
         education_id: 1,
         institution_name: 'Test University',
         field_of_study: 'Computer Science',
         degree: 'Bachelor of Science',
         start_date: new Date('2020-09-01'),
         end_date: new Date('2024-06-01'),
         is_current: false,
         student_id: 1,
         description: 'Test education description',
         language_set: 'en',
         user_id: 1,
         languageSets: []
      },
      {
         id: 2,
         created_at: new Date('2023-01-03'),
         updated_at: new Date('2023-01-04'),
         schemaName: 'educations_schema',
         tableName: 'educations',
         education_id: 2,
         institution_name: 'Tech Institute',
         field_of_study: 'Software Engineering',
         degree: 'Master of Science',
         start_date: new Date('2024-09-01'),
         end_date: new Date('2026-06-01'),
         is_current: true,
         student_id: 1,
         description: 'Advanced software engineering',
         language_set: 'en',
         user_id: 1,
         languageSets: []
      }
   ];

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<EducationsWidget educations={mockEducationData} />)).not.toThrow();
      });

      test('renders widget header with correct title', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         const header = screen.getByTestId('widget-header');
         expect(header).toHaveTextContent('Educations');
      });

      test('renders table rows for each education', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         const rows = screen.getAllByTestId('table-row');
         expect(rows).toHaveLength(2);
      });

      test('displays education institution and field separately', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         expect(screen.getByText('Test University')).toBeInTheDocument();
         expect(screen.getByText('Computer Science')).toBeInTheDocument();
         expect(screen.getByText('Tech Institute')).toBeInTheDocument();
         expect(screen.getByText('Software Engineering')).toBeInTheDocument();
      });
   });

   describe('Props Handling', () => {
      test('handles empty educations array', () => {
         render(<EducationsWidget educations={[]} />);
         const table = screen.getByTestId('table-base');
         expect(table).toHaveAttribute('data-no-documents', 'true');
      });

      test('handles single education', () => {
         render(<EducationsWidget educations={[mockEducationData[0]]} />);
         const educationRows = screen.getAllByTestId('table-row');
         expect(educationRows).toHaveLength(1);
      });
   });

   describe('Component Structure', () => {
      test('renders header and table', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('table-base')).toBeInTheDocument();
      });
   });

   describe('Education Data Handling', () => {
      test('renders institution and field text for each education', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         mockEducationData.forEach(ed => {
            expect(screen.getByText(ed.institution_name)).toBeInTheDocument();
            expect(screen.getByText(ed.field_of_study ?? '')).toBeInTheDocument();
         });
      });

      test('handles educations with different properties', () => {
         const diverseEducations = [
            { ...mockEducationData[0], field_of_study: 'Mathematics', institution_name: 'Math College' },
            { ...mockEducationData[1], field_of_study: 'Physics', institution_name: 'Science University' }
         ];
         render(<EducationsWidget educations={diverseEducations} />);
         expect(screen.getByText('Math College')).toBeInTheDocument();
         expect(screen.getByText('Mathematics')).toBeInTheDocument();
         expect(screen.getByText('Science University')).toBeInTheDocument();
         expect(screen.getByText('Physics')).toBeInTheDocument();
      });

      test('handles educations with missing optional fields', () => {
         const educationsWithMissingFields = [ { ...mockEducationData[0], description: undefined, location: undefined } ];
         expect(() => render(<EducationsWidget educations={educationsWithMissingFields as any} />)).not.toThrow();
      });
   });

   describe('Large Dataset Handling', () => {
      test('handles many educations efficiently', () => {
         const manyEducations = Array.from({ length: 50 }, (_, index) => ({
            ...mockEducationData[0],
            id: index + 1,
            education_id: index + 1,
            field_of_study: `Field ${index + 1}`,
            institution_name: `Institution ${index + 1}`
         }));
         render(<EducationsWidget educations={manyEducations} />);
         const rows = screen.getAllByTestId('table-row');
         expect(rows).toHaveLength(50);
      });

      test('renders first and last educations correctly in large dataset', () => {
         const manyEducations = Array.from({ length: 100 }, (_, index) => ({
            ...mockEducationData[0],
            id: index + 1,
            education_id: index + 1,
            field_of_study: `Field ${index + 1}`,
            institution_name: `Institution ${index + 1}`
         }));
         render(<EducationsWidget educations={manyEducations} />);
         expect(screen.getByText('Institution 1')).toBeInTheDocument();
         expect(screen.getByText('Field 1')).toBeInTheDocument();
         expect(screen.getByText('Institution 100')).toBeInTheDocument();
         expect(screen.getByText('Field 100')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      test('header has readable title', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         expect(screen.getByTestId('widget-header')).toHaveTextContent('Educations');
      });
      test('all rows are rendered accessibly', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         screen.getAllByTestId('table-row').forEach(row => expect(row).toBeInTheDocument());
      });
   });

   describe('Error Handling', () => {
      test('handles null educations prop gracefully', () => {
         expect(() => render(
            <EducationsWidget educations={null as any} />
         )).not.toThrow();
      });

      test('handles undefined educations prop gracefully', () => {
         expect(() => render(
            <EducationsWidget educations={undefined as any} />
         )).not.toThrow();
      });

      test('handles educations with invalid data', () => {
         const invalidEducations = [
            {
               id: null,
               field_of_study: 'Valid Field',
               institution_name: 'Valid Institution'
            }
         ];
         
         expect(() => render(
            <EducationsWidget educations={invalidEducations as any} />
         )).not.toThrow();
      });

      test('continues rendering other educations when one has errors', () => {
         const mixedEducations = [
            mockEducationData[0],
            { id: null, field_of_study: null, institution_name: null } as any,
            mockEducationData[1]
         ];
         
         render(<EducationsWidget educations={mixedEducations} />);
         
         expect(screen.getByText('Test University')).toBeInTheDocument();
         expect(screen.getByText('Computer Science')).toBeInTheDocument();
         expect(screen.getByText('Tech Institute')).toBeInTheDocument();
         expect(screen.getByText('Software Engineering')).toBeInTheDocument();
      });
   });

   describe('Performance', () => {
      test('renders efficiently with multiple re-renders', () => {
         const { rerender } = render(<EducationsWidget educations={mockEducationData} />);
         
         expect(screen.getByText('Test University')).toBeInTheDocument();
         expect(screen.getByText('Computer Science')).toBeInTheDocument();
         
         rerender(<EducationsWidget educations={mockEducationData} />);
         
         expect(screen.getByText('Test University')).toBeInTheDocument();
         expect(screen.getByText('Computer Science')).toBeInTheDocument();
      });

      test('handles rapid data changes', () => {
         const { rerender } = render(<EducationsWidget educations={mockEducationData} />);
         
         const newEducations = [
            {
               ...mockEducationData[0],
               field_of_study: 'Updated Field',
               institution_name: 'Updated Institution'
            }
         ];
         
         rerender(<EducationsWidget educations={newEducations} />);
         
         expect(screen.getByText('Updated Institution')).toBeInTheDocument();
         expect(screen.getByText('Updated Field')).toBeInTheDocument();
         expect(screen.queryByText('Test University')).not.toBeInTheDocument();
         expect(screen.queryByText('Computer Science')).not.toBeInTheDocument();
      });
   });

   describe('Integration', () => {
      test('integrates properly with WidgetHeader & TableBase', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('table-base')).toBeInTheDocument();
      });

      test('renders rows with correct data via TableBase format', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         const rows = screen.getAllByTestId('table-row');
         expect(rows).toHaveLength(2);
         expect(screen.getByText('Test University')).toBeInTheDocument();
         expect(screen.getByText('Computer Science')).toBeInTheDocument();
      });
   });

   describe('Sorting and Ordering', () => {
      test('maintains order of educations as provided', () => {
         render(<EducationsWidget educations={mockEducationData} />);
         const rows = screen.getAllByTestId('table-row');
         expect(rows).toHaveLength(2);
      });

      test('handles reverse order educations', () => {
         const reversedEducations = [...mockEducationData].reverse();
         render(<EducationsWidget educations={reversedEducations} />);
         const rows = screen.getAllByTestId('table-row');
         expect(rows).toHaveLength(2);
      });
   });
});
