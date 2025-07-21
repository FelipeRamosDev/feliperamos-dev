import { Card, DateView } from '@/components/common';
import { useExperienceDetails } from '../ExperienceDetailsContext';
import classNames from '../ExperienceDetailsContent.module.scss';
import { IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Fragment, useState } from 'react';
import EditExperienceDetails from '@/components/forms/experiences/EditExperienceDetails/EditExperienceDetails';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../ExperienceDetailsContent.text';
import DataContainer from '@/components/layout/DataContainer/DataContainer';

export default function ExperienceDetailsSection() {
   const experience = useExperienceDetails();
   const [editMode, setEditMode] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);

   return (
      <Card padding="l">
         <div className={classNames.cardHeader}>
            <h2>{textResources.getText('ExperienceDetailsSection.title')}</h2>

            {!editMode && (
               <IconButton
                  className={classNames.editButton}
                  onClick={() => setEditMode(true)}
                  title={textResources.getText('ExperienceDetailsSection.editButton')}
                  aria-label={textResources.getText('ExperienceDetailsSection.editButton')}
               >
                  <EditIcon />
               </IconButton>
            )}
         </div>

         {editMode && <EditExperienceDetails />}

         {!editMode && (
            <DataContainer>
               <label>{textResources.getText('ExperienceDetailsSection.field.title')}</label>
               <p>{experience.title}</p>
            </DataContainer>
         )}
         {!editMode && (
            <Fragment>
               <DataContainer>
                  <label>{textResources.getText('ExperienceDetailsSection.field.company')}</label>
                  <p>{experience.company?.company_name}</p>
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('ExperienceDetailsSection.field.type')}</label>
                  <p>{experience.type}</p>
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('ExperienceDetailsSection.field.startDate')}</label>
                  <DateView date={experience.start_date} />
               </DataContainer>
               <DataContainer>
                  <label>{textResources.getText('ExperienceDetailsSection.field.endDate')}</label>
                  <DateView date={experience.end_date} />
               </DataContainer>
            </Fragment>
         )}
      </Card>
   );
}