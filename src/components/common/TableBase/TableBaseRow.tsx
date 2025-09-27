import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { TableBaseRowProps } from './TableBase.types';

/**
 * A table row component used in `TableBase` for rendering data items.
 * It maps over header configurations to render cells based on provided formatting functions.
 */
export default function TableBaseRow<T>({ item, columnConfig = [], ...props }: TableBaseRowProps<T>): React.JSX.Element {
   if (!item) {
      return <></>;
   }

   return (
      <TableRow hover sx={{ position: 'relative' }} role="checkbox" tabIndex={-1} {...props}>
         {columnConfig.map((config, index) => (
            <TableCell key={index} align={config.align} style={{ maxWidth: config.maxWidth, minWidth: config.minWidth, ...config.style }}>
               {config.format ? (
                  config.format((item as T)[config.propKey as keyof T], item, config)
               ) : (
                  String((item as T)[config.propKey as keyof T] ?? '')
               )}
            </TableCell>
         ))}
      </TableRow>
   );
}
