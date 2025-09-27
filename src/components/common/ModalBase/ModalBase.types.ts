import { SizeKeyword } from "@/helpers/parse.helpers";

export interface ModalBaseProps {
   title?: string | React.ReactNode;
   icon?: React.ReactNode;
   className?: string | string[];
   elevation?: SizeKeyword;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   widthSize?: SizeKeyword;
   isOpen: boolean;
   onClose: () => void;
   onDestroy?: () => void;
   children?: React.ReactNode;
}
