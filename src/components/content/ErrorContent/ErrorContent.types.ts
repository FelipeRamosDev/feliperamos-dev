export interface ErrorContentProps {
   className?: string | string[];
   status?: number;
   statusText?: string;
   code?: string;
   message?: string;
   title?: string;
   children?: React.ReactNode;
}
