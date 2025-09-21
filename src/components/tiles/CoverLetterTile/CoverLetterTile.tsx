import styles from './CoverLetterTile.module.scss';
import { CoverLetterTileProps } from './CoverLetterTile.types';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { parseCSS } from '@/helpers/parse.helpers';

export default function CoverLetterTile({ letter, className }: CoverLetterTileProps) {
   const classes = parseCSS(className, [ styles.CoverLetterTile, styles['MuiButton-root'] ]);

   return (
      <Button
         className={classes}
         LinkComponent={Link}
         href={`/admin/cover-letter/search?letter_id=${letter.id}`}
         target="_blank"
         rel="noopener noreferrer"
         fullWidth
      >
         <label>Subject:</label>
         <p>{letter.subject}</p>
      </Button>
   );
}
