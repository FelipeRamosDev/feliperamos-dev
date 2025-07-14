import { CSSProperties, ReactNode } from 'react';
import { IColumnConfig } from '@/components/common/TableBase/TableBase.types';

/**
 * Column configuration class for table headers
 */
export default class TableColumnConfig implements IColumnConfig {
  id?: string;
  propKey: string;
  label: string;
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit';
  style?: CSSProperties;
  format?: (value: unknown, item: unknown, config: IColumnConfig) => ReactNode;

  constructor(config: Partial<IColumnConfig> & { propKey: string; label: string; format?: (value: unknown, item: unknown, config: IColumnConfig) => ReactNode }) {
    this.id = config.id || config.propKey;
    this.propKey = config.propKey;
    this.label = config.label;
    this.align = config.align || 'left';
    this.style = config.style;
    this.format = config.format;
  }
}
