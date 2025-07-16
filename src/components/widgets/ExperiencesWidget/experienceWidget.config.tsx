import { IColumnConfig } from '@/components/common/TableBase';
import { WidgetExperienceObject } from './ExperiencesWidget.types';
import { SkillBadge } from '@/components/badges';

export const experienceWidgetColumns: IColumnConfig[] = [
   {
      propKey: 'title',
      label: 'Title',
      align: 'left',
      format: (_: unknown, item: unknown) => {
         const row = item as WidgetExperienceObject;

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
      propKey: 'data',
      label: 'Start Date',
      align: 'left',
      format: (_: unknown, item: unknown) => {
         const row = item as WidgetExperienceObject;
         return `${new Date(row.start_date).toLocaleDateString()} to ${new Date(row.end_date).toLocaleDateString()}`;
      }
   },
   {
      propKey: 'skills',
      label: 'Skills',
      align: 'left',
      format: (value: unknown) => {
         return (
            <div className="skills-list">
               {Array.isArray(value) && value.map((skill) => (
                  <SkillBadge key={skill.id} value={skill.name} padding="xs" />
               ))}
            </div>
         );
      }
   }
];
