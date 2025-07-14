import { SizeKeyword } from '@/utils/parse';
import { ReactNode, CSSProperties } from 'react';

// Interface for column configuration
export interface IColumnConfig {
   id?: string;
   propKey: string;
   label: string;
   align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
   style?: CSSProperties;
   maxWidth?: number;
   minWidth?: number;
   format?: (value?: unknown, item?: unknown, config?: IColumnConfig) => ReactNode | string;
}

// Props for TableBase component
export interface TableBaseProps<TableItem> {
   className?: string;
   items?: TableItem[];
   elevation?: SizeKeyword;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   borderLastRow?: boolean;
   maxHeight?: number;
   hideHeader?: boolean;
   loading?: boolean;
   onClickRow?: (item: TableItem) => void;
   onPageNav?: (page: number) => Promise<void>;
   onRowsPerPageChange?: (rowsPerPage: number) => Promise<void>;
   itemsPerPage?: number;
   usePagination?: boolean;
   useSeeMorePage?: boolean;
   noDocumentsText?: string;
   columnConfig?: IColumnConfig[];
   CustomTableItem?: React.ComponentType<TableBaseRowProps>;
   include?: string[];
   exclude?: string[];
   [key: string]: unknown; // For additional props
}

// Props for TableBaseRow component
export interface TableBaseRowProps {
   item?: { [key: string]: unknown };
   columnConfig?: IColumnConfig[];
   onClick?: () => void;
   [key: string]: unknown; // For additional props
}

// Props for TableBaseHeader component
export interface TableBaseHeaderProps {
   columnConfig?: IColumnConfig[];
}

// Props for TooltipTableHead component
export interface TooltipTableHeadProps {
   children?: ReactNode;
   [key: string]: unknown; // For additional props
}
