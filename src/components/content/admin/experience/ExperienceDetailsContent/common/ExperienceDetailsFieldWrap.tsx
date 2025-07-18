import { parseCSS } from '@/utils/parse';
import styleModule from '../ExperienceDetailsContent.module.scss';

export default function ExperienceDetailsFieldWrap({ vertical, children }: { vertical?: boolean; children: React.ReactNode }) {
   const CSS = parseCSS(vertical ? styleModule.vertical : 'horizontal', styleModule['field-wrap']);
   return <div className={CSS}>{children}</div>;
}
