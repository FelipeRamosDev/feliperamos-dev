import { TextResources } from '@/services';

const socialLinksText = new TextResources();

socialLinksText.create('SocialLinks.github', 'GitHub Profile');
socialLinksText.create('SocialLinks.github', 'Perfil GitHub', 'pt');

socialLinksText.create('SocialLinks.email', 'Email Felipe');
socialLinksText.create('SocialLinks.email', 'Enviar Email para o Felipe', 'pt');

socialLinksText.create('SocialLinks.linkedin', 'LinkedIn Profile');
socialLinksText.create('SocialLinks.linkedin', 'Perfil LinkedIn', 'pt');

socialLinksText.create('SocialLinks.whatsapp', 'WhatsApp Felipe');
socialLinksText.create('SocialLinks.whatsapp', 'Enviar WhatsApp para o Felipe', 'pt');

socialLinksText.create('SocialLinks.phone', 'Call to Felipe');
socialLinksText.create('SocialLinks.phone', 'Ligar para o Felipe', 'pt');

export default socialLinksText;
