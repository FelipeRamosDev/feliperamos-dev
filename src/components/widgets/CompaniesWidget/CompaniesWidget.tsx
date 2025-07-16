'use client';

import { TableBase } from '@/components/common/TableBase';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { useAjax } from '@/hooks/useAjax';
import { parseCSS } from '@/utils/parse';
import { Add } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import Link from 'next/link';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { WidgetCompany } from './CompaniesWidget.types';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function CompaniesWidget({ className }: { className?: string | string[]}): React.ReactElement {
   const ajax = useAjax();
   const loaded = useRef<boolean>(false);
   const [ companies, setCompanies ] = useState<WidgetCompany[]>([]);
   const [ loading, setLoading ] = useState<boolean>(true);
   const { textResources } = useTextResources();

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get('/company/query', { params: { language_set: textResources.currentLanguage } }).then((response) => {
         if (!response.success) {
            console.error('Failed to fetch companies:', response);
            return;
         }

         setCompanies(response.data as WidgetCompany[]);
         return { success: true };
      }).catch((error) => {
         console.error('Error fetching companies:', error);
      }).finally(() => {
         setLoading(false);
      });
   }, [ ajax, textResources.currentLanguage ]);

   return (
      <div className={parseCSS(className, 'CompaniesWidget')}>
         <WidgetHeader title="Companies">
            <Button
               LinkComponent={Link}
               href="/admin/company/create"
               variant="contained"
               color="primary"
               startIcon={<Add />}
            >
               Company
            </Button>
         </WidgetHeader>

         <TableBase
            usePagination
            items={companies}
            loading={loading}
            noDocumentsText="No companies found"
            itemsPerPage={5}
            columnConfig={[
               {
                  id: 'logo_url',
                  label: 'Logo',
                  propKey: 'logo_url',
                  maxWidth: 20,
                  format: (_: unknown, company: unknown): ReactNode => {
                     const companyData = company as WidgetCompany;
                     return <Avatar src={companyData.logo_url} alt={companyData.company_name} />;
                  }
               },
               {
                  id: 'company_name',
                  label: 'Name',
                  propKey: 'company_name'
               }
            ]}
            onClickRow={(row) => {
               console.log(row);
            }}
         />
      </div>
   );
}
