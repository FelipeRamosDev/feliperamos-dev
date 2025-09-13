'use client';

import { parseCSS } from '@/helpers/parse.helpers';
import React, { createContext, useContext, useState, FormEvent } from 'react';
import { Button } from '@mui/material';
import { ErrorTile } from '@/components/tiles';
import type { FormContextType, FormProviderProps, FormValues, FormErrors, FormResponseError } from './Form.types';

const FormContext = createContext<FormContextType<FormValues> | undefined>(undefined);

function FormProvider<T = FormValues>({
   ref,
   className,
   children,
   hideSubmit,
   editMode = false,
   submitLabel = 'Enviar',
   initialValues = {},
   onSubmit = () => {},
   ...props
}: FormProviderProps<T>): React.ReactElement {
   const [ values, setValues ] = useState<Partial<T>>(initialValues);
   const [ errors, setErrors ] = useState<FormErrors>({});
   const [ responseError, setResponseError ] = useState<FormResponseError | null>(null);
   const [ loading, setLoading ] = useState(false);
   const [ updateData, setUpdateData ] = useState<Partial<T>>({});
   const CSS = parseCSS(className, 'Form');

   const getValue = (field: string): unknown => values[field as keyof T];

   const setFieldValue = (field: string, value: unknown) => {
      const typedField = field as keyof T;
      const typedValue = value as T[keyof T];
      
      if (editMode) {
         setUpdateData((prev) => ({ ...prev, [typedField]: typedValue }));
      }

      setValues((prev) => ({ ...prev, [typedField]: typedValue }));
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
         const result = await onSubmit(editMode ? updateData : values, errors, event) as FormValues | FormResponseError;

         if (!result) {
            throw { error: true, message: 'An unexpected error occurred' };
         }

         if (result.error || !result.success) {
            throw result;
         }

         resetForm();
         setResponseError(null);
         return result;
      } catch (error) {
         setResponseError(error as FormResponseError);
      } finally {
         setLoading(false);
      }
   };

   return (
      <FormContext.Provider
         value={{
         values,
         editMode,
         updateData,
         errors,
         responseError,
         getValue,
         setFieldValue,
         setFieldError,
         setResponseError,
         resetForm,
         }}
      >
         <form ref={ref} className={CSS} onSubmit={handleSubmit} {...props}>
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
function useForm<T = FormValues>(): FormContextType<T> & {
  getFieldValue: <K extends keyof T>(field: K) => T[K] | undefined;
  setFieldValueTyped: <K extends keyof T>(field: K, value: T[K]) => void;
} {
   const context = useContext(FormContext);

   if (!context) {
      throw new Error('useForm must be used within a FormProvider');
   }

   const getFieldValue = <K extends keyof T>(field: K): T[K] | undefined => {
      const value = context.getValue(field as string);
      return value as T[K] | undefined;
   };

   const setFieldValueTyped = <K extends keyof T>(field: K, value: T[K]) => {
      context.setFieldValue(field as string, value);
   };

   return {
      ...context as FormContextType<T>,
      getFieldValue,
      setFieldValueTyped,
   };
};

export { useForm };
export default FormProvider;
