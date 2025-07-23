import React from 'react';
import { render, screen } from '@testing-library/react';
import DataContainer from './DataContainer';
import { DataContainerProps } from './DataContainer.types';
import { SizeKeyword } from '@/helpers/parse.helpers';

// Mock the parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn(() => 'mocked-parse-css'),
   parseElevation: jest.fn(() => 'mocked-elevation'),
   parsePadding: jest.fn(() => 'mocked-padding'),
   parseRadius: jest.fn(() => 'mocked-radius'),
}));

// Mock the SCSS module
jest.mock('../DataContainer.module.scss', () => ({
   DataContainer: 'mocked-container-class',
   vertical: 'mocked-vertical-class',
}));

// Import mocked functions for type checking
import { parseCSS, parseElevation, parsePadding, parseRadius } from '@/helpers/parse.helpers';

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;
const mockParseElevation = parseElevation as jest.MockedFunction<typeof parseElevation>;
const mockParsePadding = parsePadding as jest.MockedFunction<typeof parsePadding>;
const mockParseRadius = parseRadius as jest.MockedFunction<typeof parseRadius>;

describe('DataContainer', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      // Reset default return values
      mockParseCSS.mockReturnValue('mocked-parse-css');
      mockParseElevation.mockReturnValue('mocked-elevation');
      mockParsePadding.mockReturnValue('mocked-padding');
      mockParseRadius.mockReturnValue('mocked-radius');
   });

   const defaultProps: DataContainerProps = {
      children: <div>Test content</div>,
   };

   describe('Basic Rendering', () => {
      it('renders without crashing', () => {
         render(<DataContainer {...defaultProps} />);
         expect(screen.getByText('Test content')).toBeInTheDocument();
      });

      it('renders children correctly', () => {
         render(
            <DataContainer {...defaultProps}>
               <span>Child 1</span>
               <span>Child 2</span>
            </DataContainer>
         );
         
         expect(screen.getByText('Child 1')).toBeInTheDocument();
         expect(screen.getByText('Child 2')).toBeInTheDocument();
      });

      it('renders with div container element', () => {
         const { container } = render(<DataContainer {...defaultProps} />);
         const dataContainer = container.firstChild as HTMLElement;
         
         expect(dataContainer.tagName).toBe('DIV');
      });
   });

   describe('Props Handling', () => {
      describe('className prop', () => {
         it('applies custom className when provided', () => {
            const { container } = render(
               <DataContainer {...defaultProps} className="custom-class" />
            );
            const dataContainer = container.firstChild as HTMLElement;
            
            expect(mockParseCSS).toHaveBeenCalledWith(
               'custom-class',
               expect.arrayContaining([
                  'DataContainer',
                  'mocked-container-class',
                  'mocked-padding',
                  'mocked-radius',
                  'mocked-elevation',
                  ''
               ])
            );
            expect(dataContainer).toHaveClass('mocked-parse-css');
         });

         it('does not apply custom className when not provided', () => {
            const { container } = render(<DataContainer {...defaultProps} />);
            const dataContainer = container.firstChild as HTMLElement;
            
            expect(dataContainer.className).not.toContain('custom-class');
         });
      });

      describe('padding prop', () => {
         it('calls parsePadding with default value "m" when not provided', () => {
            render(<DataContainer {...defaultProps} />);
            
            expect(mockParsePadding).toHaveBeenCalledWith('m');
         });

         it('calls parsePadding with provided value', () => {
            render(<DataContainer {...defaultProps} padding="l" />);
            
            expect(mockParsePadding).toHaveBeenCalledWith('l');
         });

         it('calls parsePadding with different size values', () => {
            const sizes: SizeKeyword[] = ['xs', 's', 'm', 'l', 'xl'];
            
            sizes.forEach(size => {
               render(<DataContainer {...defaultProps} padding={size} />);
               expect(mockParsePadding).toHaveBeenCalledWith(size);
            });
         });
      });

      describe('radius prop', () => {
         it('calls parseRadius with default value "s" when not provided', () => {
            render(<DataContainer {...defaultProps} />);
            
            expect(mockParseRadius).toHaveBeenCalledWith('s');
         });

         it('calls parseRadius with provided value', () => {
            render(<DataContainer {...defaultProps} radius="m" />);
            
            expect(mockParseRadius).toHaveBeenCalledWith('m');
         });

         it('calls parseRadius with different size values', () => {
            const sizes: SizeKeyword[] = ['xs', 's', 'm', 'l', 'xl'];
            
            sizes.forEach(size => {
               render(<DataContainer {...defaultProps} radius={size} />);
               expect(mockParseRadius).toHaveBeenCalledWith(size);
            });
         });
      });

      describe('elevation prop', () => {
         it('calls parseElevation with default value "none" when not provided', () => {
            render(<DataContainer {...defaultProps} />);
            
            expect(mockParseElevation).toHaveBeenCalledWith('none');
         });

         it('calls parseElevation with provided value', () => {
            render(<DataContainer {...defaultProps} elevation="m" />);
            
            expect(mockParseElevation).toHaveBeenCalledWith('m');
         });

         it('calls parseElevation with different size values', () => {
            const sizes: SizeKeyword[] = ['none', 'xs', 's', 'm', 'l', 'xl'];
            
            sizes.forEach(size => {
               render(<DataContainer {...defaultProps} elevation={size} />);
               expect(mockParseElevation).toHaveBeenCalledWith(size);
            });
         });
      });

      describe('vertical prop', () => {
         it('applies vertical class when vertical is true', () => {
            const { container } = render(
               <DataContainer {...defaultProps} vertical={true} />
            );
            const dataContainer = container.firstChild as HTMLElement;
            
            expect(mockParseCSS).toHaveBeenCalledWith(
               undefined,
               expect.arrayContaining([
                  'DataContainer',
                  'mocked-container-class',
                  'mocked-padding',
                  'mocked-radius',
                  'mocked-elevation',
                  'mocked-vertical-class'
               ])
            );
            expect(dataContainer).toHaveClass('mocked-parse-css');
         });

         it('does not apply vertical class when vertical is false', () => {
            const { container } = render(
               <DataContainer {...defaultProps} vertical={false} />
            );
            const dataContainer = container.firstChild as HTMLElement;
            
            expect(dataContainer).not.toHaveClass('mocked-vertical-class');
         });

         it('does not apply vertical class when vertical is not provided (default false)', () => {
            const { container } = render(<DataContainer {...defaultProps} />);
            const dataContainer = container.firstChild as HTMLElement;
            
            expect(dataContainer).not.toHaveClass('mocked-vertical-class');
         });
      });
   });

   describe('CSS Class Management', () => {
      it('calls parseCSS with correct parameters', () => {
         render(
            <DataContainer 
               {...defaultProps}
               className="custom-class"
               padding="l"
               radius="m"
               elevation="s"
               vertical={true}
            />
         );
         
         expect(mockParseCSS).toHaveBeenCalledWith(
            'custom-class',
            [
               'DataContainer',
               'mocked-container-class',
               'mocked-padding',
               'mocked-radius',
               'mocked-elevation',
               'mocked-vertical-class'
            ]
         );
      });

      it('calls parseCSS without custom className', () => {
         render(
            <DataContainer 
               {...defaultProps}
               padding="s"
               radius="l"
               elevation="m"
               vertical={false}
            />
         );
         
         expect(mockParseCSS).toHaveBeenCalledWith(
            undefined,
            [
               'DataContainer',
               'mocked-container-class',
               'mocked-padding',
               'mocked-radius',
               'mocked-elevation',
               ''
            ]
         );
      });

      it('applies base container class', () => {
         const { container } = render(<DataContainer {...defaultProps} />);
         const dataContainer = container.firstChild as HTMLElement;
         
         expect(dataContainer).toHaveClass('mocked-parse-css');
      });

      it('combines all classes correctly', () => {
         render(
            <DataContainer 
               {...defaultProps}
               className="test-class"
               vertical={true}
            />
         );
         
         const expectedClasses = [
            'DataContainer',
            'mocked-container-class',
            'mocked-padding',
            'mocked-radius',
            'mocked-elevation',
            'mocked-vertical-class'
         ];
         expect(mockParseCSS).toHaveBeenCalledWith('test-class', expectedClasses);
      });
   });

   describe('Children Rendering', () => {
      it('renders single child element', () => {
         render(
            <DataContainer {...defaultProps}>
               <button>Click me</button>
            </DataContainer>
         );
         
         expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
      });

      it('renders multiple child elements', () => {
         render(
            <DataContainer {...defaultProps}>
               <h1>Title</h1>
               <p>Paragraph</p>
               <button>Button</button>
            </DataContainer>
         );
         
         expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
         expect(screen.getByText('Paragraph')).toBeInTheDocument();
         expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument();
      });

      it('renders nested components', () => {
         const NestedComponent = () => <span>Nested content</span>;
         
         render(
            <DataContainer {...defaultProps}>
               <div>
                  <NestedComponent />
               </div>
            </DataContainer>
         );
         
         expect(screen.getByText('Nested content')).toBeInTheDocument();
      });

      it('renders text nodes', () => {
         render(
            <DataContainer {...defaultProps}>
               Just plain text
            </DataContainer>
         );
         
         expect(screen.getByText('Just plain text')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('maintains proper document structure', () => {
         const { container } = render(
            <DataContainer {...defaultProps}>
               <h1>Main heading</h1>
               <p>Content paragraph</p>
            </DataContainer>
         );
         
         const heading = screen.getByRole('heading', { level: 1 });
         const paragraph = screen.getByText('Content paragraph');
         
         expect(heading).toBeInTheDocument();
         expect(paragraph).toBeInTheDocument();
         expect(container.firstChild).toContainElement(heading);
         expect(container.firstChild).toContainElement(paragraph);
      });

      it('does not interfere with child accessibility features', () => {
         render(
            <DataContainer {...defaultProps}>
               <button aria-label="Close dialog">×</button>
               <div role="alert">Error message</div>
            </DataContainer>
         );
         
         expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
         expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      it('preserves semantic markup', () => {
         render(
            <DataContainer {...defaultProps}>
               <main>
                  <section>
                     <article>Content</article>
                  </section>
               </main>
            </DataContainer>
         );
         
         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(screen.getByText('Content')).toBeInTheDocument();
      });
   });

   describe('Edge Cases', () => {
      it('handles empty children gracefully', () => {
         render(<DataContainer>{undefined}</DataContainer>);
         
         const { container } = render(<DataContainer>{undefined}</DataContainer>);
         expect(container.firstChild).toBeInTheDocument();
      });

      it('handles null children', () => {
         render(<DataContainer>{null}</DataContainer>);
         
         const { container } = render(<DataContainer>{null}</DataContainer>);
         expect(container.firstChild).toBeInTheDocument();
      });

      it('handles conditional children', () => {
         const showContent = true;
         render(
            <DataContainer>
               {showContent && <div>Conditional content</div>}
            </DataContainer>
         );
         
         expect(screen.getByText('Conditional content')).toBeInTheDocument();
      });

      it('handles array of children', () => {
         const items = ['Item 1', 'Item 2', 'Item 3'];
         render(
            <DataContainer>
               {items.map((item, index) => (
                  <div key={index}>{item}</div>
               ))}
            </DataContainer>
         );
         
         items.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
         });
      });

      it('handles complex nested structures', () => {
         render(
            <DataContainer vertical={true} className="complex-container">
               <header>
                  <h1>Header</h1>
               </header>
               <main>
                  <section>
                     <article>
                        <p>Article content</p>
                     </article>
                  </section>
               </main>
               <footer>
                  <p>Footer</p>
               </footer>
            </DataContainer>
         );
         
         expect(screen.getByRole('banner')).toBeInTheDocument();
         expect(screen.getByRole('main')).toBeInTheDocument();
         expect(screen.getByRole('contentinfo')).toBeInTheDocument();
         expect(screen.getByText('Article content')).toBeInTheDocument();
      });

      it('handles all props together', () => {
         render(
            <DataContainer
               className="all-props-test"
               padding="xl"
               radius="l"
               elevation="m"
               vertical={true}
            >
               <div>All props applied</div>
            </DataContainer>
         );
         
         expect(mockParseCSS).toHaveBeenCalledWith(
            'all-props-test',
            [
               'DataContainer',
               'mocked-container-class',
               'mocked-padding',
               'mocked-radius',
               'mocked-elevation',
               'mocked-vertical-class'
            ]
         );
         expect(mockParsePadding).toHaveBeenCalledWith('xl');
         expect(mockParseRadius).toHaveBeenCalledWith('l');
         expect(mockParseElevation).toHaveBeenCalledWith('m');
         expect(screen.getByText('All props applied')).toBeInTheDocument();
      });
   });

   describe('Snapshots', () => {
      it('matches snapshot with default props', () => {
         const { container } = render(
            <DataContainer>
               <div>Default snapshot content</div>
            </DataContainer>
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });

      it('matches snapshot with all props', () => {
         const { container } = render(
            <DataContainer
               className="snapshot-test"
               padding="l"
               radius="m"
               elevation="s"
               vertical={true}
            >
               <div>Full props snapshot</div>
            </DataContainer>
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });

      it('matches snapshot with complex children', () => {
         const { container } = render(
            <DataContainer vertical={true}>
               <header>
                  <h1>Complex Header</h1>
               </header>
               <main>
                  <p>Main content</p>
                  <button>Action</button>
               </main>
            </DataContainer>
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });
   });
});
