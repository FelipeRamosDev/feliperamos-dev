import { render, screen } from '@testing-library/react';
import React from 'react';
import ContentSidebar from './ContentSidebar';
import { parseCSS } from '@/helpers/parse.helpers';

// Mock the parseCSS utility
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn()
}));

describe('ContentSidebar', () => {
   const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;

   beforeEach(() => {
      // Default mock implementation
      mockParseCSS.mockImplementation((className, classes) => {
         if (Array.isArray(classes)) {
            return [className, ...classes].filter(Boolean).join(' ');
         }
         return [className, classes].filter(Boolean).join(' ');
      });

      jest.clearAllMocks();
   });

   describe('Basic rendering', () => {
      it('renders the ContentSidebar element', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar');
         expect(container).toBeInTheDocument();
      });

      it('renders as a div element', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar');
         expect(container?.tagName).toBe('DIV');
      });

      it('returns a React JSX Element', () => {
         const result = ContentSidebar({});
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
         expect(result.type).toBe('div');
      });

      it('renders content and sidebar divs', () => {
         render(<ContentSidebar />);

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content).toBeInTheDocument();
         expect(sidebar).toBeInTheDocument();
      });

      it('maintains proper DOM structure', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar') as HTMLElement;
         const content = document.querySelector('.content') as HTMLElement;
         const sidebar = document.querySelector('.sidebar') as HTMLElement;

         expect(container).toContainElement(content);
         expect(container).toContainElement(sidebar);
         expect(container?.children).toHaveLength(2);
      });
   });

   describe('Children rendering', () => {
      it('renders first child in content area', () => {
         const contentChild = <div data-testid="content-child">Content</div>;
         const sidebarChild = <div data-testid="sidebar-child">Sidebar</div>;

         render(
            <ContentSidebar>
               {contentChild}
               {sidebarChild}
            </ContentSidebar>
         );

         const content = document.querySelector('.content');
         const contentElement = screen.getByTestId('content-child');

         expect(content).toContainElement(contentElement);
         expect(contentElement).toHaveTextContent('Content');
      });

      it('renders second child in sidebar area', () => {
         const contentChild = <div data-testid="content-child">Content</div>;
         const sidebarChild = <div data-testid="sidebar-child">Sidebar</div>;

         render(
            <ContentSidebar>
               {contentChild}
               {sidebarChild}
            </ContentSidebar>
         );

         const sidebar = document.querySelector('.sidebar');
         const sidebarElement = screen.getByTestId('sidebar-child');

         expect(sidebar).toContainElement(sidebarElement);
         expect(sidebarElement).toHaveTextContent('Sidebar');
      });

      it('handles single child (only content)', () => {
         const contentChild = <div data-testid="content-child">Content Only</div>;

         render(
            <ContentSidebar>
               {contentChild}
            </ContentSidebar>
         );

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');
         const contentElement = screen.getByTestId('content-child');

         expect(content).toContainElement(contentElement);
         expect(sidebar).toBeEmptyDOMElement();
      });

      it('handles no children', () => {
         render(<ContentSidebar />);

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content).toBeEmptyDOMElement();
         expect(sidebar).toBeEmptyDOMElement();
      });

      it('handles more than two children (only uses first two)', () => {
         const child1 = <div data-testid="child-1">Child 1</div>;
         const child2 = <div data-testid="child-2">Child 2</div>;
         const child3 = <div data-testid="child-3">Child 3</div>;

         render(
            <ContentSidebar>
               {child1}
               {child2}
               {child3}
            </ContentSidebar>
         );

         expect(screen.getByTestId('child-1')).toBeInTheDocument();
         expect(screen.getByTestId('child-2')).toBeInTheDocument();
         expect(screen.queryByTestId('child-3')).not.toBeInTheDocument();
      });

      it('handles null and undefined children', () => {
         render(
            <ContentSidebar>
               {null}
               {undefined}
            </ContentSidebar>
         );

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content).toBeEmptyDOMElement();
         expect(sidebar).toBeEmptyDOMElement();
      });
   });

   describe('CSS class management', () => {
      it('calls parseCSS with default parameters', () => {
         render(<ContentSidebar />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('calls parseCSS with custom className', () => {
         render(<ContentSidebar className="custom-class" />);

         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('calls parseCSS with reverseColumn class', () => {
         render(<ContentSidebar reverseColumn />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            'reverse-column',
            ''
         ]);
      });

      it('calls parseCSS with reverseRow class', () => {
         render(<ContentSidebar reverseRow />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            'reverse-row'
         ]);
      });

      it('calls parseCSS with both reverse classes', () => {
         render(<ContentSidebar reverseColumn reverseRow />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            'reverse-column',
            'reverse-row'
         ]);
      });

      it('calls parseCSS with all parameters', () => {
         render(
            <ContentSidebar 
               className="custom-class" 
               reverseColumn 
               reverseRow 
            />
         );

         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', [
            'ContentSidebar',
            'reverse-column',
            'reverse-row'
         ]);
      });

      it('applies the result from parseCSS', () => {
         mockParseCSS.mockReturnValue('ContentSidebar custom-class reverse-column');

         render(<ContentSidebar className="custom-class" reverseColumn />);

         const container = document.querySelector('.ContentSidebar');
         expect(container).toHaveClass('ContentSidebar', 'custom-class', 'reverse-column');
      });
   });

   describe('Prop handling', () => {
      it('handles reverseColumn prop', () => {
         render(<ContentSidebar reverseColumn />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            'reverse-column',
            ''
         ]);
      });

      it('handles reverseRow prop', () => {
         render(<ContentSidebar reverseRow />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            'reverse-row'
         ]);
      });

      it('handles className prop', () => {
         render(<ContentSidebar className="test-class" />);

         expect(mockParseCSS).toHaveBeenCalledWith('test-class', [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('handles className as array', () => {
         render(<ContentSidebar className={['class1', 'class2']} />);

         expect(mockParseCSS).toHaveBeenCalledWith(['class1', 'class2'], [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('handles empty className', () => {
         render(<ContentSidebar className="" />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('handles undefined className', () => {
         render(<ContentSidebar className={undefined} />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);
      });
   });

   describe('Default props', () => {
      it('uses default values when no props provided', () => {
         render(<ContentSidebar />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);
      });

      it('uses empty array as default children', () => {
         render(<ContentSidebar />);

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content).toBeEmptyDOMElement();
         expect(sidebar).toBeEmptyDOMElement();
      });

      it('uses empty string as default className', () => {
         render(<ContentSidebar />);

         expect(mockParseCSS).toHaveBeenCalledWith('', expect.any(Array));
      });

      it('uses false as default for reverse props', () => {
         render(<ContentSidebar />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);
      });
   });

   describe('Component structure', () => {
      it('has correct HTML structure', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar') as HTMLElement;
         const content = document.querySelector('.content') as HTMLElement;
         const sidebar = document.querySelector('.sidebar') as HTMLElement;

         expect(container).toBeInTheDocument();
         expect(content).toBeInTheDocument();
         expect(sidebar).toBeInTheDocument();
         expect(container).toContainElement(content);
         expect(container).toContainElement(sidebar);
      });

      it('maintains proper element order', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar');
         const children = container?.children;

         expect(children).toHaveLength(2);
         expect(children?.[0]).toHaveClass('content');
         expect(children?.[1]).toHaveClass('sidebar');
      });

      it('applies correct CSS classes to children', () => {
         render(<ContentSidebar />);

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content).toHaveClass('content');
         expect(sidebar).toHaveClass('sidebar');
      });
   });

   describe('Component behavior', () => {
      it('renders consistently', () => {
         const { rerender } = render(<ContentSidebar />);

         expect(document.querySelector('.ContentSidebar')).toBeInTheDocument();

         rerender(<ContentSidebar />);

         expect(document.querySelector('.ContentSidebar')).toBeInTheDocument();
      });

      it('handles prop changes', () => {
         const { rerender } = render(<ContentSidebar />);

         expect(mockParseCSS).toHaveBeenLastCalledWith('', [
            'ContentSidebar',
            '',
            ''
         ]);

         rerender(<ContentSidebar reverseColumn />);

         expect(mockParseCSS).toHaveBeenLastCalledWith('', [
            'ContentSidebar',
            'reverse-column',
            ''
         ]);
      });

      it('handles children changes', () => {
         const { rerender } = render(
            <ContentSidebar>
               <div data-testid="original">Original</div>
            </ContentSidebar>
         );

         expect(screen.getByTestId('original')).toBeInTheDocument();

         rerender(
            <ContentSidebar>
               <div data-testid="updated">Updated</div>
            </ContentSidebar>
         );

         expect(screen.queryByTestId('original')).not.toBeInTheDocument();
         expect(screen.getByTestId('updated')).toBeInTheDocument();
      });
   });

   describe('Edge cases', () => {
      it('handles React fragments as children', () => {
         render(
            <ContentSidebar>
               <React.Fragment>
                  <div data-testid="fragment-child">Fragment Content</div>
               </React.Fragment>
               <div data-testid="sidebar-child">Sidebar</div>
            </ContentSidebar>
         );

         expect(screen.getByTestId('fragment-child')).toBeInTheDocument();
         expect(screen.getByTestId('sidebar-child')).toBeInTheDocument();
      });

      it('handles conditional children', () => {
         const showContent = true;
         const showSidebar = false;

         render(
            <ContentSidebar>
               {showContent && <div data-testid="conditional-content">Content</div>}
               {showSidebar && <div data-testid="conditional-sidebar">Sidebar</div>}
            </ContentSidebar>
         );

         expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
         expect(screen.queryByTestId('conditional-sidebar')).not.toBeInTheDocument();
      });

      it('handles complex child components', () => {
         const ComplexChild = ({ title }: { title: string }) => (
            <div data-testid="complex-child">
               <h3>{title}</h3>
               <p>Complex content</p>
            </div>
         );

         render(
            <ContentSidebar>
               <ComplexChild title="Main Content" />
               <ComplexChild title="Sidebar Content" />
            </ContentSidebar>
         );

         const complexChildren = screen.getAllByTestId('complex-child');
         expect(complexChildren).toHaveLength(2);
      });

      it('handles children with props', () => {
         render(
            <ContentSidebar>
               <div data-testid="props-child" className="custom-child" id="child-1">
                  Content with props
               </div>
               <span data-testid="span-child" data-color="red">
                  Sidebar span
               </span>
            </ContentSidebar>
         );

         const propsChild = screen.getByTestId('props-child');
         const spanChild = screen.getByTestId('span-child');

         expect(propsChild).toHaveClass('custom-child');
         expect(propsChild).toHaveAttribute('id', 'child-1');
         expect(spanChild).toHaveAttribute('data-color', 'red');
      });
   });

   describe('Performance considerations', () => {
      it('renders efficiently', () => {
         const startTime = performance.now();
         render(<ContentSidebar />);
         const endTime = performance.now();

         expect(document.querySelector('.ContentSidebar')).toBeInTheDocument();
         expect(endTime - startTime).toBeLessThan(50);
      });

      it('does not cause unnecessary re-renders', () => {
         const { rerender } = render(<ContentSidebar />);

         const initialCallCount = mockParseCSS.mock.calls.length;

         rerender(<ContentSidebar />);

         expect(mockParseCSS.mock.calls.length).toBe(initialCallCount + 1);
      });

      it('maintains consistent performance', () => {
         const renderTimes: number[] = [];

         for (let i = 0; i < 5; i++) {
            const startTime = performance.now();
            const { unmount } = render(<ContentSidebar />);
            const endTime = performance.now();
            renderTimes.push(endTime - startTime);
            unmount();
         }

         const avgTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
         expect(avgTime).toBeLessThan(100);
      });
   });

   describe('TypeScript integration', () => {
      it('returns correct TypeScript type', () => {
         const result = ContentSidebar({});
         expect(result).toBeDefined();
         expect(typeof result).toBe('object');
      });

      it('handles TypeScript JSX.Element return type', () => {
         const result = ContentSidebar({});
         expect(result.type).toBe('div');
         expect(result.props).toBeDefined();
      });

      it('maintains type safety with props', () => {
         // This test verifies the component compiles correctly with TypeScript
         render(
            <ContentSidebar 
               reverseColumn={true}
               reverseRow={false}
               className="test"
            />
         );
         expect(document.querySelector('.ContentSidebar')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('provides proper structure for screen readers', () => {
         render(
            <ContentSidebar>
               <main data-testid="main-content">
                  <h1>Main Content</h1>
               </main>
               <aside data-testid="sidebar-content">
                  <h2>Sidebar</h2>
               </aside>
            </ContentSidebar>
         );

         const mainContent = screen.getByTestId('main-content');
         const sidebarContent = screen.getByTestId('sidebar-content');

         expect(mainContent).toBeInTheDocument();
         expect(sidebarContent).toBeInTheDocument();
      });

      it('maintains proper content hierarchy', () => {
         render(
            <ContentSidebar>
               <div role="main">Main content</div>
               <div>Sidebar content</div>
            </ContentSidebar>
         );

         const main = screen.getByRole('main');
         const complementary = screen.getByRole('complementary');

         expect(main).toBeInTheDocument();
         expect(complementary).toBeInTheDocument();
      });

      it('supports accessible children', () => {
         render(
            <ContentSidebar>
               <div aria-label="Main content area">
                  <h1>Page Title</h1>
                  <p>Main content</p>
               </div>
               <nav aria-label="Secondary navigation">
                  <ul>
                     <li><a href="#section1">Section 1</a></li>
                  </ul>
               </nav>
            </ContentSidebar>
         );

         const mainArea = screen.getByLabelText('Main content area');
         const nav = screen.getByLabelText('Secondary navigation');

         expect(mainArea).toBeInTheDocument();
         expect(nav).toBeInTheDocument();
      });
   });

   describe('Layout behavior', () => {
      it('supports responsive layout structure', () => {
         render(<ContentSidebar />);

         const container = document.querySelector('.ContentSidebar');
         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(container).toHaveClass('ContentSidebar');
         expect(content).toHaveClass('content');
         expect(sidebar).toHaveClass('sidebar');
      });

      it('supports reverse layout options', () => {
         render(<ContentSidebar reverseColumn reverseRow />);

         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'ContentSidebar',
            'reverse-column',
            'reverse-row'
         ]);
      });

      it('maintains layout integrity with different children', () => {
         render(
            <ContentSidebar>
               <article>Article content</article>
               <aside>Sidebar content</aside>
            </ContentSidebar>
         );

         const content = document.querySelector('.content');
         const sidebar = document.querySelector('.sidebar');

         expect(content?.querySelector('article')).toBeInTheDocument();
         expect(sidebar?.querySelector('aside')).toBeInTheDocument();
      });
   });
});

