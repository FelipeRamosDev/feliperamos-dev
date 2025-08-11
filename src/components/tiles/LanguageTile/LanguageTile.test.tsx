import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageTile from './LanguageTile';
import { LanguageData } from '@/types/database.types';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: mockPush
   })
}));

// Mock TextResourcesProvider
const mockTextResources = {
   currentLanguage: 'en',
   getText: jest.fn((key: string) => {
      if (key.includes('proficiency')) return 'Advanced';
      return key;
   })
};

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({
      textResources: mockTextResources
   }),
   TextResourcesProvider: ({ children }: any) => children
}));

// Mock displayProficiency helper
jest.mock('@/helpers/app.helpers', () => ({
   displayProficiency: (level: string) => {
      if (!level || level === null || level === undefined) return '';
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      return capitalize(level);
   }
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: (className: string | string[], defaultClasses: string[]) => 
      [className, ...defaultClasses].flat().filter(Boolean).join(' ')
}));

// Mock styles
jest.mock('./LanguageTile.module.scss', () => ({
   LanguageTile: 'language-tile',
   languageName: 'language-name',
   languageLevel: 'language-level'
}));

describe('LanguageTile', () => {
   const mockLanguageData: LanguageData = {
      id: 1,
      created_at: new Date('2023-01-01'),
      updated_at: new Date('2023-01-02'),
      schemaName: 'languages_schema',
      tableName: 'languages',
      default_name: 'Spanish',
      locale_name: 'Spanish',
      locale_code: 'es',
      proficiency: 'advanced'
   };

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', () => {
         expect(() => render(
            <LanguageTile language={mockLanguageData} />
         )).not.toThrow();
      });

      test('renders language name correctly', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
      });

      test('renders proficiency level', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Advanced')).toBeInTheDocument();
      });

      test('renders with proper CSS classes', () => {
         render(<LanguageTile language={mockLanguageData} className="custom-class" />);
         
         const tile = screen.getByText('Spanish').closest('div');
         expect(tile).toHaveClass('custom-class language-tile LanguageTile');
      });

      test('applies correct styling classes', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         const languageName = screen.getByText('Spanish');
         const proficiencyLevel = screen.getByText('Advanced');
         
         expect(languageName).toHaveClass('language-name');
         expect(proficiencyLevel).toHaveClass('language-level');
      });
   });

   describe('Navigation', () => {
      test('navigates to language details on click', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         const tile = screen.getByText('Spanish').closest('div');
         fireEvent.click(tile!);
         
         expect(mockPush).toHaveBeenCalledWith('/admin/language/1');
      });

      test('navigates with correct language ID', () => {
         const languageWithDifferentId = { ...mockLanguageData, id: 42 };
         render(<LanguageTile language={languageWithDifferentId} />);
         
         const tile = screen.getByText('Spanish').closest('div');
         fireEvent.click(tile!);
         
         expect(mockPush).toHaveBeenCalledWith('/admin/language/42');
      });
   });

   describe('Props Handling', () => {
      test('handles array className prop', () => {
         render(<LanguageTile language={mockLanguageData} className={['class1', 'class2']} />);
         
         const tile = screen.getByText('Spanish').closest('div');
         expect(tile).toHaveClass('class1');
         expect(tile).toHaveClass('class2');
         expect(tile).toHaveClass('LanguageTile');
         expect(tile).toHaveClass('language-tile');
      });

      test('handles missing optional props', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
      });

      test('handles different language data', () => {
         const differentLanguage = {
            ...mockLanguageData,
            default_name: 'French',
            proficiency: 'intermediate' as const
         };
         
         render(<LanguageTile language={differentLanguage} />);
         
         expect(screen.getByText('French')).toBeInTheDocument();
         expect(screen.getByText('Intermediate')).toBeInTheDocument();
      });

      test('handles missing certification', () => {
         const languageWithoutCert = {
            ...mockLanguageData,
            certification: ''
         };
         
         render(<LanguageTile language={languageWithoutCert} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
         expect(screen.getByText('Advanced')).toBeInTheDocument();
      });
   });

   describe('Component Structure', () => {
      test('has correct component hierarchy', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         const tile = screen.getByText('Spanish').closest('div');
         const languageName = screen.getByText('Spanish');
         const proficiencyLevel = screen.getByText('Advanced');
         
         expect(tile).toContainElement(languageName);
         expect(tile).toContainElement(proficiencyLevel);
      });

      test('applies correct CSS module classes', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         const languageName = screen.getByText('Spanish');
         const proficiencyLevel = screen.getByText('Advanced');
         
         expect(languageName).toHaveClass('language-name');
         expect(proficiencyLevel).toHaveClass('language-level');
      });
   });

   describe('Accessibility', () => {
      test('tile is clickable', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         const tile = screen.getByText('Spanish').closest('div');
         expect(tile).toBeInTheDocument();
         
         fireEvent.click(tile!);
         expect(mockPush).toHaveBeenCalled();
      });

      test('displays meaningful content', () => {
         render(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
         expect(screen.getByText('Advanced')).toBeInTheDocument();
      });
   });

   describe('Error Handling', () => {
      test('handles missing language_name', () => {
         const languageMissingName = {
            ...mockLanguageData,
            default_name: ''
         };
         
         render(<LanguageTile language={languageMissingName} />);
         
         const tile = screen.getByText('Advanced').closest('div');
         const nameSpan = tile?.querySelector('.language-name');
         expect(nameSpan).toBeInTheDocument();
         expect(nameSpan).toHaveTextContent('');
      });

      test('handles missing proficiency_level', () => {
         const languageMissingLevel = {
            ...mockLanguageData,
            proficiency: 'beginner' as const
         };
         
         render(<LanguageTile language={languageMissingLevel} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
      });

      test('handles null values gracefully', () => {
         const languageWithNulls = {
            ...mockLanguageData,
            default_name: null,
            proficiency: null
         };
         
         expect(() => render(
            <LanguageTile language={languageWithNulls as any} />
         )).not.toThrow();
      });
   });

   describe('Different Proficiency Levels', () => {
      const proficiencyLevels: Array<{ value: 'beginner' | 'intermediate' | 'advanced' | 'proficient' | 'native', expected: string }> = [
         { value: 'beginner', expected: 'Beginner' },
         { value: 'intermediate', expected: 'Intermediate' },
         { value: 'advanced', expected: 'Advanced' },
         { value: 'proficient', expected: 'Proficient' },
         { value: 'native', expected: 'Native' }
      ];
      
      proficiencyLevels.forEach(({ value, expected }) => {
         test(`renders ${value} proficiency level`, () => {
            const languageWithLevel = {
               ...mockLanguageData,
               proficiency: value
            };
            
            render(<LanguageTile language={languageWithLevel} />);
            
            expect(screen.getByText(expected)).toBeInTheDocument();
         });
      });
   });

   describe('Performance', () => {
      test('renders efficiently', () => {
         const { rerender } = render(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
         
         rerender(<LanguageTile language={mockLanguageData} />);
         
         expect(screen.getByText('Spanish')).toBeInTheDocument();
      });

      test('handles rapid prop changes', () => {
         const { rerender } = render(<LanguageTile language={mockLanguageData} />);
         
         const newLanguage = { ...mockLanguageData, default_name: 'German' };
         rerender(<LanguageTile language={newLanguage} />);
         
         expect(screen.getByText('German')).toBeInTheDocument();
         expect(screen.queryByText('Spanish')).not.toBeInTheDocument();
      });
   });
});
