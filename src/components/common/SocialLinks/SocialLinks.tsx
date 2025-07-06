import { EmailRounded, GitHub, LinkedIn, Phone, WhatsApp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import socialLinksText from './SocialLinks.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';

export default function SocialLinks(): React.ReactElement {
   const { textResources } = useTextResources(socialLinksText);

   const githubText = textResources.getText('SocialLinks.github');
   const emailText = textResources.getText('SocialLinks.email');
   const linkedinText = textResources.getText('SocialLinks.linkedin');
   const whatsappText = textResources.getText('SocialLinks.whatsapp');
   const phoneText = textResources.getText('SocialLinks.phone');

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
            <IconButton title={githubText} aria-label={githubText} {...buttonDefault}>
               <GitHub />
            </IconButton>
         </Link>
         <Link href="mailto:felipe@feliperamos.dev" {...linkDefault}>
            <IconButton title={emailText} aria-label={emailText} {...buttonDefault}>
               <EmailRounded />
            </IconButton>
         </Link>
         <Link href="https://www.linkedin.com/in/feliperamos-dev/" {...linkDefault}>
            <IconButton title={linkedinText} aria-label={linkedinText} {...buttonDefault}>
               <LinkedIn />
            </IconButton>
         </Link>
         <Link href="https://wa.me/5541991447756" {...linkDefault}>
            <IconButton title={whatsappText} aria-label={whatsappText} {...buttonDefault}>
               <WhatsApp />
            </IconButton>
         </Link>
         <Link href="tel:+5541991447756" {...linkDefault}>
            <IconButton title={phoneText} aria-label={phoneText} {...buttonDefault}>
               <Phone />
            </IconButton>
         </Link>
      </div>
   );
}
