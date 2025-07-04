export interface ChatInputProps {
   setMessage?: (() => void);
   padding?: 'xs'|'s'|'m'|'l'|'xl';
   className?: string | string[] | undefined;
};

export interface ChatProps {
   className?: string | undefined;
};

export interface ChatMessageProps {
   index?: number | string;
   message: MessageSetup;
   genTimestamp?: boolean;
   className?: string | undefined;
};

export interface ChatFormProps {
   className?: string | string[] | undefined;
}

export interface MessageSetup {
   content: string;
   from: 'user' | 'assistant';
   timestamp?: number | undefined;
   self?: boolean;
   threadID?: string | null;
   dateString?: string | null;
   timeString?: string | null;
}
