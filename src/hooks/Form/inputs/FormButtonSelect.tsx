import { Button } from '@mui/material';
import { FormButtonSelectProps, FormSelectOption } from '../Form.types';
import { useForm } from '../Form';
import { parseCSS } from '@/helpers/parse.helpers';

export default function FormButtonSelect({ className, label, fieldName, options, onSelect = () => {}}: FormButtonSelectProps): React.ReactElement {
   const { getValue, setFieldValue } = useForm();
   const CSS = parseCSS(className, 'FormButtonSelect');

   if (!fieldName) {
      console.warn('FormButtonSelect requires a fieldName prop to function correctly.');
      return <></>;
   }

   const currentValue = getValue(fieldName);
   const isSelected = (value: string | number) => (currentValue === value) ? 'selected' : '';
   const handleChange = (value: string | number) => {
      setFieldValue(fieldName, value);
      onSelect(value);
   };

   return (
      <div className={CSS}>
         {label && <label className="FormButtonSelect-label">{label}</label>}

         <div className="FormButtonSelect-options" data-testid={`formbuttonselect-${fieldName}`}>
            {options.map((option: FormSelectOption) => (
               <Button
                  key={option.value}
                  onClick={() => handleChange(option.value)}
                  className={parseCSS(className, [
                     'FormButtonSelect-option',
                     isSelected(option.value),
                  ])}
               >
                  {option.label}
               </Button>
            ))}
         </div>
      </div>
   );
}
