'use client';

import { useState } from 'react';
import ErrorContent from '@/components/content/ErrorContent/ErrorContent';
import { LetterPDFContentProps } from './LetterPDFContent.types';
import styles from './LetterPDFContent.module.scss';
import { DateView, Markdown } from '@/components/common';
import Link from 'next/link';

export default function LetterPDFContent({ letter }: LetterPDFContentProps) {
   const [dateNow] = useState(() => Date.now());

   if (!letter) {
      return <ErrorContent status={404} message="No cover letter data available" />;
   }

   return (
      <div className={styles.LetterPDFContent}>
         <header>
            <div className={styles.from}>
               <h1>{letter.from?.name}</h1>

               <Link href={`tel:${letter.from?.phone}`}>{letter.from?.phone}</Link>
               <Link href={`mailto:${letter.from?.email}`}>{letter.from?.email}</Link>
            </div>

            <div className={styles.to}>
               <p>{letter.company_name}</p>
               <p>Recruitment Team</p>
            </div>

            <DateView className={styles.date} date={dateNow} type="locale-standard" />
         </header>

         <Markdown className={styles.body} value={letter.body} />

         <footer>
            <p>Sincerely,</p>
            <p>{letter.from?.name}</p>
         </footer>
      </div>
   );
}
