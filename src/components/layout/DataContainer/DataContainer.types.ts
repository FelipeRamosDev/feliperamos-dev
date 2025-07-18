import { SizeKeyword } from '@/utils/parse';

export type DataContainerProps = {
   className?: string;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   elevation?: SizeKeyword;
   children: React.ReactNode;
};
