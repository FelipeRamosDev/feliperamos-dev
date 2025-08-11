export interface PageBaseProps {
   language?: string;
   hideHeader?: boolean;
   hideFooter?: boolean;
   customHeader?: React.ReactNode;
   fullwidth?: boolean;
   children: React.ReactNode;
}
