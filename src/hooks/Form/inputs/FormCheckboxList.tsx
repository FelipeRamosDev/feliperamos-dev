import { Avatar, Checkbox, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useForm } from '../Form';
import { FormCheckboxListProps } from '../Form.types';
import { useEffect, useState } from 'react';
import { parseCSS } from '@/helpers/parse.helpers';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { Card } from '@/components/common';

export default function FormCheckboxList({ className, label, fieldName, options = [], loadOptions }: FormCheckboxListProps) {
   const { getValue, setFieldValue } = useForm();
   const [ optionState, setOptionState ] = useState(options);

   const CSS = parseCSS(className, [
      'FormCheckboxList'
   ]);

   useEffect(() => {
      if (!loadOptions) return;

      loadOptions().then((loadedOptions) => {
         setOptionState(loadedOptions);
      }).catch((error) => {
         console.error("Error loading options for FormCheckboxList:", error);
      });
   }, [ loadOptions ]);

   if (!fieldName) {
      console.error("FormCheckboxList: fieldName is required");
      return null;
   }

   const values = getValue(fieldName) as number[] || [];
   const isChecked = (id: number) => values.includes(id);

   const handleChange = ({ target: { checked } }: React.ChangeEvent<HTMLInputElement>, id: number) => {
      if (checked && !isChecked(id)) {
         setFieldValue(fieldName, [ ...values, id ]);
      } else {
         setFieldValue(fieldName, values.filter((value) => value !== id));
      }
   }

   const handleRemoveSelection = (id: number) => {
      setFieldValue(fieldName, values.filter((value) => value !== id));
   };

   return (
      <div className={CSS}>
         {label && <WidgetHeader title={label} />}

         <div className="selected-options">
            {optionState.filter(option => isChecked(option.id)).map(option => (
               <Card
                  key={option.id}
                  className="option-item"
                  padding="m"
                  radius="s"
                  elevation="none"
                  onClick={() => handleRemoveSelection(option.id)}
               >
                  <p className="primary-text">{option.primary}</p>
                  <p className="secondary-text">{option.secondary}</p>
               </Card>
            ))}
         </div>

         <List className="options-list" dense>
            {optionState.map((value) => {
               const labelId = `form-checkbox-list-${value.id}`;

               return (
                  <ListItem
                     key={value.id}
                     disablePadding
                     secondaryAction={
                        <Checkbox
                           edge="end"
                           onChange={(ev) => handleChange(ev, value.id)}
                           checked={isChecked(value.id)}
                        />
                     }
                  >
                     <ListItemButton>
                        <ListItemAvatar>
                           <Avatar
                              alt={`Avatar ${value.primary}`}
                              src={value.avatarUrl}
                           />
                        </ListItemAvatar>

                        <ListItemText
                           id={labelId}
                           primary={value.primary}
                           secondary={value.secondary}
                        />
                     </ListItemButton>
                  </ListItem>
               );
            })}
         </List>
      </div>
   );
}
