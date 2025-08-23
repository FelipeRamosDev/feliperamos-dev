import { Modal } from '@mui/material';
import { ModalBaseProps } from './ModalBase.types';
import { parseCSS, parsePadding } from '@/helpers/parse.helpers';
import styles from './ModalBase.module.scss';
import Card from '../Card/Card';
import { RoundButton } from '@/components/buttons';
import { Close } from '@mui/icons-material';
import { useEffect } from 'react';

export default function ModalBase({ title, icon, isOpen, onClose, onDestroy = () => {}, className, elevation, padding = 'l', radius, children }: ModalBaseProps) {
   useEffect(() => {
      return () => {
         onDestroy();
      };
   }, [onDestroy]);
   return (
      <Modal
         className={styles.ModalBaseBackdrop}
         open={isOpen}
         onClose={onClose}
      >
         <Card
            className={parseCSS(className, styles.ModalBase)}
            elevation={elevation}
            radius={radius}
            padding="none"
         >
            <div className={styles.modalBaseHeader}>
               {title && <span className={styles.modalBaseTitle}>{icon} {title}</span>}

               <RoundButton title="Close Modal" className={styles.modalBaseCloseButton} onClick={onClose}>
                  <Close />
               </RoundButton>
            </div>

            <div className={parseCSS(styles.modalBaseContent, parsePadding(padding))}>
               {children}
            </div>
         </Card>
      </Modal>
   );
}
