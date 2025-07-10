import { TextResources } from '@/services';

const experienceText = new TextResources();

experienceText.create('Experience.title', 'Work Experience');
experienceText.create('Experience.title', 'Experiência Profissional', 'pt');

experienceText.create('Experience.description', 'Check below my work experience. The companies I worked and a summary of my responsibilities for each one.');
experienceText.create('Experience.description', 'Confira abaixo minha experiência profissional. As empresas para as quais trabalhei e um resumo das minhas responsabilidades em cada uma estão abaixo.', 'pt');

experienceText.create('Experience.work.date', (date: string) => {
   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
   const dateObj = new Date(date);

   const month = months[dateObj.getMonth()];
   const year = dateObj.getFullYear();

   return `${month} ${year}`;
});

experienceText.create('Experience.work.date', (date: string) => {
   const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
   const dateObj = new Date(date);

   const month = months[dateObj.getMonth()];
   const year = dateObj.getFullYear();

   return `${month} ${year}`;
}, 'pt');

experienceText.create('Experience.candlePilot.description', `
#### Summary
CandlePilot is a platform for trading bots, where users can create, edit, and run their bots. The platform integrates with the Binance API to execute trades based on user-defined strategies. I participated in the development of both the back-end and front-end of beta version of the platform, implementing features such as bot editing, bot running, and integrating with the Binance API. The platform is built using Node.js for the back-end and Next.js for the front-end.

##### Back-end:
I was responsible for the implementation of the back-end services, including the design and development of RESTful APIs, integration with third-party services, and database management. I worked with Node.js and Express to build scalable and efficient server-side applications. I also implemented the Node.js cluster to utilize multi-core processing, allowing for better performance and scalability of the application. 

##### Front-end:
On the front-end, I worked with Next.js to create a responsive and user-friendly interface. I implemented features such as authentication, bot management, and real-time updates using WebSockets. The front-end communicates with the back-end through RESTful APIs, allowing for seamless interaction between the two layers. 
`);

experienceText.create('Experience.candlePilot.description', `
#### Resumo
CandlePilot é uma plataforma para bots de trading, onde os usuários podem criar, editar e executar seus bots. A plataforma integra-se com a API da Binance para executar negociações com base em estratégias definidas pelos usuários. Participei do desenvolvimento tanto do back-end quanto do front-end da versão beta da plataforma, implementando recursos como edição de bots, execução de bots e integração com a API da Binance. A plataforma é construída usando Node.js para o back-end e Next.js para o front-end.

##### Back-end:
Fui responsável pela implementação dos serviços de back-end, incluindo o design e desenvolvimento de APIs RESTful, integração com serviços de terceiros e gerenciamento de banco de dados. Trabalhei com Node.js e Express para construir aplicações do lado do servidor escaláveis e eficientes. Também implementei o cluster do Node.js para utilizar o processamento multi-core, permitindo melhor desempenho e escalabilidade da aplicação.

##### Front-end:
No front-end, trabalhei com Next.js para criar uma interface responsiva e amigável ao usuário. Implementei recursos como autenticação, gerenciamento de bots e atualizações em tempo real usando WebSockets. O front-end se comunica com o back-end por meio de APIs RESTful, permitindo uma interação perfeita entre as duas camadas.
`, 'pt');

experienceText.create('Experience.candlePilot.sidebar', `
#### Responsibilities:
- Back-end server planning **architecture**
- Implementing the **Node.js cluster with its cores threads**
- Creating **worker threads endpoints**
- Creating **HTTP endpoints for front-end communication**
- **Trader Bot** management features
- **Trader Bot** runner loop features
- Creating the **Socket.IO server**
- Implementing front-end features (auth states, pages, providers, etc) with **Next.js**
- Integrating with **Binance API**
`);

experienceText.create('Experience.candlePilot.sidebar', `
#### Responsabilidades:
- Planejamento da **arquitetura** do servidor back-end
- Implementação do **cluster Node.js com suas threads de núcleos**
- Criação de **endpoints para threads de trabalho**
- Criação de **endpoints HTTP** para comunicação com o front-end
- Implementação de recursos de **gerenciamento de Trader Bot**
- Implementação de recursos de **execução de Trader Bot**
- Criação do **servidor Socket.IO**
- Implementação da base do front-end (estados de autenticação, páginas, provedores, etc) com **Next.js**
- Desenvolvimento do restante do front-end beta
- Integração com a **API do Binance**
`, 'pt');

experienceText.create('Experience.osf.description', `
#### Summary
OSF Digital is a Canadian company with a global presence, specializing in the development, maintenance, and evolution of websites and CRMs based on the Salesforce Commerce Cloud platform. I worked for over two years as a front-end developer and later as a full-stack developer, integrating international and multicultural teams with 100% English communication.

During this period, I participated in large-scale projects for brands such as L'Oréal, Black & Decker, and Tramontina, working on critical demands with high scale and real impact. I was responsible for implementing integrations like Amazon Pay on the SiteGenesis base, optimizing systems with severe performance bottlenecks (such as KalTire's store scheduling), and developing strategic promotional pages under challenging deadlines, like Tramontina's Black Friday landing page.

I utilized technologies such as JavaScript, React, Vue.js, Next.js, Node.js, as well as modern tools like Docker, GitLab CI/CD, and Salesforce Commerce Cloud. I also had the opportunity to act as a technical mentor for junior developers, reinforcing my leadership, collaboration, and teaching skills in high-demand technical environments.
`);

experienceText.create('Experience.osf.description', `
#### Resumo
A OSF Digital é uma empresa canadense com atuação global, especializada no desenvolvimento, manutenção e evolução de websites e CRMs baseados na plataforma Salesforce Commerce Cloud. Atuei por mais de dois anos como desenvolvedor front-end e posteriormente full-stack, integrando times internacionais e multiculturais com comunicação 100% em inglês.

Durante esse período, participei de projetos de grande porte para marcas como L'Oréal, Black & Decker e Tramontina, atuando em demandas críticas de alta escala e impacto real. Fui responsável por implementar integrações como o Amazon Pay na base SiteGenesis, otimizar sistemas com severos gargalos de performance (como o agendamento de lojas da KalTire) e desenvolver páginas promocionais estratégicas em prazos desafiadores, como a landing page da Black Friday da Tramontina.

Utilizei tecnologias como JavaScript, React, Vue.js, Next.js, Node.js, além de ferramentas modernas como Docker, GitLab CI/CD e Salesforce Commerce Cloud. Também tive a oportunidade de atuar como mentor técnico de desenvolvedores juniores, reforçando minha capacidade de liderança, colaboração e didática em ambientes de alta exigência técnica.
`, 'pt');

experienceText.create('Experience.osf.sidebar', `
#### Responsibilities
- Investigating and fixing bugs reported by the clients in **JIRA**
- Implementing **new features** requested by the clients
- Development of new features for the **SFRA base template** used by the company
- Assist in **mentoring** junior developers
- Collaborating with **Support Team**
`);
experienceText.create('Experience.osf.sidebar', `
#### Responsabilidades
- Investigação e correção de bugs reportados pelos clientes no **JIRA**
- Implementação de **novas funcionalidades** solicitadas pelos clientes
- Desenvolvimento de novas funcionalidades para o **template base SFRA** utilizado pela empresa
- Assistência no **mentoring** de desenvolvedores juniores
- Colaboração com a **Equipe de Suporte**
`, 'pt');

experienceText.create('Experience.adamRobo.description', `
#### Summary
Adam Robô is a Brazilian startup that participated in an episode of Shark Tank Brasil and stands out for developing a portable device for conducting eye exams in populations living in remote areas with little or no access to specialized medical services.

At the company, I was responsible for participating in the integration of the web application (developed in React) with a thermal printer via Bluetooth, allowing for immediate printing of exam results even in locations without internet connection. The solution was implemented using the Web Bluetooth API, ensuring direct communication between the browser and the hardware, with full offline functionality.

This project involved significant technical challenges — such as browser compatibility, local data handling, and interaction with physical devices — and represented an important expansion of my skills in offline web solutions, hardware integration, and development focused on real social impact.
`);

experienceText.create('Experience.adamRobo.description', `
#### Resumo
A Adam Robô é uma startup brasileira que participou de um episódio do Shark Tank Brasil e se destaca pelo desenvolvimento de um equipamento portátil para a realização de exames oculares em populações que vivem em regiões remotas, com pouco ou nenhum acesso a serviços médicos especializados.

Na empresa, fui responsável por participar da integração da aplicação web (desenvolvida em React) com uma impressora térmica via Bluetooth, permitindo a impressão imediata dos resultados dos exames mesmo em locais sem conexão com a internet. A solução foi implementada utilizando a Web Bluetooth API, garantindo a comunicação direta entre o navegador e o hardware, com total funcionamento offline.

Esse projeto envolveu desafios técnicos significativos — como a compatibilidade entre navegadores, o tratamento local dos dados e a interação com dispositivos físicos — e representou uma importante ampliação das minhas habilidades em soluções web offline, integração com hardware e desenvolvimento voltado a impacto social real.
`, 'pt');

experienceText.create('Experience.adamRobo.sidebar', `
#### Responsibilities:
- Implementing new print feature on their web app
- The new feature will use the browser's Bluetooth API to
- Establish a connection with the thermal printer
- Implemented with success the new feature so the user can
- Print the exam result executed on the app
`);

experienceText.create('Experience.adamRobo.sidebar', `
#### Responsabilidades:
- Implementação de nova funcionalidade de impressão na aplicação web
- A nova funcionalidade utiliza a API Bluetooth do navegador para
- Estabelecer uma conexão com a impressora térmica
- Implementação bem-sucedida da nova funcionalidade para que o usuário possa
- Imprimir o resultado do exame realizado na aplicação
`, 'pt');

experienceText.create('Experience.pradoBecker.description', `
#### Summary
The law firm Prado & Becker needed a modern and functional institutional website, with the ability to display legal articles and success cases — judicial processes that had been won with distinction.

I was responsible for the complete development of the application, using Next.js on the front-end to ensure high performance, SSR, and good indexing in search engines, and Firebase (Firestore) as back-end for data storage and management.

I also implemented a custom administrative panel, accessible only to the firm's lawyers, allowing for the registration, editing, and deletion of articles and success cases. All content managed in the panel was automatically displayed on the homepage, keeping the site always updated with the most relevant publications.
`);

experienceText.create('Experience.pradoBecker.description', `
#### Resumo
O escritório de advocacia Prado & Becker precisava de um site institucional moderno e funcional, com a capacidade de exibir artigos jurídicos e casos de sucesso — processos judiciais que haviam sido vencidos com destaque.

Fui responsável pelo desenvolvimento completo da aplicação, utilizando Next.js no front-end para garantir alta performance, SSR e boa indexação em buscadores, e Firebase (Firestore) como back-end para armazenamento e gestão dos dados.

Implementei também um painel administrativo customizado, acessível apenas para os advogados do escritório, permitindo o cadastro, edição e exclusão de artigos e casos de sucesso. Todo o conteúdo gerenciado no painel era exibido automaticamente na homepage, mantendo o site sempre atualizado com as publicações mais relevantes.

Esse projeto consolidou ainda mais minha atuação como desenvolvedor full-stack JavaScript, unindo usabilidade, performance e integração com banco de dados em nuvem em uma solução prática e escalável.
`, 'pt');

experienceText.create('Experience.pradoBecker.sidebar', `
#### Responsibilities:
- Development of the UX/UI design of the site in Figma
- Creation of prototypes and wireframes for idea validation
- Development of the base components of the site
- Development of authentication components and administrative areas
- Implementation of collections in Firestore for data storage
- Implementation of the entire site development
- Deployment of the site on Vercel
`);
experienceText.create('Experience.pradoBecker.sidebar', `
#### Responsabilidades:
- Desenvolvimento da design UX/UI do site no Figma
- Criação de protótipos e wireframes para validação de ideias
- Desenvolvimento dos componentes base do site
- Desenvolvimento de componentes de autenticação e áreas administrativas
- Implementação de coleções no Firestore para armazenamento de dados
- Implementação de todo o desenvolvimento do site
- Publicação do site na Vercel
`, 'pt');

experienceText.create('Experience.prietoSpina.description', `
#### Summary
For the law firm **Prieto & Spina**, I developed a **complete and customized CRM** aimed at organizing client service and automating the generation and signing of legal fee contracts. The system started with **pure JavaScript**, but as complexity increased, I migrated the application to **React** and **Next.js**, modernizing the entire codebase.

The system's flow begins with an **interactive chat on the website**, where the client answers questions defined in a **configurable admin panel**. The responses automatically populate a service record and generate a pre-filled contract, ready for signature.

I implemented an **online signature system**, where the client photographs their signature made on paper. This image is processed with pixel-by-pixel tracking to remove the white background and compose a **unique digital signature**, which is inserted directly into the body of the contract.

#### Other features included:
- Automated generation of **PDFs** with the final signed contract;
- Sending of **automatic emails** to the parties involved;
- **Internal panel for lawyers**, with complete history of service records, contracts, and client data;
- Integration with **Firebase Firestore** for data storage;
- **Scalable structure** and continuous maintenance for over 2 years.
`);

experienceText.create('Experience.prietoSpina.description', `
#### Resumo
Para o escritório **Prieto & Spina**, desenvolvi um **CRM completo e personalizado** com o objetivo de organizar o atendimento a clientes e automatizar a geração e assinatura de contratos de honorários advocatícios. O sistema começou com **JavaScript puro**, mas com o aumento da complexidade, migrei a aplicação para **React** e **Next.js**, modernizando toda a base de código.

O fluxo do sistema começa por um **chat interativo no site**, onde o cliente responde a perguntas definidas em um **painel administrativo configurável**. As respostas alimentam automaticamente uma ficha de atendimento e geram o pré-preenchimento de um contrato, pronto para assinatura.

Implementei um sistema de **assinatura online**, em que o cliente fotografa sua assinatura feita em papel. Essa imagem é processada com rastreamento pixel a pixel para remoção de fundo branco e composição de uma **assinatura digital única**, que é inserida diretamente no corpo do contrato.

#### Outras funcionalidades incluídas:

- Geração automatizada de **PDFs** com o contrato final assinado;
- Envio de **e-mails automáticos** para os envolvidos;
- **Painel interno para advogados**, com histórico completo de atendimentos, contratos e dados dos clientes;
- Integração com **Firebase Firestore** para armazenamento de dados;
- **Estrutura escalável** e manutenção contínua por mais de 2 anos.

Esse projeto foi um dos mais robustos da minha carreira, onde atuei de forma **full-stack**, liderando tanto o front quanto o back-end e entregando uma solução sob medida para o setor jurídico.
`, 'pt');

experienceText.create('Experience.prietoSpina.sidebar', `
#### Responsibilities:
- Development of the UX/UI design of the site in Figma
- Implementation of base templates for application construction
- Implementation of authentication components and administrative areas
- Development of interactive chat for collecting client information and generating contracts
- Implementation of the digital signature system with image processing
- Implementation of the Back-end to handle heavier tasks (PDF generation and email sending)
- Development of collections in Firestore for data storage
- Implementation of the continuous deployment system with Vercel
- Development of the entire CRM structure
- Implementation of automated tests
- Deployment of the application on Vercel
`);
experienceText.create('Experience.prietoSpina.sidebar', `
#### Responsabilidades:
- Desenvolvimento do design UX/UI do site no Figma
- Implementação de templates base para construção da aplicação
- Implementação de componentes de autenticação e áreas administrativas
- Desenvolvimento de chat interativo para coleta de informações do cliente e geração de contratos
- Implementação do sistema de assinatura digital com processamento de imagem
- Implementação do Back-end para lidar com tarefas mais pesadas (geração de PDFs e envio de e-mails)
- Desenvolvimento de coleções no Firestore para armazenamento de dados
- Implementação do sistema de deploy contínuo com Vercel
- Desenvolvimento de toda a estrutura do CRM
- Implementação de testes automatizados
- Publicação da aplicação na Vercel
`, 'pt');

export default experienceText;
