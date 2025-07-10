
import type { FormEvent, ReactNode } from 'react';

export interface ErrorTileProps {
   error?: { message?: string };
}

export interface FormContextType {
   values: Record<string, any>;
   errors: Record<string, any>;
   responseError: any;
   setFieldValue: (field: string, value: any) => void;
   setFieldError: (field: string, error: any) => void;
   setResponseError: (error: any) => void;
   resetForm: () => void;
}

export interface FormProviderProps {
   className?: string;
   children: ReactNode;
   hideSubmit?: boolean;
   submitLabel?: string;
   initialValues?: Record<string, any>;
   onSubmit?: (values: Record<string, any>, errors: Record<string, any>, event: FormEvent<HTMLFormElement>) => Promise<any> | any;
   [key: string]: any;
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
