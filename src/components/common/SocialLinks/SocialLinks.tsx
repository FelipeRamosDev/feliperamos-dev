import { EmailRounded, GitHub, LinkedIn, Phone, WhatsApp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';

export default function SocialLinks(): React.ReactElement {
   return (
      <div className="SocialLinks">
         <Link href="https://github.com/FelipeRamosDev" target="_blank">
            <IconButton className="icon-button" color="inherit" title="GitHub" size="medium">
               <GitHub />
            </IconButton>
         </Link>
         <Link href="mailto:felipe@feliperamos.dev" target="_blank">
            <IconButton className="icon-button" color="inherit" title="Email" size="medium">
               <EmailRounded />
            </IconButton>
         </Link>
         <Link href="https://www.linkedin.com/in/feliperamos-dev/" target="_blank">
            <IconButton className="icon-button" color="inherit" title="LinkedIn" size="medium">
               <LinkedIn />
            </IconButton>
         </Link>
         <Link href="https://wa.me/5541991447756" target="_blank">
            <IconButton className="icon-button" color="inherit" title="WhatsApp" size="medium">
               <WhatsApp />
            </IconButton>
         </Link>
         <Link href="tel:+5541991447756" target="_blank">
            <IconButton className="icon-button" color="inherit" title="Phone" size="medium">
               <Phone />
            </IconButton>
         </Link>
      </div>
   );
}
