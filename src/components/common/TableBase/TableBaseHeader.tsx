import React from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableColumnConfig from '@/components/common/TableBase/TableColumnConfig';
import { IColumnConfig, TableBaseHeaderProps } from './TableBase.types';

/**
 * A header component for tables, used in `TableBase` to render the table headers.
 * It maps over header configurations to generate table header cells with labels and styles.
 */
export default function TableBaseHeader({ columnConfig = [] }: TableBaseHeaderProps): React.JSX.Element {
   return <TableHead>
      <TableRow>
         {columnConfig.map((column: IColumnConfig) => {
            const config = new TableColumnConfig(column);

            return <TableCell
               key={config.id}
               align={config.align}
               style={config.style}
            >
               {config.label}
            </TableCell>
         })}
      </TableRow>
   </TableHead>;
}
