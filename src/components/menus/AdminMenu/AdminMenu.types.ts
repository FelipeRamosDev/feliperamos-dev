export interface AdminMenuProps {
   className?: string | string[];
   open: boolean;
   toggleMenu: () => void;
}

export interface MenuItem {
   label: string;
   href: string;
   icon: React.ReactElement;
}
