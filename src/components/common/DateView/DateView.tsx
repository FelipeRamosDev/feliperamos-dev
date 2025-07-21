import dayjs from 'dayjs';
import { DateViewProps } from './DateView.types';
import { parseCSS } from '@/helpers/parse.helpers';

export default function DateView({ className, type = 'abbMonth-fullYear', date, locale = 'en', ...props }: DateViewProps) {
   const spanProps = {
      ...props,
      className: parseCSS(className, [
         'DateView'
      ])
   };

   switch (type) {
      case 'locale-standard':
         return <span {...spanProps}>{dayjs(date).locale(locale).format('LL')}</span>;
      case 'abbMonth-fullYear':
         return <span {...spanProps}>{dayjs(date).locale(locale).format('MMM YYYY')}</span>;
      case 'fullMonth-fullYear':
         return <span {...spanProps}>{dayjs(date).locale(locale).format('MMMM YYYY')}</span>;
      case 'fullMonth-abbYear':
         return <span {...spanProps}>{dayjs(date).locale(locale).format('MMMM YY')}</span>;
      case 'abbMonth-abbYear':
         return <span {...spanProps}>{dayjs(date).locale(locale).format('MMM YY')}</span>;
      default:
         return null;
   }
};
