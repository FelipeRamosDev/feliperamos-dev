import { parseCSS } from '@/helpers/parse.helpers';
import { ExperienceTileProps } from './ExperienceTile.types';
import styles from './ExperienceTile.module.scss';
import { Card, DateView } from '@/components/common';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ExperienceTile({ className, experience }: ExperienceTileProps): React.ReactElement {
   const router = useRouter();

   const CSS = parseCSS(className, [
      'ExperienceTile',
      styles.ExperienceTile
   ]);

   if (!experience) {
      return <div>No experience data available</div>;
   }

   return (
      <Card className={CSS} elevation="none" onClick={() => router.push(`/admin/experience/${experience.id}`)}>
         <div className={styles.tileHeader}>
            <div className={styles.companyLogo}>
               <Avatar className={styles.avatar} src={experience.company?.logo_url} alt={experience.company?.company_name} />
            </div>

            <div className={styles.headerContent}>
               <h3>{experience.company?.company_name} ({experience.position})</h3>
               <p className={styles.dateLine}>
                  <DateView date={experience.start_date} /> - <DateView date={experience.end_date} />
               </p>
            </div>
         </div>
      </Card>
   );
}
