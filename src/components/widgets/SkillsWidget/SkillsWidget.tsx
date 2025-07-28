'use client';

import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { useAjax } from '@/hooks/useAjax';
import { useEffect, useRef, useState } from 'react';
import { SkillBadge } from '@/components/badges';
import { Card } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { parseCSS } from '@/helpers/parse.helpers';
import texts from './SkillsWidget.text';
import { SkillData } from '@/types/database.types';
import { RoundButton } from '@/components/buttons';

export default function SkillsWidget({ className }: { className?: string | string[] }): React.ReactElement {
   const ajax = useAjax();
   const loaded = useRef<boolean>(false);
   const [skills, setSkills] = useState<SkillData[]>([]);
   const { textResources } = useTextResources(texts);

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get<SkillData[]>('/skill/query', { params: { language_set: textResources.currentLanguage } }).then((response) => {
         if (!response.success) {
            console.error('Failed to fetch skills:', response);
            return;
         }

         setSkills(response.data);
      }).catch((error) => {
         console.error('Error fetching skills:', error);
      });
   }, [ajax, textResources.currentLanguage]);

   return (
      <div className={parseCSS(className, 'SkillsWidget')}>
         <WidgetHeader title={textResources.getText('SkillsWidget.headerTitle')}>
            <RoundButton
               title={textResources.getText('SkillsWidget.addSkillButton')}
               LinkComponent={Link}
               href="/admin/skill/create"
               color="primary"
            >
               <AddIcon />
            </RoundButton>
         </WidgetHeader>

         <Card className="skills-list" padding="m">
            {skills?.map(skill => <SkillBadge key={skill.id} value={skill.name} href={`/admin/skill/${skill.id}`} />)}
         </Card>
      </div>
   );
}
