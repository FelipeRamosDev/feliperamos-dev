import { TableBase } from '@/components/common';
import useConverLetters from '@/hooks/useConverLetters/useConverLetters';
import { useEffect, useRef } from 'react';

export default function CoverLettersTable() {
   const { coverLetters, fetchCoverLetters, loading } = useConverLetters({ query: {} });
   const fetched = useRef<boolean>(false);

   useEffect(() => {
      if (fetched.current) {
         return;
      }

      fetched.current = true;
      fetchCoverLetters().catch((error) => {
         console.error('Error fetching letters:', error);
      });
   }, []);

   return (
      <TableBase
         items={coverLetters}
         loading={loading}
         noDocumentsText="No cover letters found."
         columnConfig={[
            { propKey: 'id', label: 'ID' },
            { propKey: 'subject', label: 'Subject' },
            { propKey: 'from_id', label: 'From ID' },
            { propKey: 'company_id', label: 'Company ID' }
         ]}
      />
   );
}
