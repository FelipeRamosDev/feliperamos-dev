import Message from "@/models/Message";

export type ChatState = {
   history: Message[];
   inputValue: string;
   chatState: boolean;
   threadID: string | null;
   assistantTyping: boolean;
}

export type ChatSelector = {
   chat: ChatState;
}
