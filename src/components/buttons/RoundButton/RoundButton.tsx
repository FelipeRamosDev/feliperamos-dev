import { IconButton } from '@mui/material';
import type { RoundButtonProps } from './RoundButton.types';
import { parseButtonColorCSS, parseCSS } from '@/helpers/parse.helpers';
import styles from './RoundButton.module.scss';

export default function RoundButton({
   title,
   className,
   color,
   onClick,
   children,
   LinkComponent,
   ...props
}: RoundButtonProps): React.ReactElement {
   const CSS = parseCSS(className, [
      'RoundButton',
      styles.RoundButton,
      styles[parseButtonColorCSS(color)]
   ]);

   return (
      <IconButton
         title={title}
         aria-label={title}
         className={CSS}
         onClick={onClick}
         LinkComponent={LinkComponent}
         {...props}
      >
         {children}
      </IconButton>
   )
}
