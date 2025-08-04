import { render, screen, fireEvent } from '@testing-library/react';
import CVTile from './CVTile';
import { CVData } from '@/types/database.types';

// Mock the Card component
jest.mock('@/components/common', () => ({
   Card: ({ children, className, padding, onClick, elevation, ...props }: any) => (
      <div
         data-testid="card"
         className={className}
         data-padding={padding}
         data-elevation={elevation}
         onClick={onClick}
         {...props}
      >
         {children}
      </div>
   )
}));

// Mock Material-UI Icons
jest.mock('@mui/icons-material', () => ({
   InsertDriveFile: ({ className, fontSize }: any) => (
      <svg 
         data-testid="InsertDriveFileIcon" 
         className={className}
         data-font-size={fontSize}
      >
         File Icon
      </svg>
   )
}));

// Mock parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn((className, defaultClasses) => {
      if (Array.isArray(className)) {
         return [...defaultClasses, ...className].join(' ');
      } else if (className) {
         return [...defaultClasses, className].join(' ');
      }
      return defaultClasses.join(' ');
   })
}));

// Mock SCSS modules
jest.mock('./CVTile.module.scss', () => ({
   CVTile: 'CVTile',
   cardHeader: 'cardHeader',
   cvIconWrap: 'cvIconWrap',
   cvIcon: 'cvIcon',
   cvDetails: 'cvDetails',
   subTitle: 'subTitle',
   cardBody: 'cardBody'
}));

const mockCVData: CVData = {
   id: 1,
   title: 'Test CV',
   job_title: 'Fullstack Developer',
   summary: 'This is a test summary for the CV that shows the candidate skills and experience.',
   user: {
      id: 1,
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com'
   },
   is_master: true,
   created_at: new Date('2023-01-01T00:00:00Z'),
   updated_at: new Date('2023-01-01T00:00:00Z'),
   cv_skills: [],
   cv_experiences: [],
   languageSets: [],
   cv_owner_id: 1,
   language_set: 'en',
   user_id: 1,
   cv_id: 1,
   schemaName: 'curriculums_schema',
   tableName: 'cvs'
};

describe('CVTile', () => {
   const mockOnClick = jest.fn();

   beforeEach(() => {
      jest.clearAllMocks();
   });

   it('renders CV tile with all content', () => {
      render(<CVTile cv={mockCVData} onClick={mockOnClick} />);

      // Check for main card
      const cards = screen.getAllByTestId('card');
      expect(cards).toHaveLength(2); // Main card and body card

      // Check for CV icon
      expect(screen.getByTestId('InsertDriveFileIcon')).toBeInTheDocument();

      // Check for CV details
      expect(screen.getByText('Test CV')).toBeInTheDocument();
      expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
      
      // Check for summary
      expect(screen.getByText('This is a test summary for the CV that shows the candidate skills and experience.')).toBeInTheDocument();
   });

   it('truncates long summary text', () => {
      const longSummary = 'A'.repeat(250);
      const cvWithLongSummary = {
         ...mockCVData,
         summary: longSummary
      };

      render(<CVTile cv={cvWithLongSummary} onClick={mockOnClick} />);

      const expectedTruncated = `${'A'.repeat(200)}...`;
      expect(screen.getByText(expectedTruncated)).toBeInTheDocument();
   });

   it('handles CV with no summary', () => {
      const cvWithoutSummary = {
         ...mockCVData,
         summary: undefined
      };

      render(<CVTile cv={cvWithoutSummary} onClick={mockOnClick} />);

      // Should render without crashing
      expect(screen.getByText('Test CV')).toBeInTheDocument();
      expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
   });

   it('handles CV with empty summary', () => {
      const cvWithEmptySummary = {
         ...mockCVData,
         summary: ''
      };

      render(<CVTile cv={cvWithEmptySummary} onClick={mockOnClick} />);

      // Should render without crashing
      expect(screen.getByText('Test CV')).toBeInTheDocument();
      expect(screen.getByText('Fullstack Developer')).toBeInTheDocument();
   });

   it('calls onClick with CV id when clicked', () => {
      render(<CVTile cv={mockCVData} onClick={mockOnClick} />);

      const mainCard = screen.getAllByTestId('card')[0];
      fireEvent.click(mainCard);

      expect(mockOnClick).toHaveBeenCalledWith(1);
   });

   it('handles missing onClick prop gracefully', () => {
      expect(() => render(<CVTile cv={mockCVData} />)).not.toThrow();
      
      const mainCard = screen.getAllByTestId('card')[0];
      expect(() => fireEvent.click(mainCard)).not.toThrow();
   });

   it('applies custom className', () => {
      render(<CVTile cv={mockCVData} className="custom-class" onClick={mockOnClick} />);

      const mainCard = screen.getAllByTestId('card')[0];
      expect(mainCard).toHaveClass('CVTile custom-class');
   });

   it('applies custom className array', () => {
      render(<CVTile cv={mockCVData} className={['class1', 'class2']} onClick={mockOnClick} />);

      const mainCard = screen.getAllByTestId('card')[0];
      expect(mainCard).toHaveClass('CVTile class1 class2');
   });

   it('renders with correct Card props', () => {
      render(<CVTile cv={mockCVData} onClick={mockOnClick} />);

      const mainCard = screen.getAllByTestId('card')[0];
      const bodyCard = screen.getAllByTestId('card')[1];

      expect(mainCard).toHaveAttribute('data-padding', 's');
      expect(bodyCard).toHaveAttribute('data-elevation', 'none');
   });

   it('renders icon with correct props', () => {
      render(<CVTile cv={mockCVData} onClick={mockOnClick} />);

      const icon = screen.getByTestId('InsertDriveFileIcon');
      expect(icon).toHaveClass('cvIcon');
      expect(icon).toHaveAttribute('data-font-size', 'large');
   });

   it('returns null when cv is null', () => {
      const { container } = render(<CVTile cv={null as any} onClick={mockOnClick} />);
      expect(container.firstChild).toBeNull();
   });

   it('returns null when cv is undefined', () => {
      const { container } = render(<CVTile cv={undefined as any} onClick={mockOnClick} />);
      expect(container.firstChild).toBeNull();
   });

   it('renders proper HTML structure', () => {
      render(<CVTile cv={mockCVData} onClick={mockOnClick} />);

      // Check for proper heading structure
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Test CV');

      // Check for paragraphs
      const paragraphs = screen.getAllByText((content, element) => element?.tagName.toLowerCase() === 'p');
      expect(paragraphs.length).toBeGreaterThanOrEqual(2);
   });
});
