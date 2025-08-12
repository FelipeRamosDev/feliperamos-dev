import { IColumnConfig } from '@/components/common/TableBase';
import { SkillBadge } from '@/components/badges';
import { DateView } from '@/components/common';
import { ExperienceData } from '@/types/database.types';

export const experienceWidgetColumns: IColumnConfig[] = [
   {
      propKey: 'title',
      label: 'Title',
      align: 'left',
      minWidth: 180,
      format: (_: unknown, item: unknown) => {
         const row = item as ExperienceData;

         return (
            <>
               <strong>{String(row.company?.company_name || row.title)}</strong>
               <br />
               <span>{row.position}</span>
            </>
         );
      }
   },
   {
      propKey: 'title',
      label: 'Title',
      align: 'left',
      minWidth: 150,
   },
   {
      propKey: 'status',
      label: 'Skills',
      align: 'left',
      maxWidth: 90,
      minWidth: 90,
      format: (value: unknown) => {
         return (
            <SkillBadge value={value as string} padding="xs" />
         );
      }
   },
   {
      propKey: 'data',
      label: 'Start Date',
      align: 'left',
      maxWidth: 120,
      minWidth: 120,
      format: (_: unknown, item: unknown) => {
         const row = item as ExperienceData;
         return <p><DateView date={row.start_date} /> / <DateView date={row.end_date} /></p>;
      }
   }
];
