'use client';

import { RoundButton } from '@/components/buttons';
import { Container } from '@/components/common';
import { PageHeader } from '@/components/headers';
import CoverLettersTable from '@/components/tables/CoverLettersTable/CoverLettersTable';
import { Add } from '@mui/icons-material';
import Link from 'next/link';

export default function CoverLetterSearch() {
   return (
      <div className="CoverLetterSearch">
         <PageHeader
            title="Cover Letters"
            description="Manage and review cover letters submitted by users."
         >
            <RoundButton
               LinkComponent={Link}
               color="tertiary"
               title="Add New Cover Letter"
               href="/admin/cover-letter/create"
            >
               <Add />
            </RoundButton>
         </PageHeader>

         <Container fullwidth>
            <CoverLettersTable />
         </Container>
      </div>
   );
} 
