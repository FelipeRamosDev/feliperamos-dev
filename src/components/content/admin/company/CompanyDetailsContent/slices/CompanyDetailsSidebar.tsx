import { Card } from '@/components/common';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { Fragment } from 'react';
import { useCompanyDetails } from '../CompanyDetailsContext';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CompanyDetailsContent.text';


export default function CompanyDetailsSidebar(): React.ReactElement {
   const company = useCompanyDetails();
   const { textResources } = useTextResources(texts);

   return (
      <Fragment>
         <Card padding="l">
            <DataContainer>
               <label>{textResources.getText('CompanyDetailsContent.label.id')}</label>
               <span>{company?.id}</span>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CompanyDetailsContent.label.createdAt')}</label>
               <span>{new Date(company?.created_at).toLocaleString()}</span>
            </DataContainer>
         </Card>
      </Fragment>
   );
}
