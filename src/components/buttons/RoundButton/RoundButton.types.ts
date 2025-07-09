import type { ButtonProps } from '@mui/material/Button';

export interface RoundButtonProps extends Omit<ButtonProps, 'className'> {
   children: React.ReactNode;
   className?: string | string[];
}
