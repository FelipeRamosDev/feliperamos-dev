import React from 'react';
import { parseBreakpoint, parseCSS, SizeKeyword } from '@/helpers/parse.helpers';

interface ContentSidebarProps {
   reverseColumn?: boolean;
   reverseRow?: boolean;
   breakpoint?: SizeKeyword;
   className?: string | string[];
   children?: React.ReactNode;
}

export default function ContentSidebar({ 
   reverseColumn,
   reverseRow,
   breakpoint = 'm',
   className = '',
   children
}: ContentSidebarProps): React.JSX.Element {
   const classeNames = parseCSS(className, [
      'ContentSidebar',
      parseBreakpoint(breakpoint),
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

         {childrenArray[1] && (
            <aside className="sidebar">
               {childrenArray[1] || null}
            </aside>
         )}
      </div>
   );
}
