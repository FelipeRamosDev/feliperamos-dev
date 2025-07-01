import Message from "@/models/Message";

export type ChatState = {
   history: Message[];
   inputValue: string;
   chatState: boolean;
   threadID: string | null;
}

export type ChatSelector = {
   chat: ChatState;
}
