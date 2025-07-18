import { Card } from "@/components/common";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { Fragment } from "react";
import { useCompanyDetails } from "../CompanyDetailsContext";

export default function CompanyDetailsSidebar(): React.ReactElement {
   const company = useCompanyDetails();

   return (
      <Fragment>
         <Card padding="l">
            <DataContainer>
               <label>ID:</label>
               <span>{company?.id}</span>
            </DataContainer>
            <DataContainer>
               <label>Created At:</label>
               <span>{new Date(company?.created_at).toLocaleString()}</span>
            </DataContainer>
         </Card>
      </Fragment>
   );
}
