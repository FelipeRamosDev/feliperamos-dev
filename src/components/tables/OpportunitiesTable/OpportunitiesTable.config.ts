import TableColumnConfig from '@/components/common/TableBase/TableColumnConfig';
import { OpportunityData } from '@/types/database.types';

export const opportunitiesTableConfig: TableColumnConfig<OpportunityData>[] = [
   {
      propKey: 'id',
      label: 'ID',
      align: 'left'
   },
   {
      propKey: 'job_title',
      label: 'Job Title',
      align: 'left'
   },
   {
      propKey: 'company',
      label: 'Company',
      align: 'left',
      format: (value, item) => {
         return item?.company?.company_name;
      }
   },
   {
      propKey: 'seniority_level',
      label: 'Seniority Level',
      align: 'left'
   },
   {
      propKey: 'employment_type',
      label: 'Employment Type',
      align: 'left'
   },
   {
      propKey: 'location',
      label: 'Location',
      align: 'left'
   },
];
