import { RoundButton } from '@/components/buttons';
import { OpportunityHeaderProps } from './OpportunityHeader.types';
import { Cancel, Delete, Edit } from '@mui/icons-material';
import styles from './OpportunityHeader.module.scss';
import Link from 'next/link';
import { useOpportunities } from '@/hooks';

export default function OpportunityHeader({ company, opportunityId, jobTitle, editMode = false, setEditMode = () => {} }: OpportunityHeaderProps) {
   const setEdit = () => setEditMode(true);
   const cancelEdit = () => setEditMode(false);
   const { deleteOpportunity } = useOpportunities();

   const handleDelete = async () => {
      if (!opportunityId) {
         return;
      }

      try {
         const deleted = await deleteOpportunity(opportunityId);

         if (!deleted?.success) {
            throw deleted;
         }

         window.location.reload();
         return deleted;
      } catch (error) {
         return error;
      }
   }

   return (
      <div className={styles.OpportunityHeader}>
         <div className={styles.headerContent}>
            <h2 className={styles.jobTitle}>{jobTitle}</h2>
            {company && <Link className={styles.companyName} href={`/admin/company/${company?.id}`}>{company?.company_name}</Link>}
         </div>

         {!editMode && <div className={styles.actions}>
            <RoundButton title="Edit Opportunity" color="background-dark" onClick={setEdit}>
               <Edit />
            </RoundButton>

            <RoundButton className={styles.errorButton} title="Delete Opportunity" color="background-dark" onClick={handleDelete}>
               <Delete />
            </RoundButton>
         </div>}

         {editMode && <div className={styles.actions}>
            <RoundButton className={styles.errorButton} title="Cancel Edit" color="background-dark" onClick={cancelEdit}>
               <Cancel />
            </RoundButton>
         </div>}
      </div>
   );
}
