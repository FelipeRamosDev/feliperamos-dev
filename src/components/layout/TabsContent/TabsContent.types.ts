export interface TabsContentProps {
   options: TabOption[];
   className?: string;
   children: React.ReactNode;
}

export interface TabOption {
   label: string;
   value: string;
}
