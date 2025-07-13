import { SizeKeyword } from '@/utils/parse';
import { ReactNode, CSSProperties } from 'react';

// Interface for column configuration
export interface IColumnConfig {
   id?: string;
   propKey: string;
   label: string;
   align?: 'left' | 'center' | 'right' | 'justify' | 'inherit';
   style?: CSSProperties;
   format?: (value: any, item: any, config: IColumnConfig) => ReactNode;
}

// Props for TableBase component
export interface TableBaseProps {
   className?: string;
   items?: any[];
   elevation?: SizeKeyword;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   borderLastRow?: boolean;
   maxHeight?: number;
   hideHeader?: boolean;
   loading?: boolean;
   onClickRow?: (item: any) => void;
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
   [key: string]: any; // For additional props
}

// Props for TableBaseRow component
export interface TableBaseRowProps {
   item?: any;
   columnConfig?: IColumnConfig[];
   onClick?: () => void;
   [key: string]: any; // For additional props
}

// Props for TableBaseHeader component
export interface TableBaseHeaderProps {
   columnConfig?: IColumnConfig[];
}

// Props for TooltipTableHead component
export interface TooltipTableHeadProps {
   children?: ReactNode;
   [key: string]: any; // For additional props
}

