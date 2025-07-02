import Image from 'next/image';
import LogoImage from './logo.svg';
import { parseCSS } from '@/helpers';

interface LogoParams {
   className?: string | string[];
   width?: number;
   height?: number;
}
export default function Logo({ className = '', width, height = 60, ...props }: LogoParams): React.JSX.Element {
   return (
      <Image
         className={parseCSS(className, 'Logo')}
         src={LogoImage}
         alt="Logo"
         width={width}
         height={height}
         priority
         {...props}
      />
   )
}
