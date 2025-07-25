
import { Dayjs } from 'dayjs';
import type { FormEvent } from 'react';

export interface ErrorTileProps {
  error?: { message?: string } | null;
}

export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string | undefined>;

export interface FormResponseError {
  error?: true;
  message?: string;
  [key: string]: unknown;
}

export interface FormContextType {
  values: FormValues;
  updateData: FormValues;
  errors: FormErrors;
  editMode: boolean;
  responseError: { message?: string } | null;
  getValue: (field: string) => unknown;
  setFieldValue: (field: string, value: unknown) => void;
  setFieldError: (field: string, error: string | undefined) => void;
  setResponseError: (error: { message?: string } | null) => void;
  resetForm: () => void;
}

export interface FormProviderProps {
  ref?: React.RefObject<HTMLFormElement | null>;
  className?: string;
  children: React.ReactNode;
  hideSubmit?: boolean;
  submitLabel?: string;
  initialValues?: FormValues;
  editMode?: boolean;
  onSubmit?: (values: FormValues, errors: FormErrors, event: FormEvent<HTMLFormElement>) => Promise<unknown> | unknown;
}

export type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'file';

export interface FormBaseInputProps {
  id?: string;
  fieldName?: string;
  label?: string;
  parseInput?: (value: string | number) => unknown;
  onChange?: (value: string | number | (string | number)[]) => void;
}

export interface FormInputProps extends FormBaseInputProps {
  placeholder?: string;
  accept?: string;
  multiline?: boolean;
  type?: InputType;
  minRows?: number;
  min?: number;
  max?: number;
}

export interface FormSelectProps extends FormBaseInputProps {
  className?: string | string[];
  disableNone?: boolean;
  loadOptions?: () => Promise<Array<FormSelectOption>>;
  options?: Array<FormSelectOption>;
}

export interface FormSelectOption {
  value: string | number;
  label: string;
}

export interface FormButtonSelectProps extends FormBaseInputProps {
  className?: string | string[];
  defaultValue?: string | number;
  options: Array<FormSelectOption>;
  onSelect?: (value: string | number) => void;
}

export interface FormDatePickerProps extends FormBaseInputProps {
  className?: string | string[];
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export interface FormSubmitProps {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string | string[] | undefined;
  label?: string;
  fullWidth?: boolean;
}

export interface FormMultiSelectChipProps extends FormSelectProps {
  [key: string]: unknown;
}
