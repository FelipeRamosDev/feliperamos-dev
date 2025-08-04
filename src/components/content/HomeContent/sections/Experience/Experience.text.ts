import { dataViewString, dateDiffYearMonth } from '@/helpers/date.helpers';
import { TextResources } from '@/services';

const experienceText = new TextResources();

experienceText.create('Experience.title', 'Work Experience');
experienceText.create('Experience.title', 'Experiência Profissional', 'pt');

experienceText.create('Experience.description', 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.');
experienceText.create('Experience.description', 'Confira abaixo minha experiência profissional. As empresas para as quais trabalhei e um resumo das minhas responsabilidades em cada uma estão abaixo.', 'pt');

experienceText.create('Experience.item.title', (position, companyName) => `${position} at ${companyName}`);
experienceText.create('Experience.item.title', (position, companyName) => `${position} na ${companyName}`, 'pt');


experienceText.create('Experience.item.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'en');
   const endDate = dataViewString(new Date(end_date), dateType, 'en');

   return `${startDate} to ${endDate}`;
});
experienceText.create('Experience.item.experienceTime', (start_date: string, end_date: string) => {
   const dateType = 'abbMonth-fullYear';
   const startDate = dataViewString(new Date(start_date), dateType, 'pt');
   const endDate = dataViewString(new Date(end_date), dateType, 'pt');

   return `${startDate} a ${endDate}`;
}, 'pt');

experienceText.create('Experience.item.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   return `(${year} years and ${month} months)`;
});
experienceText.create('Experience.item.timeDifference', (startDate: string, endDate: string) => {
   const { year, month } = dateDiffYearMonth(startDate, endDate);
   return `(${year} anos e ${month} meses)`;
}, 'pt');


export default experienceText;
