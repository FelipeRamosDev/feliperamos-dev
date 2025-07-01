import Message from '@/models/Message';

export type ChatInputProps = {
   setMessage: (() => void) | undefined;
   padding?: 'xs'|'s'|'m'|'l'|'xl';
   className?: string | string[] | undefined;
};

export type ChatProps = {
   className?: string | undefined;
};

export type ChatMessageProps = {
   index: number;
   message: Message;
   className?: string | undefined;
};

export type ChatFormProps = {
   className?: string | string[] | undefined;
}

