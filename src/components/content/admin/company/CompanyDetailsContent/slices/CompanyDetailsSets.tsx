import { Card } from "@/components/common";
import EditCompanySetForm from "@/components/forms/EditCompanySetForm/EditCompanySetForm";
import WidgetHeader from "@/components/headers/WidgetHeader/WidgetHeader";
import TabsContent from "@/components/layout/TabsContent/TabsContent";
import { TabOption } from "@/components/layout/TabsContent/TabsContent.types";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useCompanyDetails } from "../CompanyDetailsContext";
import { useState } from "react";
import { CompanySetData } from "@/types/database.types";
import DataContainer from "@/components/layout/DataContainer/DataContainer";

export default function CompanyDetailsSets(): React.ReactElement {
   const company = useCompanyDetails();
   const [ editMode, setEditMode ] = useState<boolean>(false);

   const tabOptions: TabOption[] = company.languageSets.map((set: CompanySetData) => ({
      label: set.language_set || 'Unknown Language Set',
      value: set.language_set || 'unknown-language-set',
   }));

   return (
      <Card padding="l">
         <WidgetHeader title="Language Sets">
            {!editMode && (
               <IconButton onClick={() => setEditMode(true)} aria-label="Edit Company">
                  <Edit />
               </IconButton>
            )}
         </WidgetHeader>

         <TabsContent
            options={tabOptions}
            useNewButton
            newContent={<EditCompanySetForm />}
         >
            {tabOptions.map((option: TabOption) => {
               const languageSet = company.languageSets.find(set => set.language_set === option.value);

               if (!languageSet) {
                  return null;
               }

               if (editMode) {
                  return (
                     <EditCompanySetForm key={option.value} language_set={option.value} editMode />
                  );
               }

               return (
                  <div className="company-content" key={option.value}>
                     <DataContainer>
                        <label>Industry:</label>
                        <p>{languageSet.industry || 'No industry available.'}</p>
                     </DataContainer>
                     <DataContainer>
                        <label>Description:</label>
                        <p>{languageSet.description || 'No description available.'}</p>
                     </DataContainer>
                  </div>
               );
            })}
         </TabsContent>
      </Card>
   );
}
