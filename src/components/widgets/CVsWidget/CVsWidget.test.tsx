import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CVsWidget from './CVsWidget';
import { CVData } from '@/types/database.types';

// Mock Next.js components
jest.mock('next/link', () => {
   return function MockLink({ children, href, ...props }: any) {
      return <a href={href} {...props}>{children}</a>;
   };
});

jest.mock('next/navigation', () => ({
   useRouter: jest.fn(() => ({
      push: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/'
   }))
}));

// Mock Material-UI Icons
jest.mock('@mui/icons-material', () => ({
   Add: () => <span data-testid="add-icon">Add</span>
}));

// Mock useAjax hook
const mockAjaxGet = jest.fn();
jest.mock('@/hooks/useAjax', () => ({
   useAjax: () => ({
      get: mockAjaxGet
   })
}));

// Mock TextResources
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({
      textResources: {
         getText: (key: string) => {
            const texts: Record<string, string> = {
               'CVsWidget.title': 'My CVs',
               'CVsWidget.addCVButton': 'Add CV',
               'CVsWidget.noCV': 'No CVs available'
            };
            return texts[key] || key;
         },
         currentLanguage: 'en'
      }
   })
}));

// Mock other components
jest.mock('@/components/headers', () => ({
   WidgetHeader: ({ children, title }: any) => (
      <div data-testid="widget-header">
         <h2>{title}</h2>
         {children}
      </div>
   )
}));

jest.mock('@/components/buttons', () => ({
   RoundButton: ({ children, title, href }: any) => (
      <a href={href} title={title} data-testid="round-button">
         {children}
      </a>
   )
}));

jest.mock('@/components/common', () => ({
   Card: ({ children, className, ...props }: any) => (
      <div data-testid="card" className={className} {...props}>
         {children}
      </div>
   ),
   Spinner: () => <div data-testid="spinner">Loading...</div>
}));

jest.mock('@/components/tiles', () => ({
   CVTile: ({ cv, onClick }: any) => (
      <div 
         data-testid={`cv-tile-${cv.id}`}
         onClick={() => onClick(cv.id)}
      >
         {cv.title}
      </div>
   )
}));

describe('CVsWidget', () => {
   const mockCVData: CVData[] = [
      {
         id: 1,
         title: 'Software Engineer CV',
         experience_time: 5,
         is_master: true,
         notes: 'Updated CV',
         cv_owner_id: 1,
         created_at: new Date('2024-01-01'),
         schemaName: 'curriculums_schema',
         tableName: 'curriculums',
         languageSets: [],
         user_id: 1,
         cv_id: 1,
         language_set: 'en'
      },
      {
         id: 2,
         title: 'Frontend Developer CV',
         experience_time: 3,
         is_master: false,
         cv_owner_id: 1,
         created_at: new Date('2024-02-01'),
         schemaName: 'curriculums_schema',
         tableName: 'curriculums',
         languageSets: [],
         user_id: 1,
         cv_id: 2,
         language_set: 'en'
      }
   ];

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('Basic Rendering', () => {
      test('renders without crashing', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: []
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('widget-header')).toBeInTheDocument();
         });
      });

      test('renders with custom className', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: []
         });

         const { container } = render(<CVsWidget className="custom-class" />);
         
         await waitFor(() => {
            expect(container.firstChild).toHaveClass('custom-class');
         });
      });
   });

   describe('Data Loading', () => {
      test('shows loading spinner initially', () => {
         mockAjaxGet.mockImplementation(() => new Promise(() => {})); // Never resolves
         
         render(<CVsWidget />);
         
         expect(screen.getByTestId('spinner')).toBeInTheDocument();
      });

      test('loads and displays CVs successfully', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: mockCVData
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            expect(screen.getByTestId('cv-tile-1')).toBeInTheDocument();
            expect(screen.getByTestId('cv-tile-2')).toBeInTheDocument();
         });

         expect(screen.getByText('Software Engineer CV')).toBeInTheDocument();
         expect(screen.getByText('Frontend Developer CV')).toBeInTheDocument();
      });

      test('shows no CVs message when empty', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: []
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            expect(screen.getByText('No CVs available')).toBeInTheDocument();
         });
      });

      test('handles API error gracefully', async () => {
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
         
         mockAjaxGet.mockResolvedValue({
            success: false,
            message: 'API Error'
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch CVs:', expect.any(Object));
         });

         consoleSpy.mockRestore();
      });
   });

   describe('UI Components', () => {
      test('renders widget header with title', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: []
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            expect(screen.getByText('My CVs')).toBeInTheDocument();
         });
      });

      test('renders add CV button', async () => {
         mockAjaxGet.mockResolvedValue({
            success: true,
            data: []
         });

         render(<CVsWidget />);
         
         await waitFor(() => {
            const addButton = screen.getByTestId('round-button');
            expect(addButton).toBeInTheDocument();
            expect(addButton).toHaveAttribute('href', '/admin/curriculum/create');
         });
      });
   });
});
