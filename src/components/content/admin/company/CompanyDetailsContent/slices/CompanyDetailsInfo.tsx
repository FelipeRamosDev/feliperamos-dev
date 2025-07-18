import Card from "@/components/common/Card/Card";
import EditCompanyInfo from "@/components/forms/EditCompanyInfo/EditCompanyInfo";
import WidgetHeader from "@/components/headers/WidgetHeader/WidgetHeader";
import DataContainer from "@/components/layout/DataContainer/DataContainer";
import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useCompanyDetails } from "../CompanyDetailsContext";

export default function CompanyDetailsInfo(): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const company = useCompanyDetails();

   return (
      <Card padding="l" className="CompanyDetailsInfo">
         <WidgetHeader title="Company Information">
            {!editMode && (
               <IconButton onClick={() => setEditMode(true)} aria-label="Edit Company">
                  <Edit />
               </IconButton>
            )}
         </WidgetHeader>

         {editMode && <EditCompanyInfo />}

         {!editMode && (
            <Fragment>
               <DataContainer>
                  <label>Company Name:</label>
                  <span>{company?.company_name}</span>
               </DataContainer>
               <DataContainer>
                  <label>Logo URL:</label>

                  {company?.logo_url ? (
                     <Link href={company?.logo_url} target="_blank" rel="noopener noreferrer">
                        {company?.logo_url}
                     </Link>
                  ) : (
                     <span>No Logo URL available</span>
                  )}
               </DataContainer>
               <DataContainer>
                  <label>Site URL:</label>

                  {company?.site_url ? (
                     <Link href={company?.site_url} target="_blank" rel="noopener noreferrer">
                        {company?.site_url}
                     </Link>
                  ) : (
                     <span>No Site URL available</span>
                  )}
               </DataContainer>
               <DataContainer>
                  <label>Location:</label>
                  <span>{company?.location}</span>
               </DataContainer>
            </Fragment>
         )}
      </Card>
   );
}