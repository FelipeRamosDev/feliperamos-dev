import { TextResources } from '@/services';

const homeTopBannerText = new TextResources();

homeTopBannerText.create('HomeTopBanner.title', 'Felipe Ramos');

homeTopBannerText.create('HomeTopBanner.subtitle', 'Fullstack Developer');
homeTopBannerText.create('HomeTopBanner.subtitle', 'Desenvolvedor Fullstack', 'pt');

homeTopBannerText.create('HomeTopBanner.techStack', 'JavaScript | React | Next.js | Node.js | Express | MongoDB');

homeTopBannerText.create('HomeTopBanner.button.downloadCV', 'Download CV');
homeTopBannerText.create('HomeTopBanner.button.downloadCV', 'Baixar CV', 'pt');

export default homeTopBannerText;
