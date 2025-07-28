export interface RoundButtonProps {
   title: string;
   children: React.ReactNode;
   color?: string;
   className?: string | string[];
   href?: string;
   LinkComponent?: React.ElementType;
   onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}
