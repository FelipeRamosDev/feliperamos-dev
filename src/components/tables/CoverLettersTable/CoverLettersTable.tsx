import { DateView, TableBase } from '@/components/common';
import LetterModal from '@/components/modals/LetterModal/LetterModal';
import { useLetters } from '@/hooks';
import { LetterData } from '@/types/database.types';
import { Fragment, useEffect, useRef } from 'react';

export default function CoverLettersTable() {
   const { letters, fetchLetters, updateLetter, deleteLetter, loading, selectedLetter, setSelectedLetter } = useLetters({ where: { type: 'cover-letter' } });
   const fetched = useRef<boolean>(false);

   useEffect(() => {
      if (fetched.current) {
         return;
      }

      fetched.current = true;
      fetchLetters().catch((error) => {
         console.error('Error fetching letters:', error);
      });
   }, [fetchLetters]);

   useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const letterId = Number(searchParams.get('letter_id'));

      if (!letterId || isNaN(letterId) || !letters.length) {
         return;
      }
      
      const letter = letters.find(l => l.id === letterId);
      if (letter) {
         setSelectedLetter(letter);
      }
   }, [letters, setSelectedLetter]);

   const handleRowClick = (letter: LetterData) => {
      setSelectedLetter(letter);
   }

   return (<Fragment>
      <TableBase<LetterData>
         items={letters}
         loading={loading}
         noDocumentsText="No cover letters found."
         onClickRow={(item) => handleRowClick(item)}
         columnConfig={[
            { propKey: 'id', label: 'ID' },
            { propKey: 'subject', label: 'Subject' },
            { propKey: 'company_name', label: 'Company Name' },
            { propKey: 'created_at', label: 'Created At', format: (value) => <DateView date={value as string} type="locale-standard" /> },
         ]}
      />

      <LetterModal
         letter={selectedLetter}
         updateLetter={updateLetter}
         deleteLetter={deleteLetter}
         onClose={() => setSelectedLetter(null)}
      />
   </Fragment>);
}
