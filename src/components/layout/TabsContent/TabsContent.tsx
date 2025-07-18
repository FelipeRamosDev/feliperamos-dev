import { parseCSS } from '@/utils/parse';
import { TabsContentProps } from './TabsContent.types';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

export default function TabsContent({ options = [], useNewButton, newContent, className, children }: TabsContentProps): React.JSX.Element {
   const [currentTab, setCurrentTab] = useState<number>(0);
   const classes = parseCSS(className, 'TabsContent');
   const childCount = Array.isArray(children) ? children.length : 1;

   if (useNewButton) {
      options = [
         ...options,
         { label: 'New', value: 'new' }
      ];
   }

   const handleChange = (_: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
   };

   return (
      <div className={classes}>
         <div className="tabs">
            <Tabs value={currentTab} onChange={handleChange}>
               {options.map((option, index) => (
                  <Tab key={index} label={option.label} />
               ))}
            </Tabs>
         </div>

         {Array.isArray(children) ? children.map((child, index) => {
            if (currentTab === index) {
               return <div key={index} className="tab-content">
                  {child}
               </div>
            } else {
               return null;
            }
         }) : (
            <div className="tab-content">
               {children}
            </div>
         )}
         
         {useNewButton && (currentTab === childCount) && (
            <div className="tab-content">
               {newContent}
            </div>
         )}
      </div>
   );
}
