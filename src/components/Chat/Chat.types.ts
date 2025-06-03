import Message from '@/models/Message';

export type ChatInputProps = {
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

export type ChatFormProps = {
   className?: string | string[] | undefined;
}

