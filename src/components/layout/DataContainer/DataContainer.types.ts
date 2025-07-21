import { SizeKeyword } from '@/helpers/parse.helpers';

export type DataContainerProps = {
   className?: string;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   elevation?: SizeKeyword;
   vertical?: boolean;
   children: React.ReactNode;
};
