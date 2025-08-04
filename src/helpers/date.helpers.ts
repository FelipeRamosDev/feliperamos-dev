import { defaultLanguage } from '@/app.config';
import { DateViewStringType } from '@/types/helpers.types';
import dayjs from 'dayjs';

export function dateDifference(startDate: Date, endDate: Date, unit: 'year' | 'month' | 'day'): number {
   const _startDate = dayjs(startDate);
   const _endDate = dayjs(endDate);

   switch (unit) {
      case 'year':
         const years = _endDate.diff(_startDate, 'year');
         return years;
      case 'month':
         const months = _endDate.diff(_startDate, 'month');
         return months;
      case 'day':
         const days = _endDate.diff(_startDate, 'day');
         return days;
      default:
         return 0;
   }
}

export function dataViewString(date: Date, type: DateViewStringType = 'abbMonth-fullYear', locale: string = defaultLanguage): string {
   if (!date) {
      return '---';
   }

   switch (type) {
      case 'locale-standard':
         return dayjs(date).locale(locale).format('LL');
      case 'abbMonth-fullYear':
         return dayjs(date).locale(locale).format('MMM YYYY');
      case 'fullMonth-fullYear':
         return dayjs(date).locale(locale).format('MMMM YYYY');
      case 'fullMonth-abbYear':
         return dayjs(date).locale(locale).format('MMMM YY');
      case 'abbMonth-abbYear':
         return dayjs(date).locale(locale).format('MMM YY');
      default:
         console.warn(`Unknown date view type: ${type}`);
         return '';
   }
};

export function dateDiffYearMonth(startDate: string, endDate: string): { year: number, month: number } {
   const years = dateDifference(new Date(startDate), new Date(endDate), 'year');
   const months = dateDifference(new Date(startDate), new Date(endDate), 'month');
   const restMonths = months % 12;

   return {
      year: years,
      month: restMonths
   };
}

