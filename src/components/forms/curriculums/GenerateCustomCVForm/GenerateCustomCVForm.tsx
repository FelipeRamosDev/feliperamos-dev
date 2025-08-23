import { parseCSS } from '@/helpers/parse.helpers';
import { Form, FormInput, FormSubmit } from '@/hooks';
import { GenerateCustomCVFormProps } from './GenerateCustomCVForm.types';
import styles from './GenerateCustomCVForm.module.scss'

export default function GenerateCustomCVForm({ initialValues, viewType, className, onSubmit }: GenerateCustomCVFormProps): React.JSX.Element {
   const mainCSS = parseCSS(className, [
      styles.GenerateCustomCVForm
   ]);

   return (
      <Form
         className={mainCSS}
         initialValues={{ ...initialValues }}
         onSubmit={onSubmit}
         hideSubmit
      >
         {viewType === 'start' && (
            <div className={styles.linkedInWrap}>
               <FormInput
                  fieldName="jobURL"
                  label="LinkedIn Job URL"
                  className={styles.linkedInInput}
               />

               <FormSubmit className={styles.generateButton} label="Generate" color="tertiary" />
            </div>
         )}

         {viewType === 'full' && (
            <div className={styles.fullForm}>
               <FormInput
                  fieldName="currentInput"
                  label="Summary"
                  multiline
               />
               <FormInput
                  fieldName="customPrompt"
                  label="Custom Prompt"
                  multiline
               />

               <FormSubmit className={styles.generateButton} label="Re-Generate" color="primary" />
            </div>
         )}
      </Form>
   );
}
