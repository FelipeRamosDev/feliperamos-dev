import { SocketClient } from "@/services";
import { LetterData, OpportunityData } from "@/types/database.types";

export type GenerateLetterStatus = 'starting' | 'generating' | 'success' | 'error';

export interface GenerateLetterParams {
   opportunityId: number;
   currentLetter?: string;
   body?: string;
   prompt?: string;
   roomId?: string | null;
   agentId?: string;
   context?: Record<string, unknown>;
}

export interface GenerateLetterResponse {
   subject: string;
   body: string;
   success?: boolean;
   opportunity?: OpportunityData;
   messageId?: string;
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
