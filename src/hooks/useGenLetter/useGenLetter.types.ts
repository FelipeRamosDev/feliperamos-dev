import { SocketClient } from "@/services";
import { LetterData } from "@/types/database.types";

export type GenerateLetterStatus = 'starting' | 'generating' | 'success' | 'error';

export interface GenerateLetterParams {
   opportunityId: number;
   aiThreadID?: string;
   currentLetter?: string;
   body?: string;
   additionalMessage?: string;
   roomId?: string | null;
   agentId?: string;
}

export interface GenerateLetterResponse {
   letterSubject: string;
   letterBody: string;
}

export interface GenerateLetterContext {
   initLetter: Partial<LetterData> | null;
   isConnected: boolean;
   generateStatus: GenerateLetterStatus;
   connect: () => Promise<SocketClient | void>;
   generateLetter: (params: GenerateLetterParams, callback?: (response: GenerateLetterResponse) => void) => void;
   setInitLetter: (letter: Partial<LetterData> | null) => void;
   setGenerateStatus: (status: GenerateLetterStatus) => void;
   addStatusListener: () => void;
}
