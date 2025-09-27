import { CSSProperties, ReactNode } from 'react';
import { IColumnConfig } from '@/components/common/TableBase/TableBase.types';

/**
 * Column configuration class for table headers
 */
export default class TableColumnConfig<T> implements IColumnConfig<T> {
  id?: string;
  propKey: string;
  label: string;
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  style?: CSSProperties;
  maxWidth?: number;
  minWidth?: number;
  format?: (value?: T[keyof T], item?: T, config?: IColumnConfig<T>) => ReactNode;

  constructor(config: IColumnConfig<T>) {
    this.id = config.id || config.propKey;
    this.propKey = config.propKey;
    this.label = config.label;
    this.align = config.align || 'left';
    this.style = config.style;
    this.maxWidth = config.maxWidth;
    this.minWidth = config.minWidth;
    this.format = config.format;
  }
}
