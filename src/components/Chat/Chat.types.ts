import Message from '@/models/Message';

export type ChatInputProps = {
   setInput: (value: string) => void;
   setMessage: () => void;
   value: string;
   padding?: 'xs'|'s'|'m'|'l'|'xl';
   className?: string | string[] | undefined;
};

export type ChatProps = {
   className?: string | undefined;
};

export type ChatMessageProps = {
   message: Message;
   className?: string | undefined;
};

export type ChatState = {
   history: Message[];
   inputValue: string;
}

export type ChatFormProps = {
   chat: ChatState;
   dispatch: (action: ChatStateAction) => void;
   className?: string | string[] | undefined;
}

export type ChatStateAction = {
   type: string;
   value: string;
}
