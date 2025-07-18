export interface TabsContentProps {
   useNewButton?: boolean;
   newContent?: React.ReactNode;
   options: TabOption[];
   className?: string;
   children: React.ReactNode;
}

export interface TabOption {
   label: string;
   value: string;
}
