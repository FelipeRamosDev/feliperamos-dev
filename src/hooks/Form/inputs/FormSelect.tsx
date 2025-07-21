import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useForm } from '../Form';
import { FormSelectProps } from '../Form.types';
import { useEffect, useRef, useState } from 'react';
import { parseCSS } from '@/helpers/parse.helpers';

export default function FormSelect({
   id,
   className,
   fieldName,
   label,
   disableNone = false,
   options = [],
   loadOptions,
   onChange = () => {},
   ...props
}: FormSelectProps): React.ReactElement {
   const { getValue, setFieldValue } = useForm();
   const [ opts, setOpts ] = useState(options);
   const isLoaded = useRef<boolean>(false);

   const idPrefix = id || fieldName;
   const labelId = `${idPrefix}-label`;

   useEffect(() => {
      if (isLoaded.current || typeof loadOptions !== 'function' || !fieldName) return;

      isLoaded.current = true;
      loadOptions().then((loadedOptions) => {
         setOpts(loadedOptions);
      }).catch((error) => {
         console.error('Failed to load options:', error);
      });
   }, [ loadOptions, fieldName ]);

   if (!fieldName) {
      console.warn('FormSelect requires a fieldName prop to function correctly.');
      return <></>
   }

   const handleChange = (ev: { target: { value: unknown } }) => {
      setFieldValue(fieldName, ev.target.value);
      onChange(ev.target.value as string | number);
   }

   return (
      <FormControl className={parseCSS(className, 'FormSelect')} variant="filled" {...props}>
         <InputLabel id={labelId}>{label}</InputLabel>
         <Select
            labelId={labelId}
            id={idPrefix}
            name={fieldName}
            title={label}
            value={getValue(fieldName) || ''}
            onChange={handleChange}
         >
            <MenuItem value="" disabled={disableNone}>
               <em>None</em>
            </MenuItem>

            {opts.map((option) => (
               <MenuItem key={option.value} value={option.value}>
                  {option.label}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );
}
