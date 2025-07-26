import { Card } from '@/components/common';
import { CVTileProps } from './CVTile.types';
import styles from './CVTile.module.scss';
import { Folder } from '@mui/icons-material';
import { parseCSS } from '@/helpers/parse.helpers';

export default function CVTile({ className, cv, onClick = () => {} }: CVTileProps): React.ReactNode {
   const CSS = parseCSS(className, [
      'CVTile',
      styles.CVTile
   ]);

   if (!cv || cv === null) {
      return null;
   }

   return (
      <Card className={CSS} padding="s" onClick={() => onClick(cv.id)}>
         <div className={styles.cvIconWrap}>
            <Folder
               className={styles.cvIcon}
               fontSize="large"
            />
         </div>
         
         <div className={styles.cvDetails}>
            <h3>{cv.title}</h3>
            <p>{cv.summary}</p>
         </div>
      </Card>
   );
}
