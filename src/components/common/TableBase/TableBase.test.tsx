import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import TableBase from './TableBase';
import { IColumnConfig, TableBaseRowProps } from './TableBase.types';
import { parseCSS, parseElevation, parsePadding, parseRadius } from '@/helpers/parse.helpers';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

// Mock the helper functions
jest.mock('@/helpers/parse.helpers', () => ({
   parseCSS: jest.fn(),
   parseElevation: jest.fn(),
   parsePadding: jest.fn(),
   parseRadius: jest.fn()
}));

// Mock the TextResources provider
jest.mock('@/services/TextResources/TextResourcesProvider', () => ({
   useTextResources: jest.fn()
}));

// Mock MUI components
jest.mock('@mui/material/TableContainer', () => {
   return function MockTableContainer({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
      return <div data-testid="table-container" {...props}>{children}</div>;
   };
});

jest.mock('@mui/material/Table', () => {
   return function MockTable({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
      // Remove stickyHeader from DOM props
      return <table data-testid="mui-table" {...props}>{children}</table>;
   };
});

jest.mock('@mui/material/TableBody', () => {
   return function MockTableBody({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
      return <tbody data-testid="table-body" {...props}>{children}</tbody>;
   };
});

jest.mock('@mui/material/TablePagination', () => {
   return function MockTablePagination(props: Record<string, unknown>) {
      return (
         <div data-testid="table-pagination">
            <button 
               data-testid="page-change-btn"
               onClick={() => (props.onPageChange as (event: unknown, page: number) => void)({}, (props.page as number) + 1)}
            >
               Next Page
            </button>
            <input
               data-testid="rows-per-page-input"
               value={props.rowsPerPage as number}
               onChange={(e) => (props.onRowsPerPageChange as (event: React.ChangeEvent<HTMLInputElement>) => void)(e)}
               aria-label="Rows per page"
            />
         </div>
      );
   };
});

jest.mock('@mui/material/Button', () => {
   return function MockButton({ children, onClick, ...props }: { children: React.ReactNode; onClick?: () => void } & Record<string, unknown>) {
      return (
         <button data-testid="mui-button" onClick={onClick} {...props}>
            {children}
         </button>
      );
   };
});

// Mock the Spinner component
jest.mock('@/components/common', () => ({
   Spinner: function MockSpinner(props: Record<string, unknown>) {
      return <div data-testid="spinner" {...props}>Loading...</div>;
   }
}));

// Mock sub-components
jest.mock('./TableBaseRow', () => {
   return function MockTableBaseRow({ item, columnConfig, onClick }: { item: Record<string, unknown>; columnConfig: IColumnConfig[]; onClick?: () => void }) {
      return (
         <tr data-testid="table-base-row" onClick={onClick}>
            {columnConfig?.map((col) => (
               <td key={col.propKey} data-testid={`cell-${col.propKey}`}>
                  {col.format ? col.format(item[col.propKey], item, col) : String(item[col.propKey])}
               </td>
            ))}
         </tr>
      );
   };
});

jest.mock('./TableBaseHeader', () => {
   return function MockTableBaseHeader({ columnConfig }: { columnConfig: IColumnConfig[] }) {
      return (
         <thead data-testid="table-base-header">
            <tr>
               {columnConfig?.map((col) => (
                  <th key={col.propKey} data-testid={`header-${col.propKey}`}>
                     {col.label}
                  </th>
               ))}
            </tr>
         </thead>
      );
   };
});

jest.mock('./TableColumnConfig', () => {
   return function MockTableColumnConfig(config: IColumnConfig) {
      return {
         id: config.id || config.propKey,
         propKey: config.propKey,
         label: config.label,
         align: config.align || 'left',
         style: config.style,
         maxWidth: config.maxWidth,
         minWidth: config.minWidth,
         format: config.format
      };
   };
});

const mockParseCSS = parseCSS as jest.MockedFunction<typeof parseCSS>;
const mockParseElevation = parseElevation as jest.MockedFunction<typeof parseElevation>;
const mockParsePadding = parsePadding as jest.MockedFunction<typeof parsePadding>;
const mockParseRadius = parseRadius as jest.MockedFunction<typeof parseRadius>;
const mockUseTextResources = useTextResources as jest.MockedFunction<typeof useTextResources>;

// Sample data for testing
interface TestItem {
   id: number;
   name: string;
   email: string;
   age: number;
}

const sampleItems: TestItem[] = [
   { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
   { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25 },
   { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

const sampleColumnConfig: IColumnConfig[] = [
   { propKey: 'name', label: 'Name' },
   { propKey: 'email', label: 'Email' },
   { propKey: 'age', label: 'Age', align: 'center' }
];

describe('TableBase', () => {
   beforeEach(() => {
      jest.clearAllMocks();
      
      // Default mock implementations
      mockParseCSS.mockReturnValue('TableBase test-class');
      mockParseElevation.mockReturnValue('elevation-m');
      mockParsePadding.mockReturnValue('padding-none');
      mockParseRadius.mockReturnValue('radius-s');
      
      mockUseTextResources.mockReturnValue({
         textResources: {
            getText: jest.fn((key: string) => {
               if (key === 'TableBase.seeMoreButton') return 'See More';
               if (key === 'TableBase.noDocumentsText') return 'There are no documents to list!';
               return key;
            })
         }
      } as unknown as ReturnType<typeof useTextResources>);
   });

   describe('Basic rendering', () => {
      it('renders with minimal props', () => {
         const { container } = render(<TableBase items={[]} />);
         
         const tableBase = container.firstChild as HTMLElement;
         expect(tableBase).toBeInTheDocument();
         expect(tableBase.tagName).toBe('DIV');
      });

      it('applies CSS classes correctly', () => {
         const { container } = render(
            <TableBase 
               className="custom-class"
               items={[]}
               elevation="l"
               padding="m"
               radius="l"
               borderLastRow={false}
            />
         );
         
         expect(mockParseCSS).toHaveBeenCalledWith('custom-class', [
            'TableBase',
            'padding-none',
            'elevation-m',
            'radius-s',
            ''
         ]);
         
         const tableBase = container.firstChild as HTMLElement;
         expect(tableBase).toHaveClass('TableBase test-class');
      });

      it('passes through additional props', () => {
         render(
            <TableBase 
               items={[]}
               data-testid="table-base"
               aria-label="Data table"
            />
         );
         
         const tableBase = screen.getByTestId('table-base');
         expect(tableBase).toHaveAttribute('aria-label', 'Data table');
      });
   });

   describe('Loading states', () => {
      it('shows spinner when loading is true', () => {
         render(<TableBase items={[]} loading={true} />);
         
         const spinner = screen.getByTestId('spinner');
         expect(spinner).toBeInTheDocument();
         expect(spinner).toHaveTextContent('Loading...');
      });

      it('hides table content when loading', () => {
         render(<TableBase items={sampleItems} columnConfig={sampleColumnConfig} loading={true} />);
         
         expect(screen.getByTestId('spinner')).toBeInTheDocument();
         expect(screen.queryByTestId('table-container')).not.toBeInTheDocument();
      });

      it('shows table content when not loading', () => {
         render(<TableBase items={sampleItems} columnConfig={sampleColumnConfig} loading={false} />);
         
         expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
         expect(screen.getByTestId('table-container')).toBeInTheDocument();
      });
   });

   describe('Data rendering', () => {
      it('renders table with items and columns', () => {
         render(<TableBase items={sampleItems} columnConfig={sampleColumnConfig} loading={false} />);
         
         expect(screen.getByTestId('mui-table')).toBeInTheDocument();
         expect(screen.getByTestId('table-body')).toBeInTheDocument();
         
         // Check that rows are rendered
         const rows = screen.getAllByTestId('table-base-row');
         expect(rows).toHaveLength(3);
      });

      it('renders header when not hidden', () => {
         render(<TableBase items={sampleItems} columnConfig={sampleColumnConfig} loading={false} />);
         
         expect(screen.getByTestId('table-base-header')).toBeInTheDocument();
         
         // Check headers are rendered
         expect(screen.getByTestId('header-name')).toHaveTextContent('Name');
         expect(screen.getByTestId('header-email')).toHaveTextContent('Email');
         expect(screen.getByTestId('header-age')).toHaveTextContent('Age');
      });

      it('hides header when hideHeader is true', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               hideHeader={true}
            />
         );
         
         expect(screen.queryByTestId('table-base-header')).not.toBeInTheDocument();
      });

      it('renders cells with correct data', () => {
         render(<TableBase items={sampleItems} columnConfig={sampleColumnConfig} loading={false} />);
         
         // Check first row data using getAllByTestId and indexing
         const nameCells = screen.getAllByTestId('cell-name');
         const emailCells = screen.getAllByTestId('cell-email');
         const ageCells = screen.getAllByTestId('cell-age');
         
         expect(nameCells[0]).toHaveTextContent('John Doe');
         expect(emailCells[0]).toHaveTextContent('john@example.com');
         expect(ageCells[0]).toHaveTextContent('30');
      });
   });

   describe('Empty state', () => {
      it('shows no documents message when items array is empty', () => {
         render(<TableBase items={[]} columnConfig={sampleColumnConfig} loading={false} />);
         
         const noItemsDiv = screen.getByText('There are no documents to list!');
         expect(noItemsDiv).toBeInTheDocument();
      });

      it('uses custom no documents text', () => {
         render(
            <TableBase 
               items={[]} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               noDocumentsText="No data available"
            />
         );
         
         expect(screen.getByText('No data available')).toBeInTheDocument();
      });

      it('shows both table and no items message when items array is empty', () => {
         render(<TableBase items={[]} columnConfig={sampleColumnConfig} loading={false} />);
         
         // Component shows empty table structure and no items message
         expect(screen.getByTestId('table-container')).toBeInTheDocument();
         expect(screen.getByText('There are no documents to list!')).toBeInTheDocument();
      });
   });

   describe('Pagination', () => {
      it('renders pagination when usePagination is true', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               usePagination={true}
            />
         );
         
         expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
      });

      it('does not render pagination when usePagination is false', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               usePagination={false}
            />
         );
         
         expect(screen.queryByTestId('table-pagination')).not.toBeInTheDocument();
      });

      it('calls onPageNav when page changes', async () => {
         const mockOnPageNav = jest.fn().mockResolvedValue(undefined);
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               usePagination={true}
               onPageNav={mockOnPageNav}
            />
         );
         
         const pageButton = screen.getByTestId('page-change-btn');
         fireEvent.click(pageButton);
         
         await waitFor(() => {
            expect(mockOnPageNav).toHaveBeenCalledWith(1);
         });
      });

      it('calls onRowsPerPageChange when rows per page changes', async () => {
         const mockOnRowsPerPageChange = jest.fn().mockResolvedValue(undefined);
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               usePagination={true}
               onRowsPerPageChange={mockOnRowsPerPageChange}
            />
         );
         
         const rowsInput = screen.getByTestId('rows-per-page-input') as HTMLInputElement;
         fireEvent.change(rowsInput, { target: { value: '20' } });
         
         await waitFor(() => {
            expect(mockOnRowsPerPageChange).toHaveBeenCalledWith(20);
         });
      });
   });

   describe('See More functionality', () => {
      it('renders see more button when useSeeMorePage is true', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               useSeeMorePage={true}
               itemsPerPage={2}
            />
         );
         
         expect(screen.getByTestId('mui-button')).toBeInTheDocument();
         expect(screen.getByText('See More')).toBeInTheDocument();
      });

      it('does not render see more button when all items are shown', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               useSeeMorePage={true}
               itemsPerPage={10}
            />
         );
         
         expect(screen.queryByTestId('mui-button')).not.toBeInTheDocument();
      });

      it('calls onPageNav when see more button is clicked', async () => {
         const mockOnPageNav = jest.fn().mockResolvedValue(undefined);
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               useSeeMorePage={true}
               itemsPerPage={2}
               onPageNav={mockOnPageNav}
            />
         );
         
         const seeMoreButton = screen.getByTestId('mui-button');
         fireEvent.click(seeMoreButton);
         
         await waitFor(() => {
            expect(mockOnPageNav).toHaveBeenCalledWith(1);
         });
      });
   });

   describe('Row interactions', () => {
      it('calls onClickRow when row is clicked', () => {
         const mockOnClickRow = jest.fn();
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               onClickRow={mockOnClickRow}
            />
         );
         
         const firstRow = screen.getAllByTestId('table-base-row')[0];
         fireEvent.click(firstRow);
         
         expect(mockOnClickRow).toHaveBeenCalledWith(sampleItems[0]);
      });

      it('works without onClickRow handler', () => {
         expect(() => {
            render(
               <TableBase 
                  items={sampleItems} 
                  columnConfig={sampleColumnConfig} 
                  loading={false}
               />
            );
            
            const firstRow = screen.getAllByTestId('table-base-row')[0];
            fireEvent.click(firstRow);
         }).not.toThrow();
      });
   });

   describe('Column configuration', () => {
      it('filters columns with include prop', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               include={['name', 'email']}
            />
         );
         
         expect(screen.getByTestId('header-name')).toBeInTheDocument();
         expect(screen.getByTestId('header-email')).toBeInTheDocument();
         expect(screen.queryByTestId('header-age')).not.toBeInTheDocument();
      });

      it('filters columns with exclude prop', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               exclude={['age']}
            />
         );
         
         expect(screen.getByTestId('header-name')).toBeInTheDocument();
         expect(screen.getByTestId('header-email')).toBeInTheDocument();
         expect(screen.queryByTestId('header-age')).not.toBeInTheDocument();
      });

      it('works with custom column formatters', () => {
         const customColumnConfig: IColumnConfig[] = [
            { propKey: 'name', label: 'Name' },
            { 
               propKey: 'age', 
               label: 'Age', 
               format: (value) => `${value} years old`
            }
         ];
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={customColumnConfig} 
               loading={false}
            />
         );
         
         expect(screen.getByText('30 years old')).toBeInTheDocument();
      });
   });

   describe('Custom table item component', () => {
      it('uses CustomTableItem when provided', () => {
         const CustomTableItem = ({ item, onClick }: TableBaseRowProps) => (
            <tr data-testid="custom-table-item" onClick={onClick}>
               <td>{String(item?.name)} (Custom)</td>
            </tr>
         );
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               CustomTableItem={CustomTableItem}
            />
         );
         
         expect(screen.getAllByTestId('custom-table-item')).toHaveLength(3);
         expect(screen.getByText('John Doe (Custom)')).toBeInTheDocument();
      });
   });

   describe('Styling props', () => {
      it('applies elevation correctly', () => {
         mockParseElevation.mockReturnValue('elevation-xl');
         
         render(<TableBase items={[]} elevation="xl" />);
         
         expect(mockParseElevation).toHaveBeenCalledWith('xl');
      });

      it('applies padding correctly', () => {
         mockParsePadding.mockReturnValue('padding-l');
         
         render(<TableBase items={[]} padding="l" />);
         
         expect(mockParsePadding).toHaveBeenCalledWith('l');
      });

      it('applies radius correctly', () => {
         mockParseRadius.mockReturnValue('radius-m');
         
         render(<TableBase items={[]} radius="m" />);
         
         expect(mockParseRadius).toHaveBeenCalledWith('m');
      });

      it('applies borderLastRow class when true', () => {
         render(<TableBase items={[]} borderLastRow={true} />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'TableBase',
            'padding-none',
            'elevation-m',
            'radius-s',
            'border-last-row'
         ]);
      });

      it('does not apply borderLastRow class when false', () => {
         render(<TableBase items={[]} borderLastRow={false} />);
         
         expect(mockParseCSS).toHaveBeenCalledWith('', [
            'TableBase',
            'padding-none',
            'elevation-m',
            'radius-s',
            ''
         ]);
      });
   });

   describe('Table container configuration', () => {
      it('applies maxHeight to table container', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               maxHeight={500}
            />
         );
         
         const tableContainer = screen.getByTestId('table-container');
         expect(tableContainer).toHaveAttribute('sx');
      });

      it('uses default maxHeight when not provided', () => {
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
            />
         );
         
         const tableContainer = screen.getByTestId('table-container');
         expect(tableContainer).toBeInTheDocument();
      });
   });

   describe('Edge cases', () => {
      it('handles empty column config', () => {
         render(<TableBase items={sampleItems} columnConfig={[]} loading={false} />);
         
         expect(screen.getByTestId('table-body')).toBeInTheDocument();
      });

      it('handles undefined column config', () => {
         render(<TableBase items={sampleItems} loading={false} />);
         
         expect(screen.getByTestId('table-body')).toBeInTheDocument();
      });

      it('handles items with missing properties', () => {
         const incompleteItems = [
            { id: 1, name: 'John' },
            { id: 2, email: 'jane@example.com' }
         ];
         
         expect(() => {
            render(
               <TableBase 
                  items={incompleteItems} 
                  columnConfig={sampleColumnConfig} 
                  loading={false}
               />
            );
         }).not.toThrow();
      });
   });

   describe('Text resources integration', () => {
      it('uses text resources for see more button', () => {
         const mockGetText = jest.fn((key: string) => {
            if (key === 'TableBase.seeMoreButton') return 'Load More Data';
            return key;
         });
         
         mockUseTextResources.mockReturnValue({
            textResources: { getText: mockGetText }
         } as unknown as ReturnType<typeof useTextResources>);
         
         render(
            <TableBase 
               items={sampleItems} 
               columnConfig={sampleColumnConfig} 
               loading={false}
               useSeeMorePage={true}
               itemsPerPage={2}
            />
         );
         
         expect(screen.getByText('Load More Data')).toBeInTheDocument();
         expect(mockGetText).toHaveBeenCalledWith('TableBase.seeMoreButton');
      });
   });
});
