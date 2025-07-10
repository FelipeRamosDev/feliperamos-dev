// Type for the result returned by onSubmit
type FormResult = { error?: string; success?: boolean } | object | null | undefined;

function hasError(result: FormResult): result is { error: string } {
   return (
      typeof result === 'object' &&
      result !== null &&
      'error' in result &&
      typeof (result as { error?: unknown }).error === 'string'
   );
}

function hasSuccess(result: FormResult): result is { success: boolean } {
   return (
      typeof result === 'object' &&
      result !== null &&
      'success' in result &&
      typeof (result as { success?: unknown }).success === 'boolean'
   );
}

import { parseCSS } from '@/utils/parse';
import React, { createContext, useContext, useState, FormEvent } from 'react';
import { Button } from '@mui/material';
import { ErrorTile } from '@/components/tiles';
import type { FormContextType, FormProviderProps, FormValues, FormErrors } from './Form.types';

const FormContext = createContext<FormContextType | undefined>(undefined);

function FormProvider({
   className,
   children,
   hideSubmit,
   submitLabel = 'Enviar',
   initialValues = {},
   onSubmit = () => { },
   ...props
}: FormProviderProps): React.ReactElement {
   const [values, setValues] = useState<FormValues>(initialValues);
   const [errors, setErrors] = useState<FormErrors>({});
   const [responseError, setResponseError] = useState<{ message?: string } | null>(null);
   const [loading, setLoading] = useState(false);
   const CSS = parseCSS(className, 'Form');

   const setFieldValue = (field: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [field]: value }));
   };

   const setFieldError = (field: string, error: string | undefined) => {
      setErrors((prev) => ({ ...prev, [field]: error }));
   };

   const resetForm = () => {
      setValues(initialValues);
      setErrors({});
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      try {
         const result = await onSubmit(values, errors, event) as FormResult;
         if (!result || typeof result !== 'object' || Array.isArray(result)) {
            setLoading(false);
            return;
         }

         if (hasError(result)) {
            setLoading(false);
            setResponseError({ message: result.error });
            return;
         }

         if (hasSuccess(result) && result.success) {
            resetForm();
            setResponseError(null);
            setErrors({});
         } else {
            setLoading(false);
            setResponseError({ message: hasError(result) ? result.error : 'An error occurred' });
         }
      } catch (error) {
         setLoading(false);
         setResponseError({ message: error instanceof Error ? error.message : String(error) });
      }
   };

   return (
      <FormContext.Provider
         value={{
            values,
            errors,
            responseError,
            setFieldValue,
            setFieldError,
            setResponseError,
            resetForm,
         }}
      >
         <form className={CSS} onSubmit={handleSubmit} {...props}>
            <ErrorTile error={responseError} />
            {children}

            {!hideSubmit && (
               <div className="form-actions">
                  <Button type="submit" disabled={loading} fullWidth>
                     {submitLabel}
                  </Button>
               </div>
            )}
         </form>
      </FormContext.Provider>
   );
}

/**
 * Custom hook to access form context values and helpers.
 * Must be used within a FormProvider.
 */
const useForm = () => {
   const context = useContext(FormContext);
   if (!context) {
      throw new Error('useForm must be used within a FormProvider');
   }
   return context;
};

export { useForm };
export default FormProvider;
