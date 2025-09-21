import { Markdown, ModalBase } from '@/components/common';
import { LetterModalProps } from './LetterModal.types';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import EditLetterForm from '@/components/forms/cover-letter/EditLetterForm/EditLetterForm';
import { WidgetHeader } from '@/components/headers';
import { RoundButton } from '@/components/buttons';
import { Cancel, Edit } from '@mui/icons-material';

export default function LetterModal({ letter, updateLetter, onClose }: LetterModalProps) {
   const [editMode, setEditMode] = useState<boolean>(false);
   const isOpen = !!letter;

   useEffect(() => {
      setEditMode(false);
   }, [letter]);

   if (!isOpen) {
      return null;
   }

   return (
      <ModalBase
         isOpen={isOpen}
         onClose={onClose}
         title="Letter Modal"
         widthSize="xl"
      >
         <WidgetHeader title="Cover Letter Details">
            {!editMode && <RoundButton
               title="Edit Letter"
               color="background-dark"
               onClick={() => setEditMode(true)}
            >
               <Edit />
            </RoundButton>}

            {editMode && <RoundButton
               title="Save Changes"
               color="error"
               onClick={() => setEditMode(false)}
            >
               <Cancel />
            </RoundButton>}
         </WidgetHeader>

         {editMode && <EditLetterForm letter={letter} updateLetter={updateLetter} />}
         {!editMode && <ContentSidebar>
            <Fragment>
               <DataContainer vertical>
                  <label>Subject:</label>
                  <p>{letter.subject}</p>
               </DataContainer>
               <DataContainer vertical>
                  <label>Body:</label>
                  <Markdown value={letter.body} />
               </DataContainer>
            </Fragment>

            <Fragment>
               <DataContainer vertical>
                  <label>ID:</label>
                  <p>{letter.id}</p>
               </DataContainer>
               <DataContainer vertical>
                  <label>Company:</label>

                  {!letter.company_id && <p>---</p>}
                  {letter.company_id && <Link href={`/admin/company/${letter.company_id}`} target="_blank" rel="noopener noreferrer">
                     {letter.company_name}
                  </Link>}
               </DataContainer>
               <DataContainer vertical>
                  <label>Opportunity:</label>

                  {!letter.opportunity_id && <p>---</p>}
                  {letter.opportunity_id && <Link href={`/admin/opportunity/search?opportunity_id=${letter.opportunity_id}`} target="_blank" rel="noopener noreferrer">
                     {letter.job_title}
                  </Link>}
               </DataContainer>
            </Fragment>
         </ContentSidebar>}
      </ModalBase>
   );
}
