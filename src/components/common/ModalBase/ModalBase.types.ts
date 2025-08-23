import { SizeKeyword } from "@/helpers/parse.helpers";

export interface ModalBaseProps {
   title?: string;
   icon?: React.ReactNode;
   className?: string | string[];
   elevation?: SizeKeyword;
   padding?: SizeKeyword;
   radius?: SizeKeyword;
   isOpen: boolean;
   onClose: () => void;
   onDestroy?: () => void;
   children?: React.ReactNode;
}
