import { TextResources } from '@/services';

const chatText = new TextResources();

chatText.create('Chat.welcome1', 'Hi! Welcome to Felipe\'s AI-powered career chat!');
chatText.create('Chat.welcome2', 'I\'m his virtual assistant, here to answer any questions about his professional background and experience.');
chatText.create('Chat.welcome3', 'Ask me about his skills, projects, career journey, or anything else you\'d like to know!');
chatText.create('Chat.welcome1', 'Olá! Bem-vindo ao chat de carreira com inteligência artificial do Felipe!', 'pt-BR');
chatText.create('Chat.welcome2', 'Sou seu assistente virtual, aqui para responder a qualquer pergunta sobre o histórico profissional e a experiência dele.', 'pt-BR');
chatText.create('Chat.welcome3', 'Pergunte-me sobre as habilidades, projetos, trajetória profissional ou qualquer outra coisa que você gostaria de saber!', 'pt-BR');

chatText.create('Chat.assistantTyping', 'Assistant is typing...');
chatText.create('Chat.assistantTyping', 'O assistente está digitando...', 'pt-BR');

chatText.create('Chat.button.startChat', 'Talk to Assistant');
chatText.create('Chat.button.startChat', 'Falar com o Assistente', 'pt-BR');

export default chatText;
