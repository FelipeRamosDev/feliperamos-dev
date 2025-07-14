import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { TableBaseRowProps } from './TableBase.types';

/**
 * A table row component used in `TableBase` for rendering data items.
 * It maps over header configurations to render cells based on provided formatting functions.
 */
export default function TableBaseRow({ item, columnConfig = [], ...props }: TableBaseRowProps): React.JSX.Element {
   if (!item) {
      return <></>;
   }

   return (
      <TableRow hover sx={{ position: 'relative' }} role="checkbox" tabIndex={-1} {...props}>
         {columnConfig.map(config => (
            <TableCell key={Math.random()} align={config.align} style={config.style}>
               {config.format ? (
                  config.format(item[config.propKey], item, config)
               ) : (
                  String(item[config.propKey] ?? '')
               )}
            </TableCell>
         ))}
      </TableRow>
   );
}
