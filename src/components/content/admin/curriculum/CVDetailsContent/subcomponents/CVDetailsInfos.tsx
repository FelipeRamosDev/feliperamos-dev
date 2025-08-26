import { Card } from '@/components/common';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { WidgetHeader } from '@/components/headers';
import { DataContainer } from '@/components/layout';
import { useCVDetails } from '../CVDetailsContext';
import { useState } from 'react';
import { EditButtons, FavoriteButton } from '@/components/buttons';
import { EditCVInfosForm } from '@/components/forms/curriculums';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import texts from '../CVDetailsContent.text';
import { useAjax } from '@/hooks/useAjax';
import styles from '../CVDetailsContent.module.scss';

export default function CVDetailsInfos({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const { textResources } = useTextResources(texts);
   const ajax = useAjax();
   const cv = useCVDetails();

   const handleFavorite = async () => {
      try {
         const favorited = await ajax.post('/curriculum/update', { id: cv.id, updates: { is_favorite: !cv.is_favorite } });

         if (!favorited.success) {
            throw new Error(favorited.message || 'Failed to toggle favorite');
         }

         window.location.reload();
      } catch (error) {
         console.error('Error toggling favorite:', error);
      }
   }

   return (
      <Card className="CVDetailsInfos" {...cardProps}>
         <WidgetHeader title={textResources.getText('CVDetailsInfos.widgetTitle')}>
            <EditButtons
               editMode={editMode}
               setEditMode={setEditMode}
            />
         </WidgetHeader>

         {editMode && <EditCVInfosForm />}
         {!editMode && (<>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.title.label')}</label>

               <span className={styles.cvTitle}>
                  {cv.title}

                  <FavoriteButton
                     isFavorite={cv.is_favorite}
                     onClick={handleFavorite}
                  />
               </span>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.experienceTime.label')}</label>
               <p>{cv.experience_time}</p>
            </DataContainer>
            <DataContainer>
               <label>{textResources.getText('CVDetailsInfos.notes.label')}</label>
               <p>{cv.notes}</p>
            </DataContainer>
         </>)}
      </Card>
   );
}
