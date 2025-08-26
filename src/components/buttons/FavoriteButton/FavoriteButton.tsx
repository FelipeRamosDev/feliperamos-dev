import { Star, StarBorder } from '@mui/icons-material';
import { FavoriteButtonProps } from './FavoriteButton.types';
import { parseCSS } from '@/helpers/parse.helpers';
import styles from './FavoriteButton.module.scss';
import { useState } from 'react';
import { Spinner } from '@/components/common';

export default function FavoriteButton({ isFavorite, iconSize = 'medium', spinnerSize = '1.5rem', className, onClick = async () => {} }: FavoriteButtonProps) {
   const [ loading, setLoading ] = useState<boolean>(false);
   const Icon = isFavorite ? Star : StarBorder;

   const handleClick = async () => {
      try {
         setLoading(true);
         await onClick();
      } catch (error) {
         console.log(error);
      } finally {
         setLoading(false);
      }
   }

   const classes = parseCSS(className, [
      styles.FavoriteButton
   ]);

   if (loading) {
      return <Spinner size={spinnerSize} />
   }

   return (
      <Icon className={classes} fontSize={iconSize} onClick={handleClick} />
   );
}
   