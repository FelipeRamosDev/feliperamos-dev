import { parseCSS } from '@/utils/parse';
import { TabsContentProps } from './TabsContent.types';
import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

export default function TabsContent({ options = [], className, children }: TabsContentProps): React.JSX.Element {
   const [currentTab, setCurrentTab] = useState<number>(0);
   const classes = parseCSS(className, 'TabsContent');

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

         {children}
      </div>
   );
}
