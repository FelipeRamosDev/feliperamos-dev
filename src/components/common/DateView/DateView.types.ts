export interface DateViewProps {
   className?: string | string[];
   date: Date | string | number | undefined;
   locale?: string;
   type?: 'locale-standard' | 'abbMonth-fullYear' | 'fullMonth-fullYear' | 'fullMonth-abbYear' | 'abbMonth-abbYear';
}
