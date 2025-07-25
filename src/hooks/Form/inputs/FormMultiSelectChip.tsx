import { parseCSS } from '@/helpers/parse.helpers';
import { Box, Chip, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormMultiSelectChipProps, FormSelectOption } from '../Form.types';
import { useForm } from '../Form';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
   PaperProps: {
      style: {
         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
         width: 250,
      },
   },
};

export default function FormMultiSelectChip({
   id,
   className,
   fieldName,
   label,
   options = [],
   loadOptions,
   onChange = () => { }
}: FormMultiSelectChipProps): React.ReactElement {
   const { getValue, setFieldValue } = useForm();
   const [opts, setOpts] = useState(options);
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
   }, [loadOptions, fieldName]);

   if (!fieldName) {
      console.warn('FormSelect requires a fieldName prop to function correctly.');
      return <></>
   }

   const handleChange = (ev: { target: { value: unknown } }) => {
      setFieldValue(fieldName, ev.target.value);
      onChange(ev.target.value as (string | number)[]);
   }

   const getOption = (id: number | string) => {
      return opts.find((option: FormSelectOption) => String(option.value) === String(id));
   }

   return (
      <FormControl className={parseCSS(className, 'FormMultiSelectChip')} variant="filled">
         <InputLabel id={labelId}>{label}</InputLabel>

         <Select
            labelId={labelId}
            id={idPrefix}
            multiple
            value={getValue(fieldName) as number[] || []}
            onChange={handleChange}
            MenuProps={MenuProps}
            renderValue={(selected: number[]) => (
               <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value: string | number, index: number) => {
                     const option: FormSelectOption | undefined = getOption(value);

                     if (!option) return null;
                     return <Chip key={option?.value + String(index) + idPrefix} label={option?.label} />
                  })}
               </Box>
            )}
         >
            {opts.map(({ value, label }) => (
               <MenuItem
                  key={label}
                  value={value}
               >
                  {label}
               </MenuItem>
            ))}
         </Select>
      </FormControl>
   );
}
