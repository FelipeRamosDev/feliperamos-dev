import { IconButton } from '@mui/material';
import type { RoundButtonProps } from './RoundButton.types';
import { parseCSS } from '@/utils/parse';

export default function RoundButton({ title, className, children, ...props }: RoundButtonProps): React.ReactElement {
   return (
      <IconButton
         title={title}
         aria-label={title}
         className={parseCSS(className, 'RoundButton')}
         {...props}
      >
         {children}
      </IconButton>
   )
}
