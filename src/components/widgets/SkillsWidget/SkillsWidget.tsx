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

export default function SkillsWidget(): React.ReactElement {
   const ajax = useAjax();
   const loaded = useRef<boolean>(false);
   const [skills, setSkills] = useState<SkillObj[]>([]);

   useEffect(() => {
      if (loaded.current) {
         return;
      }

      loaded.current = true;
      ajax.get('/skill/query').then((response) => {
         if (!response.success) {
            console.error('Failed to fetch skills:', response);
            return;
         }

         setSkills(response.data as SkillObj[]);
      }).catch((error) => {
         console.error('Error fetching skills:', error);
      });
   }, [ajax]);

   return (
      <div className="SkillsWidget">
         <WidgetHeader title="Skills">
               <Button
                  LinkComponent={Link}
                  href="/admin/skill/create"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
               >
                  Skill</Button>
         </WidgetHeader>

         <Card className="skills-list" padding="m">
            {skills?.map(skill => <SkillBadge key={skill.id} value={skill.name} />)}
         </Card>
      </div>
   );
}
