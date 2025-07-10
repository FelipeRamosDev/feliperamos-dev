
import type { FormEvent } from 'react';

export interface ErrorTileProps {
  error?: { message?: string } | null;
}

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string | undefined>;

export interface FormContextType {
  values: FormValues;
  errors: FormErrors;
  responseError: { message?: string } | null;
  setFieldValue: (field: string, value: unknown) => void;
  setFieldError: (field: string, error: string | undefined) => void;
  setResponseError: (error: { message?: string } | null) => void;
  resetForm: () => void;
}

export interface FormProviderProps {
  className?: string;
  children: React.ReactNode;
  hideSubmit?: boolean;
  submitLabel?: string;
  initialValues?: FormValues;
  onSubmit?: (values: FormValues, errors: FormErrors, event: FormEvent<HTMLFormElement>) => Promise<unknown> | unknown;
}

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'file';

export interface FormInputProps {
  id?: string;
  fieldName?: string;
  label?: string;
  placeholder?: string;
  accept?: string;
  multiline?: boolean;
  type?: InputType;
}
