import { TableBase } from "@/components/common";

export default function CoverLettersTable() {
   return (
      <TableBase
         items={[]}
         loading={false}
         columnConfig={[
            { propKey: 'id', label: 'ID' },
            { propKey: 'subject', label: 'Subject' },
            { propKey: 'from_id', label: 'From ID' },
            { propKey: 'company_id', label: 'Company ID' }
         ]}
      />
   );
}
