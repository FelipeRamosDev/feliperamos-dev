import React from 'react';
import { ModalBase, Spinner } from '@/components/common';
import { LoadingModalProps } from './LoadingModal.types';
import styles from './LoadingModal.module.scss';

export default function LoadingModal({ isOpen, message }: LoadingModalProps): React.JSX.Element {
   return (
      <ModalBase className={styles.LoadingModal} isOpen={isOpen} onClose={() => {}} widthSize="s">
         <Spinner />
         {message && <p>{message}</p>}
      </ModalBase>
   );
}

