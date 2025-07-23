import { HTMLAttributes } from 'react';

export interface DateViewProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'className'> {
   className?: string | string[];
   date: Date | string | number | undefined;
   locale?: string;
   type?: 'locale-standard' | 'abbMonth-fullYear' | 'fullMonth-fullYear' | 'fullMonth-abbYear' | 'abbMonth-abbYear';
}
