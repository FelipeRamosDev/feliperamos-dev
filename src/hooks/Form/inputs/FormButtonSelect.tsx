import { Button } from '@mui/material';
import { FormButtonSelectProps } from '../Form.types';
import { useForm } from '../Form';
import { parseCSS } from '@/utils/parse';

export default function FormButtonSelect({ className, label, fieldName, options, onSelect = () => {}}: FormButtonSelectProps): React.ReactElement {
   const { getValue, setFieldValue } = useForm();
   const CSS = parseCSS(className, 'FormButtonSelect');

   if (!fieldName) {
      console.warn('FormButtonSelect requires a fieldName prop to function correctly.');
      return <></>;
   }

   const currentValue = getValue(fieldName);
   const isSelected = (value: string) => (currentValue === value) ? 'selected' : '';
   const handleChange = (value: string) => {
      setFieldValue(fieldName, value);
      onSelect(value);
   };

   return (
      <div className={CSS}>
         {label && <label className="FormButtonSelect-label">{label}</label>}

         <div className="FormButtonSelect-options" data-testid={`formbuttonselect-${fieldName}`}>
            {options.map((option) => (
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
