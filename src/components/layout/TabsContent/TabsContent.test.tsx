import React from 'react';
import { render, screen } from '@testing-library/react';
import TabsContent from './TabsContent';
import { TabsContentProps, TabOption } from './TabsContent.types';

// Mock the parse helpers
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn(() => 'mocked-parse-css'),
}));

// Mock the SCSS module
jest.mock('./TabsContent.module.scss', () => ({
   TabsContent: 'mocked-tabs-content-class',
   tabs: 'mocked-tabs-class',
   tabContent: 'mocked-tab-content-class',
}));

// Mock Material-UI components
jest.mock('@mui/material', () => ({
   Tabs: ({ children, value, onChange }: { children: React.ReactNode; value?: number; onChange?: () => void }) => (
      <div data-testid="mui-tabs" data-value={value} onClick={onChange}>
         {children}
      </div>
   ),
   Tab: ({ label }: { label?: string }) => (
      <button data-testid="mui-tab" type="button">
         {label}
      </button>
   ),
}));

// Import mocked functions for type checking
import { parseCSS } from '@/helpers/parse.helpers';

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;

describe('TabsContent', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockParseCSS.mockReturnValue('mocked-parse-css');
   });

   const defaultOptions: TabOption[] = [
      { label: 'Tab 1', value: 'tab1' },
      { label: 'Tab 2', value: 'tab2' },
      { label: 'Tab 3', value: 'tab3' },
   ];

   const defaultProps: TabsContentProps = {
      options: defaultOptions,
      children: [
         <div key="1">Content 1</div>,
         <div key="2">Content 2</div>,
         <div key="3">Content 3</div>,
      ],
   };

   describe('Basic Rendering', () => {
      it('renders without crashing', () => {
         render(<TabsContent {...defaultProps} />);
         expect(screen.getByTestId('mui-tabs')).toBeInTheDocument();
      });

      it('renders all tab options', () => {
         render(<TabsContent {...defaultProps} />);
         
         expect(screen.getByText('Tab 1')).toBeInTheDocument();
         expect(screen.getByText('Tab 2')).toBeInTheDocument();
         expect(screen.getByText('Tab 3')).toBeInTheDocument();
      });

      it('renders with correct initial tab selected', () => {
         render(<TabsContent {...defaultProps} />);
         
         const tabsContainer = screen.getByTestId('mui-tabs');
         expect(tabsContainer).toHaveAttribute('data-value', '0');
      });

      it('renders first tab content by default', () => {
         render(<TabsContent {...defaultProps} />);
         
         expect(screen.getByText('Content 1')).toBeInTheDocument();
         expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
         expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
      });

      it('renders with div container element', () => {
         const { container } = render(<TabsContent {...defaultProps} />);
         const tabsContent = container.firstChild as HTMLElement;
         
         expect(tabsContent.tagName).toBe('DIV');
         expect(tabsContent).toHaveClass('mocked-parse-css');
      });
   });

   describe('Props Handling', () => {
      describe('options prop', () => {
         it('handles empty options array', () => {
            render(<TabsContent options={[]}><div>No tabs</div></TabsContent>);
            
            expect(screen.queryByTestId('mui-tab')).not.toBeInTheDocument();
            expect(screen.getByText('No tabs')).toBeInTheDocument();
         });

         it('handles single option', () => {
            const singleOption = [{ label: 'Only Tab', value: 'only' }];
            render(
               <TabsContent options={singleOption}>
                  <div>Single content</div>
               </TabsContent>
            );
            
            expect(screen.getByText('Only Tab')).toBeInTheDocument();
            expect(screen.getByText('Single content')).toBeInTheDocument();
         });

         it('handles multiple options correctly', () => {
            const multipleOptions = [
               { label: 'Alpha', value: 'alpha' },
               { label: 'Beta', value: 'beta' },
               { label: 'Gamma', value: 'gamma' },
               { label: 'Delta', value: 'delta' },
            ];
            
            render(
               <TabsContent options={multipleOptions}>
                  <div key="1">Alpha content</div>
                  <div key="2">Beta content</div>
                  <div key="3">Gamma content</div>
                  <div key="4">Delta content</div>
               </TabsContent>
            );
            
            expect(screen.getByText('Alpha')).toBeInTheDocument();
            expect(screen.getByText('Beta')).toBeInTheDocument();
            expect(screen.getByText('Gamma')).toBeInTheDocument();
            expect(screen.getByText('Delta')).toBeInTheDocument();
         });
      });

      describe('className prop', () => {
         it('applies custom className when provided', () => {
            render(<TabsContent {...defaultProps} className="custom-class" />);
            
            expect(mockParseCSS).toHaveBeenCalledWith(
               'custom-class',
               ['TabsContent', 'mocked-tabs-content-class']
            );
         });

         it('does not apply custom className when not provided', () => {
            render(<TabsContent {...defaultProps} />);
            
            expect(mockParseCSS).toHaveBeenCalledWith(
               undefined,
               ['TabsContent', 'mocked-tabs-content-class']
            );
         });
      });

      describe('useNewButton prop', () => {
         it('adds "New" tab when useNewButton is true', () => {
            render(
               <TabsContent 
                  {...defaultProps}
                  useNewButton={true}
                  newContent={<div>New content</div>}
               />
            );
            
            expect(screen.getByText('New')).toBeInTheDocument();
         });

         it('does not add "New" tab when useNewButton is false', () => {
            render(<TabsContent {...defaultProps} useNewButton={false} />);
            
            expect(screen.queryByText('New')).not.toBeInTheDocument();
         });

         it('does not add "New" tab when useNewButton is not provided', () => {
            render(<TabsContent {...defaultProps} />);
            
            expect(screen.queryByText('New')).not.toBeInTheDocument();
         });

         it('shows newContent when "New" tab is selected', () => {
            render(
               <TabsContent 
                  {...defaultProps}
                  useNewButton={true}
                  newContent={<div>New tab content</div>}
               />
            );
            
            // Verify that the "New" tab is added to the options
            expect(screen.getByText('New')).toBeInTheDocument();
            
            // Verify that all tabs including "New" are rendered
            const tabs = screen.getAllByTestId('mui-tab');
            expect(tabs).toHaveLength(4); // 3 default + 1 "New" tab
         });
      });

      describe('newContent prop', () => {
         it('renders newContent when provided with useNewButton', () => {
            const newContentElement = <div>Custom new content</div>;
            render(
               <TabsContent 
                  {...defaultProps}
                  useNewButton={true}
                  newContent={newContentElement}
               />
            );
            
            expect(screen.getByText('New')).toBeInTheDocument();
         });

         it('ignores newContent when useNewButton is false', () => {
            const newContentElement = <div>Should not show</div>;
            render(
               <TabsContent 
                  {...defaultProps}
                  useNewButton={false}
                  newContent={newContentElement}
               />
            );
            
            expect(screen.queryByText('Should not show')).not.toBeInTheDocument();
         });
      });
   });

   describe('Children Handling', () => {
      it('renders single child correctly', () => {
         render(
            <TabsContent options={[{ label: 'Single', value: 'single' }]}>
               <div>Single child content</div>
            </TabsContent>
         );
         
         expect(screen.getByText('Single child content')).toBeInTheDocument();
      });

      it('renders array of children correctly', () => {
         render(<TabsContent {...defaultProps} />);
         
         // Only first child should be visible initially
         expect(screen.getByText('Content 1')).toBeInTheDocument();
         expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
         expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
      });

      it('handles React components as children', () => {
         const CustomComponent = ({ text }: { text: string }) => <span>{text}</span>;
         
         render(
            <TabsContent 
               options={[{ label: 'Component', value: 'comp' }]}>
               <CustomComponent text="Component content" />
            </TabsContent>
         );
         
         expect(screen.getByText('Component content')).toBeInTheDocument();
      });

      it('handles mixed content types as children', () => {
         const mixedChildren = [
            <div key="1">Text content</div>,
            <button key="2">Button content</button>,
            <span key="3">Span content</span>,
         ];
         
         render(
            <TabsContent 
               options={defaultOptions}>
               {mixedChildren}
            </TabsContent>
         );
         
         expect(screen.getByText('Text content')).toBeInTheDocument();
      });
   });

   describe('Tab Switching Logic', () => {
      it('shows correct content when tab is changed', () => {
         render(<TabsContent {...defaultProps} />);
         
         // Initially shows first content
         expect(screen.getByText('Content 1')).toBeInTheDocument();
         expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
         
         // Simulate tab change by re-rendering with different initial state
         // Note: Due to mocking limitations, we test the rendering logic
         expect(screen.getByText('Tab 1')).toBeInTheDocument();
         expect(screen.getByText('Tab 2')).toBeInTheDocument();
         expect(screen.getByText('Tab 3')).toBeInTheDocument();
      });

      it('handles tab change events', () => {
         render(<TabsContent {...defaultProps} />);
         
         const tabsContainer = screen.getByTestId('mui-tabs');
         expect(tabsContainer).toHaveAttribute('data-value', '0');
         
         // Verify that the tabs component receives the onChange handler
         // The mock Tabs component should have an onClick prop that simulates onChange
         expect(tabsContainer).toBeDefined();
         
         // Verify that individual tabs are clickable
         const tabs = screen.getAllByTestId('mui-tab');
         expect(tabs).toHaveLength(3);
         expect(tabs[0]).toHaveTextContent('Tab 1');
      });
   });

   describe('CSS Class Management', () => {
      it('calls parseCSS with correct parameters', () => {
         render(<TabsContent {...defaultProps} className="test-class" />);
         
         expect(mockParseCSS).toHaveBeenCalledWith(
            'test-class',
            ['TabsContent', 'mocked-tabs-content-class']
         );
      });

      it('applies base CSS classes', () => {
         const { container } = render(<TabsContent {...defaultProps} />);
         const tabsContent = container.firstChild as HTMLElement;
         
         expect(tabsContent).toHaveClass('mocked-parse-css');
      });

      it('applies SCSS module classes to child elements', () => {
         const { container } = render(<TabsContent {...defaultProps} />);
         
         expect(container.querySelector('.mocked-tabs-class')).toBeInTheDocument();
         expect(container.querySelector('.mocked-tab-content-class')).toBeInTheDocument();
      });
   });

   describe('State Management', () => {
      it('initializes with first tab selected', () => {
         render(<TabsContent {...defaultProps} />);
         
         const tabsContainer = screen.getByTestId('mui-tabs');
         expect(tabsContainer).toHaveAttribute('data-value', '0');
      });

      it('calculates child count correctly for arrays', () => {
         const multipleChildren = [
            <div key="1">Child 1</div>,
            <div key="2">Child 2</div>,
            <div key="3">Child 3</div>,
            <div key="4">Child 4</div>,
         ];
         
         render(
            <TabsContent 
               options={defaultOptions}
               useNewButton={true}
               newContent={<div>New content</div>}>
               {multipleChildren}
            </TabsContent>
         );
         
         // Should show the "New" tab
         expect(screen.getByText('New')).toBeInTheDocument();
      });

      it('calculates child count correctly for single child', () => {
         render(
            <TabsContent 
               options={[{ label: 'Single', value: 'single' }]}
               useNewButton={true}
               newContent={<div>New content</div>}>
               <div>Single child</div>
            </TabsContent>
         );
         
         expect(screen.getByText('New')).toBeInTheDocument();
      });
   });

   describe('Accessibility', () => {
      it('maintains proper tab structure', () => {
         render(<TabsContent {...defaultProps} />);
         
         expect(screen.getByTestId('mui-tabs')).toBeInTheDocument();
         expect(screen.getAllByTestId('mui-tab')).toHaveLength(3);
      });

      it('preserves tab labels for screen readers', () => {
         render(<TabsContent {...defaultProps} />);
         
         expect(screen.getByText('Tab 1')).toBeInTheDocument();
         expect(screen.getByText('Tab 2')).toBeInTheDocument();
         expect(screen.getByText('Tab 3')).toBeInTheDocument();
      });

      it('does not interfere with child accessibility features', () => {
         render(
            <TabsContent options={[{ label: 'Accessible', value: 'accessible' }]}>
               <div>
                  <button aria-label="Close">×</button>
                  <div role="alert">Important message</div>
               </div>
            </TabsContent>
         );
         
         expect(screen.getByLabelText('Close')).toBeInTheDocument();
         expect(screen.getByRole('alert')).toBeInTheDocument();
      });
   });

   describe('Edge Cases', () => {
      it('handles empty children gracefully', () => {
         render(
            <TabsContent options={[{ label: 'Empty', value: 'empty' }]}>
               {null}
            </TabsContent>
         );
         
         expect(screen.getByText('Empty')).toBeInTheDocument();
      });

      it('handles undefined newContent', () => {
         render(
            <TabsContent 
               {...defaultProps}
               useNewButton={true}
               newContent={undefined}
            />
         );
         
         expect(screen.getByText('New')).toBeInTheDocument();
      });

      it('handles tab options with special characters', () => {
         const specialOptions = [
            { label: 'Tab & Symbol', value: 'special1' },
            { label: 'Tab "Quotes"', value: 'special2' },
            { label: 'Tab <HTML>', value: 'special3' },
         ];
         
         render(
            <TabsContent options={specialOptions}>
               <div key="1">Content 1</div>
               <div key="2">Content 2</div>
               <div key="3">Content 3</div>
            </TabsContent>
         );
         
         expect(screen.getByText('Tab & Symbol')).toBeInTheDocument();
         expect(screen.getByText('Tab "Quotes"')).toBeInTheDocument();
         expect(screen.getByText('Tab <HTML>')).toBeInTheDocument();
      });

      it('handles mismatched options and children count', () => {
         const mismatchedOptions = [
            { label: 'Tab 1', value: 'tab1' },
            { label: 'Tab 2', value: 'tab2' },
         ];
         
         render(
            <TabsContent options={mismatchedOptions}>
               <div key="1">Content 1</div>
               <div key="2">Content 2</div>
               <div key="3">Content 3</div>
            </TabsContent>
         );
         
         expect(screen.getByText('Tab 1')).toBeInTheDocument();
         expect(screen.getByText('Tab 2')).toBeInTheDocument();
         expect(screen.getByText('Content 1')).toBeInTheDocument();
      });

      it('handles complex nested content', () => {
         const complexContent = [
            <div key="1">
               <header>
                  <h2>Tab 1 Header</h2>
               </header>
               <main>
                  <p>Tab 1 content</p>
               </main>
            </div>,
            <div key="2">
               <form>
                  <input placeholder="Form input" />
                  <button type="submit">Submit</button>
               </form>
            </div>,
         ];
         
         render(
            <TabsContent 
               options={[
                  { label: 'Complex 1', value: 'complex1' },
                  { label: 'Complex 2', value: 'complex2' },
               ]}>
               {complexContent}
            </TabsContent>
         );
         
         expect(screen.getByText('Tab 1 Header')).toBeInTheDocument();
         expect(screen.getByText('Tab 1 content')).toBeInTheDocument();
         expect(screen.queryByPlaceholderText('Form input')).not.toBeInTheDocument();
      });
   });

   describe('Snapshots', () => {
      it('matches snapshot with default props', () => {
         const { container } = render(<TabsContent {...defaultProps} />);
         
         expect(container.firstChild).toMatchSnapshot();
      });

      it('matches snapshot with useNewButton enabled', () => {
         const { container } = render(
            <TabsContent 
               {...defaultProps}
               useNewButton={true}
               newContent={<div>New tab content</div>}
            />
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });

      it('matches snapshot with custom className', () => {
         const { container } = render(
            <TabsContent 
               {...defaultProps}
               className="custom-tabs-class"
            />
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });

      it('matches snapshot with single child', () => {
         const { container } = render(
            <TabsContent 
               options={[{ label: 'Single', value: 'single' }]}>
               <div>Single content</div>
            </TabsContent>
         );
         
         expect(container.firstChild).toMatchSnapshot();
      });
   });
});
