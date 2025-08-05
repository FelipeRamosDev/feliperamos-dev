import { render, screen } from '@testing-library/react';
import TooltipTableHead from './TooltipTableHead';

describe('TooltipTableHead', () => {
   it('renders children correctly', () => {
      render(
         <TooltipTableHead>
            <span>Test Content</span>
         </TooltipTableHead>
      );

      expect(screen.getByText('Test Content')).toBeInTheDocument();
   });

   it('applies tooltip-head className', () => {
      render(
         <TooltipTableHead>
            <span>Test Content</span>
         </TooltipTableHead>
      );

      const container = screen.getByText('Test Content').parentElement;
      expect(container).toHaveClass('tooltip-head');
   });

   it('forwards additional props', () => {
      render(
         <TooltipTableHead data-testid="custom-tooltip" role="tooltip">
            <span>Test Content</span>
         </TooltipTableHead>
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveAttribute('role', 'tooltip');
   });

   it('handles multiple children', () => {
      render(
         <TooltipTableHead>
            <span>First Child</span>
            <div>Second Child</div>
            <p>Third Child</p>
         </TooltipTableHead>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
   });

   it('handles no children', () => {
      const { container } = render(<TooltipTableHead />);
      
      const tooltipDiv = container.querySelector('.tooltip-head');
      expect(tooltipDiv).toBeInTheDocument();
      expect(tooltipDiv).toBeEmptyDOMElement();
   });

   it('renders as div element', () => {
      render(
         <TooltipTableHead data-testid="tooltip-head">
            Content
         </TooltipTableHead>
      );

      const element = screen.getByTestId('tooltip-head');
      expect(element.tagName).toBe('DIV');
   });

   it('handles complex children structure', () => {
      render(
         <TooltipTableHead>
            <div>
               <h3>Title</h3>
               <p>Description</p>
               <ul>
                  <li>Item 1</li>
                  <li>Item 2</li>
               </ul>
            </div>
         </TooltipTableHead>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
   });

   it('supports aria attributes', () => {
      render(
         <TooltipTableHead 
            aria-label="Tooltip content"
            aria-describedby="tooltip-description"
         >
            <span>Tooltip text</span>
         </TooltipTableHead>
      );

      const container = screen.getByText('Tooltip text').parentElement;
      expect(container).toHaveAttribute('aria-label', 'Tooltip content');
      expect(container).toHaveAttribute('aria-describedby', 'tooltip-description');
   });

   it('supports custom data attributes', () => {
      render(
         <TooltipTableHead 
            data-tooltip-id="unique-id"
            data-position="top"
         >
            <span>Content</span>
         </TooltipTableHead>
      );

      const container = screen.getByText('Content').parentElement;
      expect(container).toHaveAttribute('data-tooltip-id', 'unique-id');
      expect(container).toHaveAttribute('data-position', 'top');
   });

   it('handles functional children', () => {
      const FunctionalChild = () => <span>Functional Component</span>;
      
      render(
         <TooltipTableHead>
            <FunctionalChild />
         </TooltipTableHead>
      );

      expect(screen.getByText('Functional Component')).toBeInTheDocument();
   });
});
