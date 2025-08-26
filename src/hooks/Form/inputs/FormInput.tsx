import { TextField } from '@mui/material'
import { useForm } from '../Form';
import React from 'react';
import { FormInputProps } from '../Form.types';
import { parseCSS } from '@/helpers/parse.helpers';

export default function FormInput({
   id,
   className = '',
   fieldName = '',
   label = '',
   type = 'text',
   multiline,
   minRows = 5,
   min = 1,
   max = 10,
   numberStep = 1,
   parseInput = (value: string | number) => value,
   onChange = () => {},
   ...props
}: FormInputProps): React.ReactElement {
   const { values, setFieldValue } = useForm();
   const currentValue = values[fieldName];
   const elmValue = (currentValue === undefined || currentValue === null) ? '' : currentValue;

   const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && ev.target.value !== '') {
         const parsedValue = parseInput(Number(ev.target.value));
         setFieldValue(fieldName, parsedValue);
      } else {
         const parsedValue = parseInput(ev.target.value);
         setFieldValue(fieldName, parsedValue);
      }

      onChange(ev.target.value as string | number);
   };

   return (
      <TextField
         id={id || `forminput-${fieldName}`}
         data-testid={id || `forminput-${fieldName}`}
         className={parseCSS(className, 'FormInput')}
         variant="filled"
         type={type}
         name={fieldName}
         label={label}
         value={elmValue}
         multiline={multiline}
         minRows={minRows}
         onChange={handleChange}
         {...(type === 'number' ? { inputProps: { min, max, step: numberStep } } : {})}
         {...props}
      />
   );
}
