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
import { SocialLinksProps } from './SocialLinks.types';

export default function SocialLinks({ cv }: SocialLinksProps): React.ReactElement {
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

   const {
      github_url,
      email,
      linkedin_url,
      whatsapp_number,
      phone
   } = cv?.user || {};

   return (
      <div className="SocialLinks">
         {github_url && <Link href={github_url} {...linkDefault}>
            <RoundButton title={githubText} aria-label={githubText} {...buttonDefault}>
               <GitHub />
            </RoundButton>
         </Link>}
         {email && <Link href={`mailto:${email}`} {...linkDefault}>
            <RoundButton title={emailText} aria-label={emailText} {...buttonDefault}>
               <EmailRounded />
            </RoundButton>
         </Link>}
         {linkedin_url && <Link href={linkedin_url} {...linkDefault}>
            <RoundButton title={linkedinText} aria-label={linkedinText} {...buttonDefault}>
               <LinkedIn />
            </RoundButton>
         </Link>}
         {whatsapp_number && <Link href={`https://wa.me/${whatsapp_number}`} {...linkDefault}>
            <RoundButton title={whatsappText} aria-label={whatsappText} {...buttonDefault}>
               <WhatsApp />
            </RoundButton>
         </Link>}
         {phone && <Link href={`tel:${phone}`} {...linkDefault}>
            <RoundButton title={phoneText} aria-label={phoneText} {...buttonDefault}>
               <Phone />
            </RoundButton>
         </Link>}
      </div>
   );
}
