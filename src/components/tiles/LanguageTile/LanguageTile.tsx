import { parseCSS } from '@/helpers/parse.helpers';
import { LanguageTileProps } from './LanguageTile.types';
import styles from './LanguageTile.module.scss'
import { useRouter } from 'next/navigation';

export default function LanguageTile({ language, className }: LanguageTileProps) {
   const router = useRouter();

   const CSS = parseCSS(className, [
      'LanguageTile',
      styles.LanguageTile
   ]);

   return (
      <div className={CSS} onClick={() => router.push(`/admin/language/${language.id}`)}>
         <span className={styles.languageName}>{language.default_name}</span>
         <p className={styles.languageLevel}>{language.local_name}</p>
      </div>
   );
}  
