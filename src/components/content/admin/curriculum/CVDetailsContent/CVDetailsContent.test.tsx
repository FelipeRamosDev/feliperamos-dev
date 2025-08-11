// Mock next/navigation useRouter to prevent invariant error
jest.mock('next/navigation', () => ({
   useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
      events: {
         on: jest.fn(),
         off: jest.fn(),
         emit: jest.fn()
      },
      isFallback: false
   })
}));

// Mock CVDetailsForm to avoid undefined errors and Next.js router issues
jest.mock('@/components/forms/curriculums/EditCVInfosForm/EditCVInfosForm', () => ({
   __esModule: true,
   default: () => <div data-testid="cv-details-form">Mock CVDetailsForm</div>
}));

// Mock CVDetailsInfos to prevent invalid element type error
jest.mock('./subcomponents/CVDetailsInfos', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="cv-details-infos">
      Mock CVDetailsInfos
      <div data-testid="cv-details-form">Mock CVDetailsForm</div>
    </div>
  )
}));

// Mock CVDetailsSet to prevent invalid element type error
jest.mock('./subcomponents/CVDetailsSets', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-details-set">Mock CVDetailsSet</div>
}));

// Mock CVExperiences to prevent invalid element type error
jest.mock('./subcomponents/CVExperiences', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-experiences">Mock CVExperiences</div>
}));

// Mock CVDetailsSidebar to prevent invalid element type error
jest.mock('./subcomponents/CVDetailsSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-details-sidebar">Mock CVDetailsSidebar</div>
}));

// Mock CVEducations to prevent invalid element type error
jest.mock('./subcomponents/CVEducations', () => ({
  __esModule: true,
  default: () => <div data-testid="cv-educations">Mock CVEducations</div>
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CVDetailsContent from './CVDetailsContent';
import { CVData } from '@/types/database.types';

jest.mock('@/components/headers', () => ({
   PageHeader: ({ title, description }: { title: string; description: string }) => (
      <div data-testid="page-header">
         <h1 data-testid="page-title">{title}</h1>
         <p data-testid="page-description">{description}</p>
      </div>
   )
}));

jest.mock('@/components/common', () => ({
   Container: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="container">{children}</div>
   )
}));

jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: () => ({
      textResources: {
         getText: (key: string) => {
            switch (key) {
               case 'CVDetailsContent.pageTitle':
                  return 'CV Details';
               case 'CVDetailsContent.pageDescription':
                  return 'View and edit your curriculum details.';
               default:
                  return 'Default Text';
            }
         }
      }
   })
}));

jest.mock('./CVDetailsContent.text', () => ({
   default: {
      getText: jest.fn(),
      create: jest.fn()
   }
}));

const mockCV: CVData = {
   id: 1,
   title: 'Test CV',
   is_master: true,
   languageSets: [],
   language_set: 'en',
   user_id: 1,
   cv_owner_id: 1,
   cv_id: 1,
   created_at: new Date('2024-01-01T00:00:00.000Z'),
   schemaName: 'cv_schema',
   tableName: 'cv_table'
   // Add other required CVData fields here as needed
};

describe('CVDetailsContent', () => {
   it('renders without crashing', () => {
      expect(() => {
         render(<CVDetailsContent cv={mockCV} />);
      }).not.toThrow();
   });

   it('renders page header with correct title and description', () => {
      render(<CVDetailsContent cv={mockCV} />);
      expect(screen.getByTestId('page-header')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toHaveTextContent('CV Details');
      expect(screen.getByTestId('page-description')).toHaveTextContent('View and edit your curriculum details.');
   });

   it('renders container and form', () => {
      render(<CVDetailsContent cv={mockCV} />);
      expect(screen.getByTestId('container')).toBeInTheDocument();
      expect(screen.getByTestId('cv-details-form')).toBeInTheDocument();
   });
});
