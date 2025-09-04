import styles from './FlexLine.module.scss';

export default function FlexLine({ children }: { children: React.ReactNode }) {
   return (
      <div className={styles.FlexLine}>
         {children}
      </div>
   );
}
