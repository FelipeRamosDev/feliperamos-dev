import { parseCSS, parsePadding, parseRadius } from '@/utils/parse';
import type { SkillBadgeProps } from './SkillBadge.types';

export default function SkillBadge({
   className,
   padding = 's',
   radius = 'xs',
   value = '',
   strong = false,
   disabled = false
}: SkillBadgeProps): React.ReactElement {
   const classNames = parseCSS(className, [
      'SkillBadge',
      parsePadding(padding),
      parseRadius(radius),
      strong ? 'strong' : '',
      disabled ? 'disabled' : ''
   ]);

   return (
      <span
         className={classNames}
         aria-label={value}
      >
         {value}
      </span>
   );
}
