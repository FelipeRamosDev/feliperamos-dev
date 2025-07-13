import { parseCSS } from '@/utils/parse';
import { WidgetHeaderProps } from './WIdgetHeader.types';

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
