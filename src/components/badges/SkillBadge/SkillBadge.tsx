import { parseCSS, parsePadding, parseRadius } from '@/helpers/parse.helpers';
import type { SkillBadgeProps } from './SkillBadge.types';
import Link from 'next/link';

export default function SkillBadge({
   className,
   padding = 's',
   radius = 'xs',
   value = '',
   strong = false,
   disabled = false,
   href,
}: SkillBadgeProps): React.ReactElement {
   const classNames = parseCSS(className, [
      'SkillBadge',
      parsePadding(padding),
      parseRadius(radius),
      strong ? 'strong' : '',
      disabled ? 'disabled' : ''
   ]);

   const elmProps = {
      className: classNames,
      'data-testid': 'skill-badge',
      'data-value': value,
      'aria-label': value
   }

   if (href) {
      return (
         <Link
            href={href}
            {...elmProps}
         >
            {value}
         </Link>
      );
   }

   return (
      <span
         {...elmProps}  
      >
         {value}
      </span>
   );
}
