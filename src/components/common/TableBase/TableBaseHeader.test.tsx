import { render, screen } from '@testing-library/react';
import TableBaseHeader from './TableBaseHeader';
import { IColumnConfig } from './TableBase.types';

// Mock Material-UI components
jest.mock('@mui/material/TableHead', () => {
   return function MockTableHead({ children }: { children: React.ReactNode }) {
      return <thead data-testid="table-head">{children}</thead>;
   };
});

jest.mock('@mui/material/TableRow', () => {
   return function MockTableRow({ children }: { children: React.ReactNode }) {
      return <tr data-testid="table-row">{children}</tr>;
   };
});

jest.mock('@mui/material/TableCell', () => {
   return function MockTableCell({ 
      children, 
      align, 
      style 
   }: { 
      children: React.ReactNode;
      align?: string;
      style?: React.CSSProperties;
   }) {
      return (
         <th 
            data-testid="table-cell"
            data-align={align}
            data-style={JSON.stringify(style)}
         >
            {children}
         </th>
      );
   };
});

// Mock TableColumnConfig
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

const mockColumnConfig: IColumnConfig[] = [
   {
      propKey: 'name',
      label: 'Full Name',
      align: 'left',
      minWidth: 150
   },
   {
      propKey: 'email',
      label: 'Email Address',
      align: 'center',
      maxWidth: 200,
      style: { fontWeight: 'bold' }
   },
   {
      propKey: 'age',
      label: 'Age',
      align: 'right',
      minWidth: 80,
      maxWidth: 100
   }
];

describe('TableBaseHeader', () => {
   it('renders table header structure correctly', () => {
      render(<TableBaseHeader columnConfig={mockColumnConfig} />);

      expect(screen.getByTestId('table-head')).toBeInTheDocument();
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.getAllByTestId('table-cell')).toHaveLength(3);
   });

   it('renders column labels correctly', () => {
      render(<TableBaseHeader columnConfig={mockColumnConfig} />);

      expect(screen.getByText('Full Name')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
   });

   it('applies correct alignment to columns', () => {
      render(<TableBaseHeader columnConfig={mockColumnConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveAttribute('data-align', 'left');
      expect(cells[1]).toHaveAttribute('data-align', 'center');
      expect(cells[2]).toHaveAttribute('data-align', 'right');
   });

   it('applies custom styles correctly', () => {
      render(<TableBaseHeader columnConfig={mockColumnConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      
      // First cell should have minWidth
      const firstCellStyle = JSON.parse(cells[0].getAttribute('data-style') || '{}');
      expect(firstCellStyle).toMatchObject({
         minWidth: 150
      });

      // Second cell should have custom style, maxWidth
      const secondCellStyle = JSON.parse(cells[1].getAttribute('data-style') || '{}');
      expect(secondCellStyle).toMatchObject({
         fontWeight: 'bold',
         maxWidth: 200
      });

      // Third cell should have both minWidth and maxWidth
      const thirdCellStyle = JSON.parse(cells[2].getAttribute('data-style') || '{}');
      expect(thirdCellStyle).toMatchObject({
         minWidth: 80,
         maxWidth: 100
      });
   });

   it('handles empty column config', () => {
      render(<TableBaseHeader columnConfig={[]} />);

      expect(screen.getByTestId('table-head')).toBeInTheDocument();
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('table-cell')).toHaveLength(0);
   });

   it('handles undefined column config', () => {
      render(<TableBaseHeader />);

      expect(screen.getByTestId('table-head')).toBeInTheDocument();
      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('table-cell')).toHaveLength(0);
   });

   it('uses propKey as key when id is not provided', () => {
      const configWithoutId: IColumnConfig[] = [
         {
            propKey: 'username',
            label: 'Username'
         }
      ];

      render(<TableBaseHeader columnConfig={configWithoutId} />);

      expect(screen.getByText('Username')).toBeInTheDocument();
   });

   it('uses custom id when provided', () => {
      const configWithId: IColumnConfig[] = [
         {
            id: 'custom-id',
            propKey: 'username',
            label: 'Username'
         }
      ];

      render(<TableBaseHeader columnConfig={configWithId} />);

      expect(screen.getByText('Username')).toBeInTheDocument();
   });

   it('handles columns with only required props', () => {
      const minimalConfig: IColumnConfig[] = [
         {
            propKey: 'title',
            label: 'Title'
         }
      ];

      render(<TableBaseHeader columnConfig={minimalConfig} />);

      const cell = screen.getByTestId('table-cell');
      expect(cell).toHaveAttribute('data-align', 'left'); // Default align
      expect(screen.getByText('Title')).toBeInTheDocument();
   });

   it('handles mixed column configurations', () => {
      const mixedConfig: IColumnConfig[] = [
         {
            propKey: 'simple',
            label: 'Simple Column'
         },
         {
            id: 'complex-col',
            propKey: 'complex',
            label: 'Complex Column',
            align: 'center',
            minWidth: 120,
            maxWidth: 300,
            style: { 
               backgroundColor: 'lightgray',
               padding: '8px'
            }
         }
      ];

      render(<TableBaseHeader columnConfig={mixedConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells).toHaveLength(2);
      
      // Simple column
      expect(cells[0]).toHaveAttribute('data-align', 'left');
      expect(screen.getByText('Simple Column')).toBeInTheDocument();

      // Complex column
      expect(cells[1]).toHaveAttribute('data-align', 'center');
      const complexCellStyle = JSON.parse(cells[1].getAttribute('data-style') || '{}');
      expect(complexCellStyle).toMatchObject({
         backgroundColor: 'lightgray',
         padding: '8px',
         minWidth: 120,
         maxWidth: 300
      });
      expect(screen.getByText('Complex Column')).toBeInTheDocument();
   });

   it('handles columns with all alignment options', () => {
      const alignmentConfig: IColumnConfig[] = [
         { propKey: 'left', label: 'Left', align: 'left' },
         { propKey: 'center', label: 'Center', align: 'center' },
         { propKey: 'right', label: 'Right', align: 'right' },
         { propKey: 'justify', label: 'Justify', align: 'justify' },
         { propKey: 'inherit', label: 'Inherit', align: 'inherit' }
      ];

      render(<TableBaseHeader columnConfig={alignmentConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveAttribute('data-align', 'left');
      expect(cells[1]).toHaveAttribute('data-align', 'center');
      expect(cells[2]).toHaveAttribute('data-align', 'right');
      expect(cells[3]).toHaveAttribute('data-align', 'justify');
      expect(cells[4]).toHaveAttribute('data-align', 'inherit');
   });

   it('combines all style properties correctly', () => {
      const styleConfig: IColumnConfig[] = [
         {
            propKey: 'styled',
            label: 'Styled Column',
            align: 'center',
            minWidth: 100,
            maxWidth: 200,
            style: {
               color: 'blue',
               fontSize: '14px'
            }
         }
      ];

      render(<TableBaseHeader columnConfig={styleConfig} />);

      const cell = screen.getByTestId('table-cell');
      const cellStyle = JSON.parse(cell.getAttribute('data-style') || '{}');
      expect(cellStyle).toMatchObject({
         color: 'blue',
         fontSize: '14px',
         minWidth: 100,
         maxWidth: 200
      });
   });
});
