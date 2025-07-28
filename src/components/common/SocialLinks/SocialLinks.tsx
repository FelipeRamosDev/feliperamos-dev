import Link from 'next/link';
import socialLinksText from './SocialLinks.text';
import { useTextResources } from '@/services/TextResources/TextResourcesProvider';
import { RoundButton } from '@/components/buttons';

import {
   EmailRounded,
   GitHub,
   LinkedIn,
   Phone,
   WhatsApp
} from '@mui/icons-material';

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
      color: 'background-dark' as const,
      size: 'medium' as const
   }

   return (
      <div className="SocialLinks">
         <Link href="https://github.com/FelipeRamosDev" {...linkDefault}>
            <RoundButton title={githubText} aria-label={githubText} {...buttonDefault}>
               <GitHub />
            </RoundButton>
         </Link>
         <Link href="mailto:felipe@feliperamos.dev" {...linkDefault}>
            <RoundButton title={emailText} aria-label={emailText} {...buttonDefault}>
               <EmailRounded />
            </RoundButton>
         </Link>
         <Link href="https://www.linkedin.com/in/feliperamos-dev/" {...linkDefault}>
            <RoundButton title={linkedinText} aria-label={linkedinText} {...buttonDefault}>
               <LinkedIn />
            </RoundButton>
         </Link>
         <Link href="https://wa.me/5541991447756" {...linkDefault}>
            <RoundButton title={whatsappText} aria-label={whatsappText} {...buttonDefault}>
               <WhatsApp />
            </RoundButton>
         </Link>
         <Link href="tel:+5541991447756" {...linkDefault}>
            <RoundButton title={phoneText} aria-label={phoneText} {...buttonDefault}>
               <Phone />
            </RoundButton>
         </Link>
      </div>
   );
}
