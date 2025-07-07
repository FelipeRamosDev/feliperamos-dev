import { marked } from 'marked';
import candlePilotThumb from './images/candlepilot_thumb.png';
import { TextResources } from '@/services';
import { WorkExperienceModel } from './Experience.types';

export default function companies(experienceText: TextResources): WorkExperienceModel[] {
   const candlepilotDesc = marked.parse(experienceText.getText('Experience.candlePilot.description'));
   const osfDesc = marked.parse(experienceText.getText('Experience.osf.description'));
   const adamRoboDesc = marked.parse(experienceText.getText('Experience.adamRobo.description'));
   const pradoBeckerDesc = marked.parse(experienceText.getText('Experience.pradoBecker.description'));
   const prietoSpinaDesc = marked.parse(experienceText.getText('Experience.prietoSpina.description'));

   return [
      {
         company: 'CandlePilot',
         companyUrl: 'https://candlepilot.com',
         position: 'Fullstack Developer',
         workType: 'Contract',
         startDate: '2023-4-1',
         endDate: '2025-5-1',
         description: candlepilotDesc.toString(),
         logoUrl: '/images/companies/candlepilot_logo.svg',
         // thumbUrl: candlePilotThumb,
         skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      },
      {
         company: 'OSF Digital',
         companyUrl: 'https://osf.digital',
         position: 'Frontend Developer',
         workType: 'Fulltime',
         startDate: '2021-6-1',
         endDate: '2023-4-1',
         description: osfDesc.toString(),
         logoUrl: '/images/companies/osf_logo.svg',
         // thumbUrl: candlePilotThumb,
         skills: ['Salesforce (SFCC)', 'JavaScript', 'JQuery', 'HTML', 'CSS', 'React', 'TypeScript', 'Node.js', 'Vue.js', 'Next.js'],
      },
      {
         company: 'Adam Robô',
         // companyUrl: 'https://pradobecker.vercel.app',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         startDate: '2021-6-1',
         endDate: '2023-4-1',
         description: adamRoboDesc.toString(),
         // logoUrl: '/images/companies/pradobecker_logo.svg',
         // thumbUrl: candlePilotThumb,
         skills: ['JavaScript', 'React', 'TypeScript', 'Bluetooth API']
      },
      {
         company: 'Prado & Becker',
         companyUrl: 'https://pradobecker.vercel.app',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         startDate: '2021-6-1',
         endDate: '2023-4-1',
         description: pradoBeckerDesc.toString(),
         logoUrl: '/images/companies/pradobecker_logo.svg',
         // thumbUrl: candlePilotThumb,
         skills: ['JavaScript', 'Material UI', 'React', 'TypeScript', 'Node.js', 'Next.js'],
      },
      {
         company: 'Prieto & Spina',
         companyUrl: 'https://pesadvocacia.com.br',
         position: 'Fullstack Developer',
         workType: 'Freelance',
         endDate: '2021-1-1',
         startDate: '2019-12-1',
         description: prietoSpinaDesc.toString(),
         logoUrl: '/images/companies/prietospina_logo.png',
         // thumbUrl: candlePilotThumb,
         skills: ['JavaScript', 'Material UI', 'React', 'TypeScript', 'Node.js', 'Next.js'],
      }
   ];
}
