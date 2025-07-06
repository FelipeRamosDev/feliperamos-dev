import TextResources from "./TextResources";

export type TextResourceFunction = (...params: string[]) => string;
export type TextResourceValue = string | TextResourceFunction;

export interface TextResourcesMap {
   [key: string]: Map<string, TextResourceValue>;
}

export interface TextResourcesContextValue {
   textResources: TextResources;
}

export interface TextResourcesProviderProps {
   language?: string;
   allowedLanguages: string[];
   defaultLanguage?: string;
   children: React.ReactNode;
}
