export type GenerateLetterStatus = 'starting' | 'generating' | 'success' | 'error';

export interface GenerateLetterParams {
   opportunityId: number;
   aiThreadID?: string;
   currentLetter?: string;
   additionalMessage?: string;
}

export interface GenerateLetterResponse {
   letterSubject: string;
   letterBody: string;
}
