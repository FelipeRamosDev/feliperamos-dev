import { parseCSS } from '@/helpers/parse.helpers';
import { LanguageTileProps } from './LanguageTile.types';
import styles from './LanguageTile.module.scss'
import { useRouter } from 'next/navigation';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { displayProficiency } from '@/helpers/app.helpers';

export default function LanguageTile({ language, className }: LanguageTileProps) {
   const router = useRouter();
   const { textResources } = useTextResources();

   const CSS = parseCSS(className, [
      'LanguageTile',
      styles.LanguageTile
   ]);

   return (
      <div className={CSS} onClick={() => router.push(`/admin/language/${language.id}`)}>
         <span className={styles.languageName}>{language.default_name}</span>
         <p className={styles.languageLevel}>{displayProficiency(language.proficiency, textResources.currentLanguage)}</p>
      </div>
   );
}
