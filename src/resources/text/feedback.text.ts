import { TextResources } from '@/services';

const textResources = new TextResources();

// Cover Letter Feedback Messages
textResources.create('coverLetter.feedback', (status: string) => {
   switch (status) {
      case 'starting':
         return 'Starting to generate the cover letter...';
      case 'generating':
         return 'Generating your cover letter...';
      case 'error':
         return 'There was an error generating the cover letter. Please try again.'
      default:
         return 'Unknown status';
   }
});

textResources.create('coverLetter.feedback', (status: string) => {
   switch (status) {
      case 'starting':
         return 'Iniciando a geração da carta de apresentação...';
      case 'generating':
         return 'Gerando sua carta de apresentação';
      case 'error':
         return 'Houve um erro ao gerar a carta de apresentação. Por favor, tente novamente.'
      default:
         return 'Unknown status';
   }
}, 'pt');

export default textResources;
