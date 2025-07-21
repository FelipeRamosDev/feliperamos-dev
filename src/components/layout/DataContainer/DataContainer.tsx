import { parseCSS, parseElevation, parsePadding, parseRadius } from '@/helpers/parse.helpers';
import styles from './DataContainer.module.scss';
import { DataContainerProps } from './DataContainer.types';

export default function DataContainer({ className, padding= 'm', radius = 's', elevation = 'none', children }: DataContainerProps): React.ReactElement {
   const CSS = parseCSS(className, [
      'DataContainer',
      styles.DataContainer,
      parsePadding(padding),
      parseRadius(radius),
      parseElevation(elevation)
   ]);

   return (
      <div className={CSS}>
         {children}
      </div>
   );
}
