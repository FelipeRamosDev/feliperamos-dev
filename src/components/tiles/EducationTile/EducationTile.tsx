import { Card, DateView } from '@/components/common';
import { EducationTileProps } from './EducationTile.types';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './EducationTile.module.scss';
import { useRouter } from 'next/navigation';

export default function EducationTile({ education, className }: EducationTileProps) {
   const router = useRouter();
   const CSS = parseCSS(className, [
      'EducationTile',
      styles.EducationTile
   ]);

   return (
      <Card className={CSS} padding="s" elevation="none" onClick={() => router.push(`/admin/education/${education.id}`)}>
         <span className={styles.tileTitle}>
            {education.field_of_study} at {education.institution_name}
         </span>
         <p className={styles.educationDate}>
            <DateView date={education.start_date} /> - <DateView date={education.end_date} />
         </p>
         <p className={styles.tileSubTitle}>
            {education.degree}
         </p>
      </Card>
   );
}
