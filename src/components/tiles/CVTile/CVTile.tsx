import { Card } from '@/components/common';
import { CVTileProps } from './CVTile.types';
import styles from './CVTile.module.scss';
import { InsertDriveFile } from '@mui/icons-material';
import { parseCSS } from '@/helpers/parse.helpers';

export default function CVTile({ className, cv, onClick = () => {} }: CVTileProps): React.ReactNode | null {
   const CSS = parseCSS(className, [
      'CVTile',
      styles.CVTile
   ]);

   const summary = cv?.summary && cv.summary.length > 200 ? (
      `${cv.summary.substring(0, 200)}...`
   ) : (
      cv?.summary || ''
   )

   if (!cv || cv === null) {
      return null;
   }

   return (
      <Card className={CSS} padding="s" onClick={() => onClick(cv.id)}>
         <div className={styles.cardHeader}>
            <div className={styles.cvIconWrap}>
               <InsertDriveFile
                  className={styles.cvIcon}
                  fontSize="large"
               />
            </div>
            
            <div className={styles.cvDetails}>
               <h3>{cv.title}</h3>
               <p className={styles.subTitle}>{cv.job_title}</p>
            </div>
         </div>

         <Card className={styles.cardBody} elevation="none">
            <p>{summary}</p>
         </Card>
      </Card>
   );
}
