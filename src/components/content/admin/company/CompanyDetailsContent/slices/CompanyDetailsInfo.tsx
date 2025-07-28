import { Fragment, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/common';
import EditCompanyInfo from '@/components/forms/companies/EditCompanyInfo/EditCompanyInfo';
import { WidgetHeader } from '@/components/headers';
import { DataContainer } from '@/components/layout';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';
import { EditButtons } from '@/components/buttons';

export default function CompanyDetailsInfo(): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const company = useCompanyDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Card padding="l" className="CompanyDetailsInfo">
         <WidgetHeader title={textResources.getText('CompanyDetailsContent.header.infos')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
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