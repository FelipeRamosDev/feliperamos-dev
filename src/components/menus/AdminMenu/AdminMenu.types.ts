export interface AdminMenuProps {
   className?: string | string[];
   open: boolean;
}

export interface MenuItem {
   label: string;
   href: string;
   icon: React.ReactElement;
}
