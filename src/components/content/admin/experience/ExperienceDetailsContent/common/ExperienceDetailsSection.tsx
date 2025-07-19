import { Card, DateView } from '@/components/common';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import FieldWrap from './ExperienceDetailsFieldWrap';
import classNames from '../ExperienceDetailsContent.module.scss';
import { IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Fragment, useState } from 'react';
import EditExperienceDetails from '@/components/forms/EditExperienceDetails/EditExperienceDetails';

export default function ExperienceDetailsSection() {
   const experience = useExperienceDetails();
   const [editMode, setEditMode] = useState<boolean>(false);

   return (
      <Card padding="l">
         <div className={classNames.cardHeader}>
            <h2>Experience Details</h2>

            {!editMode && (
               <IconButton className={classNames.editButton} onClick={() => setEditMode(true)} aria-label="Edit Experience">
                  <EditIcon />
               </IconButton>
            )}
         </div>

         {editMode && <EditExperienceDetails />}

         {!editMode && (
            <FieldWrap>
               <label>Title:</label>
               <p>{experience.title}</p>
            </FieldWrap>
         )}
         {!editMode && (
            <Fragment>
               <FieldWrap>
                  <label>Company:</label>
                  <p>{experience.company?.company_name}</p>
               </FieldWrap>
               <FieldWrap>
                  <label>Type:</label>
                  <p>{experience.type}</p>
               </FieldWrap>
               <FieldWrap>
                  <label>Start Date:</label>
                  <DateView date={experience.start_date} />
               </FieldWrap>
               <FieldWrap>
                  <label>End Date:</label>
                  <DateView date={experience.end_date} />
               </FieldWrap>
            </Fragment>
         )}
      </Card>
   );
}