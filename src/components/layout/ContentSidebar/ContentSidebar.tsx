import React from 'react';
import { parseCSS } from '@/utils/parse';

interface ContentSidebarProps {
   reverseColumn?: boolean;
   reverseRow?: boolean;
   className?: string | string[];
   children?: React.ReactNode;
}

export default function ContentSidebar({ 
   reverseColumn, 
   reverseRow, 
   className = '', 
   children 
}: ContentSidebarProps): React.JSX.Element {
   const classeNames = parseCSS(className, [
      'ContentSidebar',
      reverseColumn ? 'reverse-column' : '',
      reverseRow ? 'reverse-row' : ''
   ]);

   // Convert children to array to handle both single and multiple children
   const childrenArray = React.Children.toArray(children);

   return (
      <div className={classeNames}>
         <article className="content">
            {childrenArray[0] || null}
         </article>

         <aside className="sidebar">
            {childrenArray[1] || null}
         </aside>
      </div>
   );
}
