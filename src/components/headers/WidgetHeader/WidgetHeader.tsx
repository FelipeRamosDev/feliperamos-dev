import { parseCSS } from '@/helpers/parse.helpers';
import { WidgetHeaderProps } from './WidgetHeader.types';

export default function WidgetHeader({ className, title, children }: WidgetHeaderProps): React.JSX.Element {
   const CSS = parseCSS(className, 'WidgetHeader');

   return (
      <div className={CSS}>
         <h2>{title}</h2>

         <div className="toolbar">
            {children}
         </div>
      </div>
   );
}
