import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';
import { parseCSS } from '@/utils/parse';

interface CTAButtonProps extends ButtonProps {
   className?: string | undefined;
   children?: React.ReactNode;
}

const CTAButton: React.FC<CTAButtonProps> = ({ className = '', children, ...props }) => {
   return (
      <Button
         className={parseCSS(className, 'cta-button')}
         {...props}
      >
         {children}
      </Button>
   );
}

export default CTAButton;