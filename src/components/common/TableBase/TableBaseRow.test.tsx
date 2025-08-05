import { render, screen, fireEvent } from '@testing-library/react';
import TableBaseRow from './TableBaseRow';
import { IColumnConfig } from './TableBase.types';
import React from 'react';

// Mock Material-UI components
jest.mock('@mui/material/TableRow', () => {
   return function MockTableRow({ 
      children, 
      hover,
      sx,
      role,
      tabIndex,
      onClick,
      ...props 
   }: { 
      children: React.ReactNode;
      hover?: boolean;
      sx?: Record<string, unknown>;
      role?: string;
      tabIndex?: number;
      onClick?: () => void;
   }) {
      return (
         <tr 
            data-testid="table-row"
            data-hover={hover}
            data-role={role}
            data-tabindex={tabIndex}
            data-sx={JSON.stringify(sx)}
            onClick={onClick}
            {...props}
         >
            {children}
         </tr>
      );
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
         <td 
            data-testid="table-cell"
            data-align={align}
            data-style={JSON.stringify(style)}
         >
            {children}
         </td>
      );
   };
});

const mockItem = {
   id: 1,
   name: 'John Doe',
   email: 'john@example.com',
   age: 30,
   isActive: true
};

const mockColumnConfig: IColumnConfig[] = [
   {
      propKey: 'name',
      label: 'Name',
      align: 'left'
   },
   {
      propKey: 'email',
      label: 'Email',
      align: 'center',
      minWidth: 200
   },
   {
      propKey: 'age',
      label: 'Age',
      align: 'right',
      maxWidth: 80,
      style: { fontWeight: 'bold' }
   }
];

describe('TableBaseRow', () => {
   it('renders table row structure correctly', () => {
      render(<TableBaseRow item={mockItem} columnConfig={mockColumnConfig} />);

      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.getAllByTestId('table-cell')).toHaveLength(3);
   });

   it('renders item data correctly', () => {
      render(<TableBaseRow item={mockItem} columnConfig={mockColumnConfig} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
   });

   it('applies correct alignment to cells', () => {
      render(<TableBaseRow item={mockItem} columnConfig={mockColumnConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveAttribute('data-align', 'left');
      expect(cells[1]).toHaveAttribute('data-align', 'center');
      expect(cells[2]).toHaveAttribute('data-align', 'right');
   });

   it('applies custom styles correctly', () => {
      render(<TableBaseRow item={mockItem} columnConfig={mockColumnConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      
      // First cell should have no special styling
      const firstCellStyle = JSON.parse(cells[0].getAttribute('data-style') || '{}');
      expect(firstCellStyle).toEqual({});

      // Second cell should have minWidth
      const secondCellStyle = JSON.parse(cells[1].getAttribute('data-style') || '{}');
      expect(secondCellStyle).toMatchObject({
         minWidth: 200
      });

      // Third cell should have maxWidth and custom style
      const thirdCellStyle = JSON.parse(cells[2].getAttribute('data-style') || '{}');
      expect(thirdCellStyle).toMatchObject({
         maxWidth: 80,
         fontWeight: 'bold'
      });
   });

   it('handles column formatting functions', () => {
      const formatConfig: IColumnConfig[] = [
         {
            propKey: 'name',
            label: 'Name',
            format: (value) => `Mr. ${value}`
         },
         {
            propKey: 'age',
            label: 'Age',
            format: (value) => `${value} years old`
         },
         {
            propKey: 'isActive',
            label: 'Status',
            format: (value) => value ? 'Active' : 'Inactive'
         }
      ];

      render(<TableBaseRow item={mockItem} columnConfig={formatConfig} />);

      expect(screen.getByText('Mr. John Doe')).toBeInTheDocument();
      expect(screen.getByText('30 years old')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
   });

   it('handles missing property values', () => {
      const itemWithMissingProps = {
         id: 1,
         name: 'John Doe'
         // missing email and age
      };

      render(<TableBaseRow item={itemWithMissingProps} columnConfig={mockColumnConfig} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      
      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveTextContent('John Doe');
      expect(cells[1]).toHaveTextContent(''); // Empty string for missing email
      expect(cells[2]).toHaveTextContent(''); // Empty string for missing age
   });

   it('handles null and undefined values', () => {
      const itemWithNullValues = {
         id: 1,
         name: null,
         email: undefined,
         age: 0
      };

      render(<TableBaseRow item={itemWithNullValues} columnConfig={mockColumnConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveTextContent(''); // null becomes empty string
      expect(cells[1]).toHaveTextContent(''); // undefined becomes empty string
      expect(cells[2]).toHaveTextContent('0'); // 0 is preserved
   });

   it('returns empty fragment when item is null', () => {
      const { container } = render(<TableBaseRow item={null as unknown as { [key: string]: unknown }} columnConfig={mockColumnConfig} />);
      
      expect(container.firstChild).toBeNull();
   });

   it('returns empty fragment when item is undefined', () => {
      const { container } = render(<TableBaseRow item={undefined} columnConfig={mockColumnConfig} />);
      
      expect(container.firstChild).toBeNull();
   });

   it('handles empty column config', () => {
      render(<TableBaseRow item={mockItem} columnConfig={[]} />);

      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('table-cell')).toHaveLength(0);
   });

   it('handles undefined column config', () => {
      render(<TableBaseRow item={mockItem} />);

      expect(screen.getByTestId('table-row')).toBeInTheDocument();
      expect(screen.queryAllByTestId('table-cell')).toHaveLength(0);
   });

   it('applies table row props correctly', () => {
      render(<TableBaseRow item={mockItem} columnConfig={mockColumnConfig} />);

      const row = screen.getByTestId('table-row');
      expect(row).toHaveAttribute('data-hover', 'true');
      expect(row).toHaveAttribute('data-role', 'checkbox');
      expect(row).toHaveAttribute('data-tabindex', '-1');
      
      const sx = JSON.parse(row.getAttribute('data-sx') || '{}');
      expect(sx).toMatchObject({
         position: 'relative'
      });
   });

   it('forwards additional props to TableRow', () => {
      const handleClick = jest.fn();
      
      render(
         <TableBaseRow 
            item={mockItem} 
            columnConfig={mockColumnConfig}
            onClick={handleClick}
            data-custom-prop="custom-value"
         />
      );

      const row = screen.getByTestId('table-row');
      expect(row).toHaveAttribute('data-custom-prop', 'custom-value');
      
      fireEvent.click(row);
      expect(handleClick).toHaveBeenCalledTimes(1);
   });

   it('handles complex formatting with all parameters', () => {
      const complexFormatConfig: IColumnConfig[] = [
         {
            propKey: 'name',
            label: 'Name',
            format: (value, item, config) => {
               // Uses all three parameters: value, item, config
               return `${config?.label}: ${value} (ID: ${(item as { [key: string]: unknown })?.id})`;
            }
         }
      ];

      render(<TableBaseRow item={mockItem} columnConfig={complexFormatConfig} />);

      expect(screen.getByText('Name: John Doe (ID: 1)')).toBeInTheDocument();
   });

   it('handles items with nested properties', () => {
      const nestedItem = {
         id: 1,
         user: {
            name: 'John Doe',
            profile: {
               email: 'john@example.com'
            }
         }
      };

      const nestedConfig: IColumnConfig[] = [
         {
            propKey: 'user',
            label: 'User',
            format: (value) => (value as { name?: string })?.name || 'N/A'
         }
      ];

      render(<TableBaseRow item={nestedItem} columnConfig={nestedConfig} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
   });

   it('handles boolean values correctly', () => {
      const booleanItem = {
         isActive: true,
         isVerified: false,
         isPremium: null
      };

      const booleanConfig: IColumnConfig[] = [
         { propKey: 'isActive', label: 'Active' },
         { propKey: 'isVerified', label: 'Verified' },
         { propKey: 'isPremium', label: 'Premium' }
      ];

      render(<TableBaseRow item={booleanItem} columnConfig={booleanConfig} />);

      const cells = screen.getAllByTestId('table-cell');
      expect(cells[0]).toHaveTextContent('true');
      expect(cells[1]).toHaveTextContent('false');
      expect(cells[2]).toHaveTextContent(''); // null becomes empty
   });

   it('uses array index as key for cells', () => {
      const configWithoutIds: IColumnConfig[] = [
         { propKey: 'name', label: 'Name' },
         { propKey: 'email', label: 'Email' }
      ];

      render(<TableBaseRow item={mockItem} columnConfig={configWithoutIds} />);

      // Component should render without errors (keys work properly)
      expect(screen.getAllByTestId('table-cell')).toHaveLength(2);
   });
});
