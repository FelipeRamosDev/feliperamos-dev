import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeader from './PageHeader';
import { PageHeaderProps } from './PageHeader.types';

// Mock the Container component
jest.mock('@/components/common', () => ({
   Container: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="container">{children}</div>
   )
}));

describe('PageHeader', () => {
   const defaultProps: PageHeaderProps = {
      title: 'Test Page Title'
   };

   // Basic Rendering Tests
   describe('Basic Rendering', () => {
      it('should render without crashing', () => {
         render(<PageHeader {...defaultProps} />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });

      it('should render with correct class name', () => {
         const { container } = render(<PageHeader {...defaultProps} />);
         expect(container.firstChild).toHaveClass('PageHeader');
      });

      it('should render the Container component', () => {
         render(<PageHeader {...defaultProps} />);
         expect(screen.getByTestId('container')).toBeInTheDocument();
      });
   });

   // Title Tests
   describe('Title Rendering', () => {
      it('should render the title as h1 element', () => {
         render(<PageHeader {...defaultProps} />);
         const titleElement = screen.getByRole('heading', { level: 1 });
         expect(titleElement).toBeInTheDocument();
         expect(titleElement).toHaveTextContent('Test Page Title');
      });

      it('should render title with correct class name', () => {
         render(<PageHeader {...defaultProps} />);
         const titleElement = screen.getByRole('heading', { level: 1 });
         expect(titleElement).toHaveClass('header-title');
      });

      it('should render different title text', () => {
         const customTitle = 'Custom Header Title';
         render(<PageHeader title={customTitle} />);
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(customTitle);
      });

      it('should handle empty title', () => {
         render(<PageHeader title="" />);
         const titleElement = screen.getByRole('heading', { level: 1 });
         expect(titleElement).toBeInTheDocument();
         expect(titleElement).toHaveTextContent('');
      });

      it('should handle title with special characters', () => {
         const specialTitle = 'Title with "quotes" & symbols!';
         render(<PageHeader title={specialTitle} />);
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(specialTitle);
      });
   });

   // Description Tests
   describe('Description Rendering', () => {
      it('should render description when provided', () => {
         const description = 'This is a test description';
         render(<PageHeader title="Test Title" description={description} />);
         
         const descriptionElement = screen.getByText(description);
         expect(descriptionElement).toBeInTheDocument();
         expect(descriptionElement.tagName).toBe('P');
         expect(descriptionElement).toHaveClass('header-description');
      });

      it('should not render description when not provided', () => {
         render(<PageHeader {...defaultProps} />);
         
         const descriptionElement = screen.queryByText(/description/i);
         expect(descriptionElement).not.toBeInTheDocument();
      });

      it('should not render description when empty string is provided', () => {
         render(<PageHeader title="Test Title" description="" />);
         
         // Since the component checks for truthiness, empty string should not render
         const paragraphElements = screen.queryAllByRole('paragraph');
         expect(paragraphElements).toHaveLength(0);
      });

      it('should render description with correct class name', () => {
         const description = 'Test description content';
         render(<PageHeader title="Test Title" description={description} />);
         
         const descriptionElement = screen.getByText(description);
         expect(descriptionElement).toHaveClass('header-description');
      });

      it('should handle long description text', () => {
         const longDescription = 'This is a very long description that contains multiple sentences and should be handled properly by the component. It includes various punctuation marks and should maintain proper formatting.';
         render(<PageHeader title="Test Title" description={longDescription} />);
         
         expect(screen.getByText(longDescription)).toBeInTheDocument();
      });

      it('should handle description with HTML-like content as text', () => {
         const htmlDescription = '<script>alert("test")</script>This is safe text';
         render(<PageHeader title="Test Title" description={htmlDescription} />);
         
         // Should render as text, not as HTML
         expect(screen.getByText(htmlDescription)).toBeInTheDocument();
      });
   });

   // Props Validation Tests
   describe('Props Handling', () => {
      it('should handle both title and description props', () => {
         const props = {
            title: 'Complete Header',
            description: 'Complete description'
         };
         
         render(<PageHeader {...props} />);
         
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(props.title);
         expect(screen.getByText(props.description)).toBeInTheDocument();
      });

      it('should handle only required title prop', () => {
         render(<PageHeader title="Only Title" />);
         
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Only Title');
         expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
      });

      it('should handle undefined description gracefully', () => {
         render(<PageHeader title="Test Title" description={undefined} />);
         
         expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
         expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
      });
   });

   // Structure and Accessibility Tests
   describe('Structure and Accessibility', () => {
      it('should have proper DOM structure', () => {
         const { container } = render(<PageHeader title="Test" description="Test description" />);
         
         const pageHeader = container.firstChild;
         expect(pageHeader).toHaveClass('PageHeader');
         
         const containerElement = screen.getByTestId('container');
         expect(containerElement).toBeInTheDocument();
         
         const heading = screen.getByRole('heading', { level: 1 });
         expect(heading).toBeInTheDocument();
         
         const description = screen.getByText('Test description');
         expect(description).toBeInTheDocument();
      });

      it('should have proper heading hierarchy', () => {
         render(<PageHeader title="Main Title" description="Description" />);
         
         const headings = screen.getAllByRole('heading');
         expect(headings).toHaveLength(1);
         expect(headings[0]).toHaveProperty('tagName', 'H1');
      });

      it('should be accessible to screen readers', () => {
         render(<PageHeader title="Accessible Title" description="Accessible description" />);
         
         // Title should be properly labeled as heading
         const title = screen.getByRole('heading', { name: 'Accessible Title' });
         expect(title).toBeInTheDocument();
         
         // Description should be findable by text
         const description = screen.getByText('Accessible description');
         expect(description).toBeInTheDocument();
      });
   });

   // Integration Tests
   describe('Integration', () => {
      it('should integrate properly with Container component', () => {
         render(<PageHeader title="Integration Test" description="Testing integration" />);
         
         const container = screen.getByTestId('container');
         expect(container).toBeInTheDocument();
         
         // Both title and description should be inside the container
         const title = screen.getByRole('heading', { level: 1 });
         const description = screen.getByText('Testing integration');
         
         expect(container).toContainElement(title);
         expect(container).toContainElement(description);
      });
   });

   // Edge Cases
   describe('Edge Cases', () => {
      it('should handle very long titles', () => {
         const longTitle = 'A'.repeat(200);
         render(<PageHeader title={longTitle} />);
         
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(longTitle);
      });

      it('should handle special characters in title and description', () => {
         const specialTitle = '🚀 Special Title with émojis & ümlauts!';
         const specialDescription = 'Description with special chars: <>&"\'';
         
         render(<PageHeader title={specialTitle} description={specialDescription} />);
         
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(specialTitle);
         expect(screen.getByText(specialDescription)).toBeInTheDocument();
      });

      it('should handle whitespace-only title', () => {
         const whitespaceTitle = '   ';
         render(<PageHeader title={whitespaceTitle} />);
         
         const headingElement = screen.getByRole('heading', { level: 1 });
         expect(headingElement).toBeInTheDocument();
         // The heading will have the whitespace, but textContent trims it
         expect(headingElement.textContent).toBe(whitespaceTitle);
      });

      it('should handle numeric title', () => {
         const numericTitle = '12345';
         render(<PageHeader title={numericTitle} />);
         
         expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(numericTitle);
      });
   });

   // Snapshot Tests
   describe('Snapshot Tests', () => {
      it('should match snapshot with title only', () => {
         const { container } = render(<PageHeader title="Snapshot Title" />);
         expect(container.firstChild).toMatchSnapshot();
      });

      it('should match snapshot with title and description', () => {
         const { container } = render(
            <PageHeader 
               title="Snapshot Title" 
               description="Snapshot description" 
            />
         );
         expect(container.firstChild).toMatchSnapshot();
      });
   });
});
