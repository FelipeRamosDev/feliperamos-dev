import { EmailRounded, GitHub, LinkedIn, Phone, WhatsApp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';

export default function SocialLinks(): React.ReactElement {
   const linkDefault = {
      rel: 'noopener noreferrer',
      target: '_blank'
   };

   const buttonDefault = {
      className: 'icon-button',
      color: 'inherit' as const,
      size: 'medium' as const
   }

   return (
      <div className="SocialLinks">
         <Link href="https://github.com/FelipeRamosDev" {...linkDefault}>
            <IconButton title="GitHub" aria-label="GitHub" {...buttonDefault}>
               <GitHub />
            </IconButton>
         </Link>
         <Link href="mailto:felipe@feliperamos.dev" {...linkDefault}>
            <IconButton title="Email" aria-label="Email" {...buttonDefault}>
               <EmailRounded />
            </IconButton>
         </Link>
         <Link href="https://www.linkedin.com/in/feliperamos-dev/" {...linkDefault}>
            <IconButton title="LinkedIn" aria-label="LinkedIn" {...buttonDefault}>
               <LinkedIn />
            </IconButton>
         </Link>
         <Link href="https://wa.me/5541991447756" {...linkDefault}>
            <IconButton title="WhatsApp" aria-label="WhatsApp" {...buttonDefault}>
               <WhatsApp />
            </IconButton>
         </Link>
         <Link href="tel:+5541991447756" {...linkDefault}>
            <IconButton title="Phone" aria-label="Phone" {...buttonDefault}>
               <Phone />
            </IconButton>
         </Link>
      </div>
   );
}
