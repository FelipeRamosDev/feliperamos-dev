import { IColumnConfig } from '@/components/common/TableBase';

export const experienceWidgetColumns: IColumnConfig[] = [
   {
      propKey: 'title',
      label: 'Title',
      align: 'left',
      format: (value: string, row: WidgetExperienceObject) => {
         return (<>
            <strong>{value} </strong>
            < br />
            <span className="text-muted" > {row.position} </span>
         </>);
      }
   },
   {
      propKey: 'type',
      label: 'Type',
      align: 'left',
      format: (value: string) => {
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
      format: (value, row) => {
         return `${new Date(row.start_date).toLocaleDateString()} to ${new Date(row.end_date).toLocaleDateString()}`;
      }
   },
   {
      propKey: 'summary',
      label: 'Summary',
      align: 'left',
      format: (value: string) => {
         const maxLength = 60;
         return value.length > maxLength ? `${value.substring(0, maxLength)}...` : value;
      }
   }
];
