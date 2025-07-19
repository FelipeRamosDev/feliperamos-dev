import { parseCSS } from '@/utils/parse';
import { MarkdownProps } from './Markdown.types';
import styles from './Markdown.module.scss';
import { marked } from 'marked';

export default function Markdown({ className, value }: MarkdownProps) {
   const htmlValue = marked(value);
   const CSS = parseCSS(className, [
      'Markdown',
      styles.Markdown,
   ]);
   
   return (
      <div className={CSS} dangerouslySetInnerHTML={{ __html: htmlValue }}></div>
   );
}
