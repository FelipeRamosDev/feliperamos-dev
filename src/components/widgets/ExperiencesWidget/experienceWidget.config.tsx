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
      propKey: 'type',
      label: 'Type',
      align: 'left',
      format: (value: unknown) => {
         switch (value) {
            case 'internship':
               return 'Internship';
            case 'freelance':
               return 'Freelance';
            case 'contract':
               return 'Contract';
            case 'temporary':
               return 'Temporary';
            case 'full_time':
               return 'Full Time';
            case 'part_time':
               return 'Part Time';
            case 'other':
               return 'Other';
            default:
               return 'Unknown';
         }
      }
   },
   {
      propKey: 'status',
      label: 'Skills',
      align: 'left',
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
      minWidth: 230,
      format: (_: unknown, item: unknown) => {
         const row = item as ExperienceData;
         return <p><DateView date={row.start_date} /> / <DateView date={row.end_date} /></p>;
      }
   }
];
