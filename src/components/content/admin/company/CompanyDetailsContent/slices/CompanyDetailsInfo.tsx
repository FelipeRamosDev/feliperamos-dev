import Card from '@/components/common/Card/Card';
import EditCompanyInfo from '@/components/forms/EditCompanyInfo/EditCompanyInfo';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { Edit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';

export default function CompanyDetailsInfo(): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const company = useCompanyDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Card padding="l" className="CompanyDetailsInfo">
         <WidgetHeader title={textResources.getText('CompanyDetailsContent.header.infos')}>
            {!editMode && (
               <IconButton onClick={() => setEditMode(true)} aria-label={textResources.getText('CompanyDetailsContent.button.editInfos')}>
                  <Edit />
               </IconButton>
            )}
         </WidgetHeader>

         {editMode && <EditCompanyInfo />}

         {!editMode && (
            <Fragment>
               <DataContainer>
                  <label>{textResources.getText('CompanyDetailsContent.label.companyName')}</label>
                  <span>{company?.company_name}</span>
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('CompanyDetailsContent.label.logoUrl')}</label>

                  {company?.logo_url ? (
                     <Link href={company?.logo_url} target="_blank" rel="noopener noreferrer">
                        {company?.logo_url}
                     </Link>
                  ) : (
                     <span>{textResources.getText('CompanyDetailsContent.feedback.noLogoUrl')}</span>
                  )}
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('CompanyDetailsContent.label.siteUrl')}</label>

                  {company?.site_url ? (
                     <Link href={company?.site_url} target="_blank" rel="noopener noreferrer">
                        {company?.site_url}
                     </Link>
                  ) : (
                     <span>{textResources.getText('CompanyDetailsContent.feedback.noSiteUrl')}</span>
                  )}
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('CompanyDetailsContent.label.location')}</label>
                  <span>{company?.location}</span>
               </DataContainer>
            </Fragment>
         )}
      </Card>
   );
}