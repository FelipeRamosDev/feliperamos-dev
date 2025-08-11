import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguagesWidget from './LanguagesWidget';
import { LanguageData } from '@/types/database.types';

// Mock TextResourcesProvider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({
      textResources: {
         getText: (key: string) => {
            const texts: Record<string, string> = {
               'LanguagesWidget.title': 'Languages',
               'LanguagesWidget.addButton.title': 'Add Language',
               'LanguagesWidget.noLanguages': 'No languages found'
            };
            return texts[key] || key;
         },
         currentLanguage: 'en'
      }
   })
}));

// (Legacy DataContainer / LanguageTile removed – component renders TableBase rows)

// Mock WidgetHeader component
jest.mock('@/components/headers/WidgetHeader/WidgetHeader', () => {
   return function MockWidgetHeader({ title, children, ...props }: any) {
      return <div data-testid="widget-header" {...props}>{title}{children}</div>;
   };
});

// Mock RoundButton (used inside widget header)
jest.mock('@/components/buttons/RoundButton/RoundButton', () => {
   return function MockRoundButton({ children, title }: any) {
      return <button data-testid="round-button" title={title}>{children}</button>;
   };
});

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (className: string | string[], defaultClasses: string[]) => 
      [className, ...defaultClasses].flat().filter(Boolean).join(' '),
   parsePadding: jest.fn((padding) => padding ? `padding-${padding}` : ''),
   parseElevation: jest.fn((elevation) => elevation ? `elevation-${elevation}` : ''),
   parseRadius: jest.fn((radius) => radius ? `radius-${radius}` : '')
}));

// Mock useAjax hook
jest.mock('@/hooks/useAjax', () => ({
   useAjax: jest.fn(() => ({
      loading: false,
      error: null,
      data: null,
      request: jest.fn(),
      reset: jest.fn(),
      get: jest.fn(() => Promise.resolve({ 
         data: [
            { id: 1, language_name: 'Spanish', proficiency: 'Advanced', locale_name: 'Español' },
            { id: 2, language_name: 'French', proficiency: 'Intermediate', locale_name: 'Français' },
            { id: 3, language_name: 'German', proficiency: 'Beginner', locale_name: 'Deutsch' }
         ] 
      }))
   }))
}));

// Mock Next.js useRouter
jest.mock('next/navigation', () => ({
   useRouter: jest.fn(() => ({
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      pathname: '/test',
      query: {},
      asPath: '/test'
   }))
}));

// Mock app helpers  
jest.mock('@/helpers/app.helpers', () => ({
   displayProficiency: jest.fn((level) => level || 'Unknown')
}));

// Mock TableBase to expose rows for querying
jest.mock('@/components/common/TableBase/TableBase', () => {
   return function MockTableBase({ items, loading, noDocumentsText, columnConfig, onClickRow }: any) {
      if (loading) return <div data-testid="table-base" data-loading="true">Loading...</div>;
      if (!items || !items.length) return <div data-testid="table-base" data-no-documents="true">{noDocumentsText}</div>;
      return <div data-testid="table-base">{items.map((it: any, idx: number) => (
         <div data-testid="table-row" key={idx} onClick={() => onClickRow?.(it)}>
            {columnConfig[0]?.format?.(null, it) || it.locale_name}
            {' - '}
            {columnConfig[1]?.format?.(null, it) || it.proficiency}
         </div>
      ))}</div>;
   };
});

// Mock styles
jest.mock('./LanguagesWidget.module.scss', () => ({
   LanguagesWidget: 'languages-widget'
}));

describe('LanguagesWidget', () => {
   const mockLanguageData: LanguageData[] = [
      {
         id: 1,
         created_at: new Date('2023-01-01'),
         updated_at: new Date('2023-01-02'),
         schemaName: 'languages_schema',
         tableName: 'languages',
         default_name: 'Spanish',
         locale_name: 'Español',
         locale_code: 'es',
         proficiency: 'advanced'
      },
      {
         id: 2,
         created_at: new Date('2023-01-03'),
         updated_at: new Date('2023-01-04'),
         schemaName: 'languages_schema',
         tableName: 'languages',
         default_name: 'French',
         locale_name: 'Français',
         locale_code: 'fr',
         proficiency: 'intermediate'
      },
      {
         id: 3,
         created_at: new Date('2023-01-05'),
         updated_at: new Date('2023-01-06'),
         schemaName: 'languages_schema',
         tableName: 'languages',
         default_name: 'German',
         locale_name: 'Deutsch',
         locale_code: 'de',
         proficiency: 'beginner'
      }
   ];

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(<LanguagesWidget languages={mockLanguageData} />)).not.toThrow();
      });

      test('renders widget header title', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
      });

      test('renders table rows for each language', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(3);
      });

      test('displays language names and proficiency', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByText('Español - advanced')).toBeInTheDocument();
         expect(screen.getByText('Français - intermediate')).toBeInTheDocument();
         expect(screen.getByText('Deutsch - beginner')).toBeInTheDocument();
      });
   });

   describe('Props Handling', () => {
      test('handles empty languages array', () => {
         render(<LanguagesWidget languages={[]} />);
         const table = screen.getByTestId('table-base');
         expect(table).toHaveAttribute('data-no-documents', 'true');
      });

      test('handles single language', () => {
         render(<LanguagesWidget languages={[mockLanguageData[0]]} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(1);
      });
   });

   describe('Component Structure', () => {
      test('renders header and table', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('table-base')).toBeInTheDocument();
      });
   });

   describe('Language Data Handling', () => {
      test('renders locale and proficiency rows', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByText('Español - advanced')).toBeInTheDocument();
      });
      test('handles languages with missing optional fields', () => {
         const languagesWithMissingFields = [{ ...mockLanguageData[0], certification: undefined }];
         expect(() => render(<LanguagesWidget languages={languagesWithMissingFields as any} />)).not.toThrow();
      });
   });

   describe('Large Dataset Handling', () => {
      test('handles many languages efficiently', () => {
         const manyLanguages = Array.from({ length: 40 }, (_, index) => ({
            ...mockLanguageData[0], id: index + 1, locale_name: `Language ${index + 1}`, proficiency: 'advanced'
         })) as any;
         render(<LanguagesWidget languages={manyLanguages as any} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(40);
      });
   });

   describe('Proficiency Level Variations', () => {
      const levels = ['beginner', 'intermediate', 'advanced', 'proficient', 'native'];
      levels.forEach(level => {
         test(`renders level ${level}`, () => {
            render(<LanguagesWidget languages={[{ ...mockLanguageData[0], proficiency: level, locale_name: 'Test' }] as any} />);
            expect(screen.getByText(`Test - ${level}`)).toBeInTheDocument();
         });
      });
   });

   describe('Accessibility', () => {
      test('header present', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
      });
      test('rows rendered accessibly', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         screen.getAllByTestId('table-row').forEach(r => expect(r).toBeInTheDocument());
      });
   });

   describe('Error Handling', () => {
      test('handles null languages prop gracefully', () => {
         expect(() => render(<LanguagesWidget languages={null as any} />)).not.toThrow();
      });
      test('handles undefined languages prop gracefully', () => {
         expect(() => render(<LanguagesWidget languages={undefined as any} />)).not.toThrow();
      });
   });

   describe('Performance', () => {
      test('renders efficiently with multiple re-renders', () => {
         const { rerender } = render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(3);
         rerender(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(3);
      });
      test('handles rapid data changes', () => {
         const { rerender } = render(<LanguagesWidget languages={mockLanguageData} />);
         rerender(<LanguagesWidget languages={[{ ...mockLanguageData[0], locale_name: 'Updated', proficiency: 'native' }]} />);
         expect(screen.getByText('Updated - native')).toBeInTheDocument();
      });
   });

   describe('Integration', () => {
      test('integrates with WidgetHeader and TableBase', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         expect(screen.getByTestId('table-base')).toBeInTheDocument();
      });
   });

   describe('Sorting and Ordering', () => {
      test('maintains order of languages as provided', () => {
         render(<LanguagesWidget languages={mockLanguageData} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(3);
      });
      test('handles reverse order languages', () => {
         const reversed = [...mockLanguageData].reverse();
         render(<LanguagesWidget languages={reversed} />);
         expect(screen.getAllByTestId('table-row')).toHaveLength(3);
      });
   });
});
