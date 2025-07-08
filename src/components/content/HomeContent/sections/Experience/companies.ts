import { marked } from 'marked';
import { TextResources } from '@/services';
import { WorkExperienceModel } from './Experience.types';

export default function companies(experienceText: TextResources): WorkExperienceModel[] {
   const candlepilotDesc = marked.parse(experienceText.getText('Experience.candlePilot.description'));
   const osfDesc = marked.parse(experienceText.getText('Experience.osf.description'));
   const adamRoboDesc = marked.parse(experienceText.getText('Experience.adamRobo.description'));
   const pradoBeckerDesc = marked.parse(experienceText.getText('Experience.pradoBecker.description'));
   const prietoSpinaDesc = marked.parse(experienceText.getText('Experience.prietoSpina.description'));

   const candlepilotSide = marked.parse(experienceText.getText('Experience.candlePilot.sidebar'));
   const osfSide = marked.parse(experienceText.getText('Experience.osf.sidebar'));
   const adamRoboSide = marked.parse(experienceText.getText('Experience.adamRobo.sidebar'));
   const pradoBeckerSide = marked.parse(experienceText.getText('Experience.pradoBecker.sidebar'));
   const prietoSpinaSide = marked.parse(experienceText.getText('Experience.prietoSpina.sidebar'));

   return [
      {
         company: 'CandlePilot',
         companyUrl: 'https://candlepilot.com',
         position: 'Fullstack Developer',
         workType: 'Contract',
         startDate: '2023-4-1',
         endDate: '2025-5-1',
         description: candlepilotDesc.toString(),
         sidebar: candlepilotSide.toString(),
         logoUrl: '/images/companies/candlepilot_logo.svg',
         skills: ['Node JS', 'TypeScript', 'Next.js', 'React', 'JavaScript', 'Docker', 'Redis', 'GitHub Actions', 'Express', 'Jest', 'React Testing Library', 'Binance API', 'Material UI', 'Socker.io', 'MongoDB', 'Mongoose', 'REST API', 'Vercel', 'Microservices', 'JSON Web Token', 'Bcrypt', 'TradingView Lightweight Charts', 'HTML', 'CSS', 'SCSS'],
      },
      {
         company: 'OSF Digital',
         companyUrl: 'https://osf.digital',
         position: 'Frontend Developer',
         workType: 'Fulltime',
         startDate: '2021-5-1',
         endDate: '2023-12-1',
         description: osfDesc.toString(),
         sidebar: osfSide.toString(),
         logoUrl: '/images/companies/osf_logo.svg',
         skills: ['Salesforce (SFCC)', 'Salesforce (Page Designer)', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'Vue.js', 'JQuery', 'HTML', 'CSS', 'ISML', 'Design Patters', 'Jest', 'React Testing Library', 'Bitbucket'],
      },
      {
         company: 'Adam Robô',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         startDate: '2021-1-1',
         endDate: '2023-8-1',
         description: adamRoboDesc.toString(),
         sidebar: adamRoboSide.toString(),
         logoUrl: '/images/companies/adamrobo_logo.jpg',
         skills: ['JavaScript', 'React', 'TypeScript', 'Node JS', 'Jest', 'React Testing Library', 'HTML', 'CSS', 'Bluetooth API', 'SCSS']
      },
      {
         company: 'Prado & Becker',
         companyUrl: 'https://pradobecker.vercel.app',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         startDate: '2020-9-1',
         endDate: '2021-8-1',
         description: pradoBeckerDesc.toString(),
         sidebar: pradoBeckerSide.toString(),
         logoUrl: '/images/companies/pradobecker_logo.svg',
         skills: ['JavaScript', 'Material UI', 'React', 'TypeScript', 'Node.js', 'Next.js', 'Firebase', 'Firestore', 'HTML', 'CSS', 'SCSS', 'Jest', 'React Testing Library'],
      },
      {
         company: 'Prieto & Spina',
         companyUrl: 'https://pesadvocacia.com.br',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         endDate: '2022-5-1',
         startDate: '2019-7-1',
         description: prietoSpinaDesc.toString(),
         sidebar: prietoSpinaSide.toString(),
         logoUrl: '/images/companies/prietospina_logo.png',
         skills: ['JavaScript', 'Material UI', 'React', 'TypeScript', 'Node.js', 'Next.js', 'REST API', 'Firebase', 'Firestore', 'HTML', 'CSS', 'SCSS', 'Jest', 'Express', 'Microservices', 'Redis', 'React Testing Library'],
      }
   ];
}
