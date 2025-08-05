'use client';

import { TableBase } from '@/components/common/TableBase';
import { WidgetHeader } from '@/components/headers';
import { useAjax } from '@/hooks/useAjax';
import { parseCSS } from '@/helpers/parse.helpers';
import { Add } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { useRouter } from 'next/navigation';
import { CompanyData } from '@/types/database.types';
import { CompaniesWidgetProps } from './CompaniesWidget.types';
import texts from './CompaniesWidget.text';
import { RoundButton } from '@/components/buttons';

export default function CompaniesWidget({ className }: CompaniesWidgetProps): React.ReactElement {
   const ajax = useAjax();
   const loaded = useRef<boolean>(false);
   const [companies, setCompanies] = useState<CompanyData[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const { textResources } = useTextResources(texts);
   const router = useRouter();

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get<CompanyData[]>('/company/query', { params: { language_set: textResources.currentLanguage } }).then((response) => {
         if (!response.success) {
            console.error('Failed to fetch companies:', response);
            return;
         }

         setCompanies(response.data);
         return { success: true };
      }).catch((error) => {
         console.error('Error fetching companies:', error);
      }).finally(() => {
         setLoading(false);
      });
   }, [ajax, textResources.currentLanguage]);

   return (
      <div className={parseCSS(className, 'CompaniesWidget')}>
         <WidgetHeader title={textResources.getText('CompaniesWidget.headerTitle')}>
            <RoundButton
               title={textResources.getText('CompaniesWidget.button.addCompany')}
               href="/admin/company/create"
               LinkComponent={Link}
               color="primary"
            >
               <Add />
            </RoundButton>
         </WidgetHeader>

         <TableBase
            hideHeader
            usePagination
            items={companies}
            loading={loading}
            noDocumentsText={textResources.getText('CompaniesWidget.noDocuments')}
            itemsPerPage={5}
            columnConfig={[
               {
                  label: textResources.getText('CompaniesWidget.column.logo'),
                  propKey: 'logo_url',
                  maxWidth: 20,
                  format: (_: unknown, company: unknown): ReactNode => {
                     const companyData = company as CompanyData;
                     return <Avatar src={companyData.logo_url} alt={companyData.company_name} />;
                  }
               },
               {
                  label: textResources.getText('CompaniesWidget.column.company_name'),
                  propKey: 'company_name'
               }
            ]}
            onClickRow={(row) => router.push(`/admin/company/${row.id}`)}
         />
      </div>
   );
}
