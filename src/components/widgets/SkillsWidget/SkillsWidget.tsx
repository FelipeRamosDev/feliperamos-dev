'use client';

import WidgetHeader from '@/components/headers/WidgetHeader/WidgetHeader';
import { Button } from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { useAjax } from '@/hooks/useAjax';
import { useEffect, useRef, useState } from 'react';
import { SkillObj } from './SkillsWidget.types';
import { SkillBadge } from '@/components/badges';
import { Card } from '@/components/common';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { parseCSS } from '@/helpers/parse.helpers';
import texts from './SkillsWidget.text';

export default function SkillsWidget({ className }: { className?: string | string[] }): React.ReactElement {
   const ajax = useAjax();
   const loaded = useRef<boolean>(false);
   const [skills, setSkills] = useState<SkillObj[]>([]);
   const { textResources } = useTextResources(texts);

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get('/skill/query', { params: { language_set: textResources.currentLanguage } }).then((response) => {
         if (!response.success) {
            console.error('Failed to fetch skills:', response);
            return;
         }

         setSkills(response.data as SkillObj[]);
      }).catch((error) => {
         console.error('Error fetching skills:', error);
      });
   }, [ajax, textResources.currentLanguage]);

   return (
      <div className={parseCSS(className, 'SkillsWidget')}>
         <WidgetHeader title={textResources.getText('SkillsWidget.headerTitle')}>
            <Button
               LinkComponent={Link}
               href="/admin/skill/create"
               variant="contained"
               color="primary"
               startIcon={<AddIcon />}
            >
               {textResources.getText('SkillsWidget.addSkillButton')}
            </Button>
         </WidgetHeader>

         <Card className="skills-list" padding="m">
            {skills?.map(skill => <SkillBadge key={skill.id} value={skill.name} href={`/admin/skill/${skill.id}`} />)}
         </Card>
      </div>
   );
}
