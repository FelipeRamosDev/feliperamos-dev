import { parseCSS } from "@/helpers/parse.helpers";
import { Button } from "@mui/material";
import { FormSubmitProps } from "../Form.types";

export default function FormSubmit({ className, label = 'Submit', fullWidth = true, ...props }: FormSubmitProps): React.ReactElement {
   return (
      <Button
         className={parseCSS(className, 'FormSubmit')}
         type="submit"
         fullWidth={fullWidth}
         {...props}
      >
         {label}
      </Button>
   )
}
