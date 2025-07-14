'use client';
import React, { useState, useRef } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import TableBaseRow from './TableBaseRow';
import TableBaseHeader from './TableBaseHeader';
import TableColumnConfig from '@/components/common/TableBase/TableColumnConfig';
import { Spinner } from '@/components/common';
import { Button } from '@mui/material';
import { TableBaseProps, IColumnConfig } from './TableBase.types';
import { parseCSS, parseElevation, parsePadding, parseRadius } from '@/utils/parse';

/**
 * A reusable table component that handles pagination, loading states, and customizable rows and headers.
 */
export default function TableBase<T>({
   className = '',
   items = [],
   borderLastRow = true,
   elevation = 'm',
   padding = 'none',
   radius = 's',
   maxHeight = 886,
   hideHeader = false,
   loading = true,
   onClickRow = () => { },
   onPageNav = async () => { },
   onRowsPerPageChange = async () => { },
   itemsPerPage = 10,
   usePagination = false,
   useSeeMorePage = false,
   noDocumentsText = `There is no documents to list!`,
   columnConfig,
   CustomTableItem,
   include,
   exclude,
   ...props
}: TableBaseProps<T>): React.JSX.Element {
   const [page, setPage] = useState<number>(0);
   const [rowsPerPage, setRowsPerPage] = useState<number>(itemsPerPage);
   const slicedSlots: T[] = useSeeMorePage ? items : items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
   const TableItem = CustomTableItem || TableBaseRow;
   const rowsPerPageCount = useRef<number>(rowsPerPage);
   const tableContainer = useRef<HTMLDivElement>(null);
   let disableSeeMore: boolean = false;

   const CSS = parseCSS(className, [
      'TableBase',
      parsePadding(padding),
      parseElevation(elevation),
      parseRadius(radius),
      borderLastRow ? 'border-last-row' : '',
   ]);

   if (!rowsPerPageCount.current) {
      rowsPerPageCount.current = rowsPerPage;
   }

   if (items.length < ((page + 1) * itemsPerPage)) {
      disableSeeMore = true;
   }

   const rowsPerPageOptions: number[] = [1, 2, 3, 4, 5, 6].map((_, index) => rowsPerPageCount.current! * (index + 1));

   const handleChangePage = async (event: unknown, newPage: number): Promise<void> => {
      await onPageNav(newPage);
      setPage(newPage);
   }

   const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const newValue = +event.target.value;

      await onRowsPerPageChange(newValue);
      setRowsPerPage(newValue);
   }

   let processedcolumnConfig: IColumnConfig[] = columnConfig || [];

   if (Array.isArray(include)) {
      processedcolumnConfig = processedcolumnConfig.filter(item => include.some(inc => inc === item.propKey));
   }

   if (Array.isArray(exclude)) {
      processedcolumnConfig = processedcolumnConfig.filter(item => !exclude.some(exc => exc === item.propKey));
   }

   processedcolumnConfig = processedcolumnConfig.map(item => new TableColumnConfig(item));

   return <div className={CSS} {...props}>
      {loading && <Spinner wrapperHeight="20rem" />}

      {!loading && <TableContainer ref={tableContainer} sx={{ maxHeight }}>
         <Table stickyHeader>
            {!hideHeader && <TableBaseHeader columnConfig={processedcolumnConfig} />}

            <TableBody>
               {(slicedSlots.length > 0) && (
                  slicedSlots.map((item: T) => (
                     <TableItem
                        key={Math.random()}
                        item={item as { [key: string]: unknown }}
                        columnConfig={processedcolumnConfig}
                        onClick={() => onClickRow(item)}
                     />
                  )
                  ))}
            </TableBody>
         </Table>
      </TableContainer>}


      {(!loading && !slicedSlots.length) && (
         <div className="no-items">
            <p>{noDocumentsText}</p>
         </div>
      )}

      {usePagination && (
         <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={items.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
         />
      )}

      {useSeeMorePage && !disableSeeMore && (
         <Button
            className="seemore-button"
            color="primary"
            variant="contained"
            fullWidth={true}
            onClick={(ev) => handleChangePage(ev, page + 1)}
         >
            See More
         </Button>
      )}
   </div>;
}
