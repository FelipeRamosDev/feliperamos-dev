import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useForm } from '../Form';
import { FormSelectProps } from '../Form.types';

export default function FormSelect({ id, fieldName, label, options, onChange = () => {}, ...props }: FormSelectProps): React.ReactElement {
   const { getValue, setFieldValue } = useForm();

   const idPrefix = id || fieldName;
   const labelId = `${idPrefix}-label`;

   if (!fieldName) {
      console.warn('FormSelect requires a fieldName prop to function correctly.');
      return <></>
   }

   const handleChange = (ev: { target: { value: unknown } }) => {
      setFieldValue(fieldName, ev.target.value);
      onChange(ev.target.value as string | number);
   }

   return (
      <FormControl className="FormSelect" variant="filled" {...props}>
         <InputLabel id={labelId}>{label}</InputLabel>
         <Select
            labelId={labelId}
            id={idPrefix}
            name={fieldName}
            title={label}
            value={getValue(fieldName) || ''}
            onChange={handleChange}
         >
            <MenuItem value="">
               <em>None</em>
            </MenuItem>

            {options.map((option) => (
               <MenuItem key={option.value} value={option.value}>
                  {option.label}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );
}
