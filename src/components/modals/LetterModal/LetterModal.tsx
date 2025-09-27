import { Markdown, ModalBase } from '@/components/common';
import { LetterModalProps } from './LetterModal.types';
import { ContentSidebar, DataContainer } from '@/components/layout';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import EditLetterForm from '@/components/forms/cover-letter/EditLetterForm/EditLetterForm';
import { WidgetHeader } from '@/components/headers';
import { RoundButton } from '@/components/buttons';
import { Cancel, Edit, Download, Delete } from '@mui/icons-material';
import { letterPDFDownloadLink } from '@/helpers/app.helpers';

export default function LetterModal({ letter, updateLetter, deleteLetter, onClose = () => {} }: LetterModalProps) {
   const [editMode, setEditMode] = useState<boolean>(false);
   const isOpen = !!letter;

   useEffect(() => {
      setEditMode(false);
   }, [letter]);

   const handleDelete = async () => {
      if (!letter) {
         return;
      }

      if (!confirm('Are you sure you want to delete this cover letter? This action cannot be undone.')) {
         return;
      }

      try {
         await deleteLetter(letter.id);
         onClose();
      } catch (error) {
         console.error('Error deleting cover letter:', error);
         alert('Failed to delete cover letter.');
      }
   }

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
               title="Download Letter PDF"
               color="background-dark"
               LinkComponent={Link}
               href={letterPDFDownloadLink(letter)}
               target="_blank"
               rel="noopener noreferrer"
            >
               <Download />
            </RoundButton>}

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

             {!editMode && <RoundButton
               title="Delete Letter"
               color="background-dark"
               onClick={handleDelete}
            >
               <Delete />
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
