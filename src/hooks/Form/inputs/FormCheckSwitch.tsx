import { FormControlLabel, Switch } from "@mui/material";
import { FormCheckSwitchProps } from "../Form.types";
import { useForm } from "../Form";

export default function FormCheckSwitch({ fieldName, label, onChange }: FormCheckSwitchProps) {
   const { getValue, setFieldValue } = useForm();

   if (!fieldName) {
      console.error("FormCheckSwitch requires a fieldName prop.");
      return null;
   }

   const handleChange = () => {
      const newValue = !Boolean(getValue(fieldName));

      setFieldValue(fieldName, newValue);
      if (onChange) {
         onChange(newValue);
      }
   }

   return (
      <FormControlLabel
         label={label}
         control={
            <Switch
               checked={Boolean(getValue(fieldName))}
               onChange={handleChange}
            />
         }
      />
   );
}
