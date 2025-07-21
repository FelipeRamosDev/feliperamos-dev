import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormDatePickerProps } from '../Form.types';
import { useForm } from '../Form';
import { parseCSS } from '@/helpers/parse.helpers';

export default function FormDatePicker({ className, fieldName, label, minDate, maxDate }: FormDatePickerProps): React.ReactElement {
   const { setFieldValue } = useForm();

   if (!fieldName) {
      console.warn('FormDatePicker requires a fieldName prop to function correctly.');
      return <></>;
   }

   return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
         <DatePicker
            className={parseCSS(className, 'FormDatePicker')}
            label={label}
            maxDate={maxDate}
            minDate={minDate}
            views={['year', 'month']}
            slotProps={{
               textField: {
                  variant: 'filled',
                  fullWidth: true,
                  className: parseCSS(className, 'FormDatePicker-textField'),
               },
            }}
            closeOnSelect
            onChange={(newValue) => {
               if (!newValue) return;
               setFieldValue(fieldName, newValue.toJSON());
            }}
         />
      </LocalizationProvider>
   );
}
