import { parseCSS } from '@/helpers/parse.helpers';
import styleModule from '../ExperienceDetailsContent.module.scss';

export default function ExperienceDetailsFieldWrap({ vertical, children }: { vertical?: boolean; children: React.ReactNode }) {
   const CSS = parseCSS(vertical ? styleModule.vertical : '', styleModule['field-wrap']);
   return <div className={CSS}>{children}</div>;
}
