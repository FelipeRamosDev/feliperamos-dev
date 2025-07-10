import { parseCSS } from '@/utils/parse';
import React, { createContext, useContext, useState, ReactNode, FormEvent } from 'react';
import { Button } from '@mui/material';
import { ErrorTile } from '@/components/tiles';
import { FormContextType, FormProviderProps } from './Form.types';

const FormContext = createContext < FormContextType | undefined > (undefined);

function FormProvider({
   className,
   children,
   hideSubmit,
   submitLabel = 'Enviar',
   initialValues = {},
   onSubmit = () => { },
   ...props
}: FormProviderProps): React.ReactElement {
   const [values, setValues] = useState < Record < string, any>> (initialValues);
   const [errors, setErrors] = useState < Record < string, any>> ({});
   const [responseError, setResponseError] = useState < any > (null);
   const [loading, setLoading] = useState(false);
   const CSS = parseCSS(className, 'Form');

   const setFieldValue = (field: string, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));
   };

   const setFieldError = (field: string, error: any) => {
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
         const result = await onSubmit(values, errors, event);
         if (!result || typeof result !== 'object' || Array.isArray(result)) {
            setLoading(false);
            return;
         }

         if (result.error) {
            setLoading(false);
            return setResponseError(result);
         }

         if (result.success) {
            resetForm();
            setResponseError(null);
            setFieldError('' as any, undefined);
         } else {
            setLoading(false);
            setResponseError(result);
         }
      } catch (error) {
         setLoading(false);
         setResponseError(error);
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
