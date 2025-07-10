import type { ButtonProps } from '@mui/material/Button';

export interface RoundButtonProps extends Omit<ButtonProps, 'className'> {
   title: string;
   children: React.ReactNode;
   className?: string | string[];
}
