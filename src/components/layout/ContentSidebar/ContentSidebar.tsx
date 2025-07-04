import React from "react";
import { parseCSS } from "@/utils/parse";

interface ContentSidebarProps {
   reverseColumn?: boolean;
   reverseRow?: boolean;
   className?: string;
   children?: React.ReactNode[];
}

export default function ContentSidebar({ 
   reverseColumn, 
   reverseRow, 
   className = '', 
   children = [] 
}: ContentSidebarProps): React.JSX.Element {
   const classeNames = parseCSS(className, [
      'ContentSidebar',
      reverseColumn ? 'reverse-column' : '',
      reverseRow ? 'reverse-row' : ''
   ]);

   return (
      <div className={classeNames}>
         <div className="content">
            {children[0] || null}
         </div>

         <div className="sidebar">
            {children[1] || null}
         </div>
      </div>
   );
}
