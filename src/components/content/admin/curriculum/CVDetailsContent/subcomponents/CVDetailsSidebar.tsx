import { Fragment, useState } from 'react';
import { CVDetailsSubcomponentProps } from '../CVDetailsContent.types';
import { Card } from '@/components/common';
import DataContainer from '@/components/layout/DataContainer/DataContainer';
import { useCVDetails } from '../CVDetailsContext';
import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { SkillBadge } from '@/components/badges';

export default function CVDetailsSidebar({ cardProps }: CVDetailsSubcomponentProps): React.ReactElement {
   const [ editMode, setEditMode ] = useState<boolean>(false);
   const cv = useCVDetails();
   const cv_skills = cv?.cv_skills || [];

   return (
      <Fragment>
         <Card {...cardProps}>
            <DataContainer>
               <label>ID:</label>
               <p>{cv.id}</p>
            </DataContainer>
            <DataContainer>
               <label>Created At:</label>
               <p>{new Date(cv.created_at).toLocaleString()}</p>
            </DataContainer>
            {cv.updated_at && (
               <DataContainer>
                  <label>Updated At:</label>
                  <p>{new Date(cv.updated_at).toLocaleString()}</p>
               </DataContainer>
            )}
         </Card>

         <Card {...cardProps}>
            <WidgetHeader title="Skills" />

            <div className="skills-list">
               {cv_skills.length > 0 && cv_skills.map((skill) => (
                  <SkillBadge key={skill.id} value={skill.name} />
               ))}
            </div>
         </Card>
      </Fragment>
   );
}
