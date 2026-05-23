'use client';

import React, { createContext, useContext, useState } from 'react';

export interface ChatManagerState {
   chatId: string | null;
   roomId: string | null;
}

interface ChatManagerValue {
   chat: ChatManagerState;
   setChat: (update: Partial<ChatManagerState>) => void;
   clear: () => void;
}

interface ChatManagerProviderProps {
   children: React.ReactNode;
   initialState?: Partial<ChatManagerState>;
}

const defaultState: ChatManagerState = {
   chatId: null,
   roomId: null,
};

const ChatManagerContext = createContext<ChatManagerValue | undefined>(undefined);

export function ChatManagerProvider({ children, initialState }: ChatManagerProviderProps) {
   const [chat, _setChat] = useState<ChatManagerState>({ ...defaultState, ...initialState });

   function setChat(update: Partial<ChatManagerState>) {
      _setChat(prev => ({ ...prev, ...update }));
   }

   function clear() {
      _setChat({ ...defaultState });
   }

   return React.createElement(
      ChatManagerContext.Provider,
      { value: { chat, setChat, clear } },
      children
   );
}

export function useChatManager(): ChatManagerValue {
   const context = useContext(ChatManagerContext);

   if (!context) {
      throw new Error('useChatManager must be used within a ChatManagerProvider');
   }

   return context;
}

export default ChatManagerContext;

