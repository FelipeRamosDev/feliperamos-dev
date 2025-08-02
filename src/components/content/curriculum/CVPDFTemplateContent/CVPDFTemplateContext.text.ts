import { dataViewString, dateDifference } from '@/helpers/date.helpers';
import { TextResources } from '@/services';

function dateDiffYearMonth(startDate: string, endDate: string): { year: number, month: number } {
   const years = dateDifference(new Date(startDate), new Date(endDate), 'year');
   const months = dateDifference(new Date(startDate), new Date(endDate), 'month');
   const restMonths = months % 12;

   return {
      year: years,
      month: restMonths
   };
}

const textResources = new TextResources();

// CVPDFHeader
textResources.create('CVPDFHeader.header.github', 'GitHub Profile');
textResources.create('CVPDFHeader.header.github', 'Perfil do GitHub', 'pt');

textResources.create('CVPDFHeader.header.linkedin', 'LinkedIn Profile');
textResources.create('CVPDFHeader.header.linkedin', 'Perfil do LinkedIn', 'pt');

textResources.create('CVPDFHeader.header.website', 'Website');
textResources.create('CVPDFHeader.header.website', 'Website', 'pt');

textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp');
textResources.create('CVPDFHeader.header.whatsapp', 'WhatsApp', 'pt');

textResources.create('CVPDFHeader.header.experienceTime', (time: string) => `+${Math.round(Number(time))} years of Experience`);
textResources.create('CVPDFHeader.header.experienceTime', (time: string) => `+${Math.round(Number(time))} anos de Experiência`, 'pt');

// CVPDFExperiences
textResources.create('CVPDFExperiences.experiences.title', 'Work Experience');
textResources.create('CVPDFExperiences.experiences.title', 'Experiência de Trabalho', 'pt');

textResources.create('CVPDFExperiences.experienceHeader.title', (position: string, company: string) => `${position} at ${company}`);
textResources.create('CVPDFExperiences.experienceHeader.title', (position: string, company: string) => `${position} na ${company}`, 'pt');

textResources.create('CVPDFExperiences.experienceHeader.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'en');
   const endDate = dataViewString(new Date(end_date), dateType, 'en');

   return `${startDate} to ${endDate}`;
});
textResources.create('CVPDFExperiences.experienceHeader.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'pt');
   const endDate = dataViewString(new Date(end_date), dateType, 'pt');

   return `${startDate} a ${endDate}`;
}, 'pt');

textResources.create('CVPDFExperiences.experienceHeader.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   return `(${year} years and ${month} months)`;
});
textResources.create('CVPDFExperiences.experienceHeader.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   return `(${year} anos e ${month} meses)`;
}, 'pt');

textResources.create('CVPDFExperiences.experiences.subtitle', 'Check below a summary of my work experience.');
textResources.create('CVPDFExperiences.experiences.subtitle', 'Confira abaixo um resumo da minha experiência profissional.', 'pt');

textResources.create('CVPDFExperiences.experiences.summary', 'Summary');
textResources.create('CVPDFExperiences.experiences.summary', 'Resumo', 'pt');

textResources.create('CVPDFExperiences.experiences.description', 'Description');
textResources.create('CVPDFExperiences.experiences.description', 'Descrição', 'pt');

textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsibilities');
textResources.create('CVPDFExperiences.experiences.responsibilities', 'Responsabilidades', 'pt');

// CVPDFSkills
textResources.create('CVPDFSkills.title', 'Skills');
textResources.create('CVPDFSkills.title', 'Habilidades', 'pt');

textResources.create('CVPDFSkills.subtitle', 'Programming Languages, Frameworks, Development Tools, Libraries, and others.');
textResources.create('CVPDFSkills.subtitle', 'Linguagens de Programação, Frameworks, Ferramentas de Desenvolvimento, Bibliotecas e outros', 'pt');

export default textResources;
