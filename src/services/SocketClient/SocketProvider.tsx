'use client';

/**
 * SocketClient Context
 * React context for global socket management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketClient from './SocketClient';
import {
   SocketClientConfig,
   SocketConnectionState,
   SocketClientStats,
   SocketEmitEvent
} from './SocketClient.types';

interface SocketContextValue {
   socket: SocketClient | null;
   connectionState: SocketConnectionState;
   stats: SocketClientStats;
   connect: () => Promise<void>;
   disconnect: () => void;
   emit: SocketEmitEvent;
   joinRoom: (roomId: string, password?: string) => void;
   leaveRoom: (roomId: string) => void;
   sendToRoom: (roomId: string, event: string, message: unknown) => void;
   isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
   children: React.ReactNode;
   config?: SocketClientConfig;
}

export function SocketProvider({ children, config = {} }: SocketProviderProps) {
   const [socket, setSocket] = useState<SocketClient | null>(null);
   const [connectionState, setConnectionState] = useState<SocketConnectionState>({
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      reconnectCount: 0
   });
   const [stats, setStats] = useState<SocketClientStats>({
      totalConnections: 0,
      totalDisconnections: 0,
      totalReconnections: 0,
      messagesReceived: 0,
      messagesSent: 0
   });

   useEffect(() => {
      const socketConfig: SocketClientConfig = {
         url: 'http://localhost:5000',
         autoConnect: true,
         ...config
      };

      const socketClient = new SocketClient(socketConfig);
      setSocket(socketClient);

      // Setup state update listeners
      const updateConnectionState = () => {
         setConnectionState(socketClient.getConnectionState());
      };

      const updateStats = () => {
         const newStats = socketClient.getStats();

         // Only update if stats have actually changed
         setStats(currentStats => {
            // Deep comparison to prevent unnecessary re-renders
            if (
               currentStats.totalConnections === newStats.totalConnections &&
               currentStats.totalDisconnections === newStats.totalDisconnections &&
               currentStats.totalReconnections === newStats.totalReconnections &&
               currentStats.messagesReceived === newStats.messagesReceived &&
               currentStats.messagesSent === newStats.messagesSent
            ) {
               return currentStats; // Return same object to prevent re-render
            }

            return newStats; // Return new stats only if changed
         });
      };

      socketClient.on('connect', updateConnectionState);
      socketClient.on('disconnect', updateConnectionState);
      socketClient.on('reconnect', updateConnectionState);
      socketClient.on('reconnecting', updateConnectionState);
      socketClient.on('error', updateConnectionState);

      // Update stats periodically
      const statsInterval = setInterval(updateStats, 1000);

      return () => {
         clearInterval(statsInterval);
         socketClient.destroy();
      };
   }, [config]);

   const connect = async () => {
      if (socket) {
         await socket.connect();
         setConnectionState(socket.getConnectionState());
      }
   };

   const disconnect = () => {
      if (socket) {
         socket.disconnect();
         setConnectionState(socket.getConnectionState());
      }
   };

   const emit = (event: string, data?: unknown, callback?: (response: unknown) => void) => {
      return socket?.emit(event, data, callback) || false;
   };

   const joinRoom = (roomId: string, password?: string) => {
      socket?.joinRoom(roomId, password);
   };

   const leaveRoom = (roomId: string) => {
      socket?.leaveRoom(roomId);
   };

   const sendToRoom = (roomId: string, event: string, message: unknown) => {
      socket?.sendToRoom(roomId, event, message);
   };

   const value: SocketContextValue = {
      socket,
      connectionState,
      stats,
      connect,
      disconnect,
      emit,
      joinRoom,
      leaveRoom,
      sendToRoom,
      isConnected: connectionState.isConnected
   };

   return (
      <SocketContext.Provider value={value}>
         {children}
      </SocketContext.Provider>
   );
}

export function useSocket(): SocketContextValue {
   const context = useContext(SocketContext);
   if (context === undefined) {
      throw new Error('useSocket must be used within a SocketProvider');
   }
   return context;
}

export default SocketProvider;
