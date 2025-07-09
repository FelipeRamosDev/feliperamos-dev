import { TextResources } from '@/services';

const chatHeaderText = new TextResources();

chatHeaderText.create('ChatHeader.assistantName', 'AI Assistant');
chatHeaderText.create('ChatHeader.assistantName', 'Assistente de IA', 'pt-BR');

chatHeaderText.create('ChatHeader.assistantDescription', 'Trained AI with Felipe\'s professional background and experience, ask anything!');
chatHeaderText.create('ChatHeader.assistantDescription', 'IA treinada com o histórico profissional e a experiência do Felipe, pergunte qualquer coisa!', 'pt-BR');

chatHeaderText.create('ChatHeader.avatarAlt', 'AI Assistant Avatar');
chatHeaderText.create('ChatHeader.avatarAlt', 'Avatar do Assistente de IA', 'pt-BR');

export default chatHeaderText;
