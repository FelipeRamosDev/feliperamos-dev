import { TextField } from '@mui/material'
import { useForm } from './Form';
import React from 'react';
import { FormInputProps } from './Form.types';

export default function FormInput({
   id,
   fieldName = '',
   label = '',
   type = 'text',
   multiline,
   ...props
}: FormInputProps): React.ReactElement {
   const { values, setFieldValue } = useForm();
   const currentValue = values[fieldName];
   const elmValue = (currentValue === undefined || currentValue === null) ? '' : currentValue;

   const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && ev.target.value !== '') {
         setFieldValue(fieldName, Number(ev.target.value));
      } else {
         setFieldValue(fieldName, ev.target.value);
      }
   };

   return (
      <TextField
         id={id || `forminput-${fieldName}`}
         data-testid={id || `forminput-${fieldName}`}
         className="FormInput"
         variant="filled"
         type={type}
         name={fieldName}
         label={label}
         value={elmValue}
         multiline={multiline}
         onChange={handleChange}
         {...props}
      />
   );
}
