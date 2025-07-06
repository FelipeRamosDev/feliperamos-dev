export type TextResourceFunction = (...params: string[]) => string;  

export interface TextResourcesMap {
   [key: string]: Map<string, string | TextResourceFunction>;
}
