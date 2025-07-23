import type { SizeKeyword } from '@/helpers/parse.helpers';

export interface SkillBadgeProps {
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   className?: string | string[];
   value: string;
   strong?: boolean;
   disabled?: boolean;
   href?: string;
}
