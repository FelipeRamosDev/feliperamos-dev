import { TextResources } from '@/services';

const experienceText = new TextResources();

experienceText.create('Experience.title', 'Work Experience');
experienceText.create('Experience.title', 'Experiência Profissional', 'pt-BR');

experienceText.create('Experience.description', 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.');
experienceText.create('Experience.description', 'Confira abaixo minha experiência profissional. As empresas para as quais trabalhei e um resumo das minhas responsabilidades em cada uma estão abaixo.', 'pt-BR');

experienceText.create('Experience.work.date', (date: string) => {
   const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
   const dateObj = new Date(date);

   const month = months[dateObj.getMonth()];
   const year = dateObj.getFullYear();

   return `${month} ${year}`;
});

experienceText.create('Experience.work.date', (date: string) => {
   const months = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ];
   const dateObj = new Date(date);

   const month = months[dateObj.getMonth()];
   const year = dateObj.getFullYear();

   return `${month} ${year}`;
}, 'pt-BR');

experienceText.create('Experience.candlePilot.description', `
#### Responsibilities:
- Back-end server planning architecture
- Implementing the Node.js cluster with its cores threads
- Creating worker threads endpoints
- Creating HTTP endpoints for front-end communication
- Implementing "bot editing" features
- Implementing "bot runner" features
- Creating the socket server
- Implementing front-end base (auth states, pages, providers, etc) with Next.js
- Developing the rest of beta front-end
- Integrating with Binance API
- And More
`);

experienceText.create('Experience.candlePilot.description', `
#### Responsabilidades:
- Planejamento da arquitetura do servidor back-end
- Implementação do cluster do Node.js com seus threads de núcleo
- Criação de endpoints para worker threads
- Criação de endpoints HTTP para comunicação com o front-end
- Implementação de funcionalidades de "edição de bot"
- Implementação de funcionalidades de "execução de bot"
- Criação do servidor de socket
- Implementação da base do front-end (estados de autenticação, páginas, providers, etc) com Next.js
- Desenvolvimento do restante do front-end beta
- Integração com a API da Binance
- E mais
`, 'pt-BR');

experienceText.create('Experience.candlePilot.sidebar', ' ');
experienceText.create('Experience.candlePilot.sidebar', ' ', 'pt-BR');

experienceText.create('Experience.osf.description', `
#### Responsibilities:
- Implementing new features requested by the clients
- Investigating bugs reported on JIRA
- Providing fixes for the bugs investigated
- Global team
- Big companies projects
- Implementing improvements on the SFRA base template used by the company
`);

experienceText.create('Experience.osf.description', `
#### Responsabilidades:
- Implementing new features requested by the clients
- Investigating bugs reported on JIRA
- Providing fixes for the bugs investigated
- Global team
- Big companies projects
- Implementing improvements on the SFRA base template used by the company
`, 'pt-BR');

experienceText.create('Experience.osf.sidebar', ' ');
experienceText.create('Experience.osf.sidebar', ' ', 'pt-BR');

experienceText.create('Experience.adamRobo.description', `
#### Responsibilities:
- Implementing new print feature on their web app
- The new feature will use the browser's Bluetooth API to
- establish a connection with the thermal printer
- Implemented with success the new feature so the user can
- print the exam result executed on the app
`);

experienceText.create('Experience.adamRobo.description', `
#### Responsabilidades:
- Implementação de nova funcionalidade de impressão no aplicativo web
- A nova funcionalidade usará a API Bluetooth do navegador para
- estabelecer uma conexão com a impressora térmica
- Implementação bem-sucedida da nova funcionalidade para que o usuário possa
- imprimir o resultado do exame executado no aplicativo
`, 'pt-BR');

experienceText.create('Experience.adamRobo.sidebar', ' ');
experienceText.create('Experience.adamRobo.sidebar', ' ', 'pt-BR');

experienceText.create('Experience.pradoBecker.description', `
#### Responsibilities:
- Implementing the site base
- Creating auth areas
- Creating DB collections
- Implementing the whole site development
- Publishing to Vercel
`);

experienceText.create('Experience.pradoBecker.description', `
#### Responsabilidades:
- Implementação da base do site
- Criação de áreas de autenticação
- Criação de coleções de banco de dados
- Implementação de todo o desenvolvimento do site
- Publicação no Vercel
`, 'pt-BR');

experienceText.create('Experience.pradoBecker.sidebar', ' ');
experienceText.create('Experience.pradoBecker.sidebar', ' ', 'pt-BR');

experienceText.create('Experience.prietoSpina.description', `
#### Responsibilities:
- Planning DB Schema
- Creating Dashboard base and Authentication
- Implementing CRM development
- Creating the chat script
- Implementing the contract's signature
- Implementing Backend to serve the heaviest tasks (PDF Generation and E-Mails)
`);

experienceText.create('Experience.prietoSpina.description', `
#### Responsabilidades:
- Planejamento do esquema do banco de dados
- Criação da base do Dashboard e autenticação
- Implementação do desenvolvimento do CRM
- Criação do script de chat
- Implementação da assinatura de contrato
- Implementação do Backend para atender as tarefas mais pesadas (Geração de PDF e E-Mails)
`, 'pt-BR');

experienceText.create('Experience.prietoSpina.sidebar', ' ');
experienceText.create('Experience.prietoSpina.sidebar', ' ', 'pt-BR');

export default experienceText;
