import type { SizeKeyword } from '@/utils/parse';

export interface SkillBadgeProps {
   key: string | number | undefined;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   className?: string | string[];
   value: string;
   strong?: boolean;
   disabled?: boolean;
}
