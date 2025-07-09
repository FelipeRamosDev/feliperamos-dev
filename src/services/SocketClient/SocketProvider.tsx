'use client';

/**
 * SocketClient Context
 * React context for global socket management
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import SocketClient from './SocketClient';
import type {
   SocketConnectionState,
   SocketClientStats,
   SocketContextValue,
   SocketProviderProps
} from './SocketClient.types';

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

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

   const socketConfig = useMemo(() => ({
      url: 'http://localhost:5000',
      autoConnect: true,
      ...config
   }), [config?.url, config?.autoConnect, config?.reconnectAttempts, config?.reconnectDelay, config?.timeout, config?.options]);

   useEffect(() => {
      try {
         const socketClient = new SocketClient(socketConfig);
         setSocket(socketClient);

         // Setup state update listeners
         const updateConnectionState = () => {
            try {
               setConnectionState(socketClient.getConnectionState());
            } catch (error) {
               console.error('Error updating connection state:', error);
            }
         };

         const updateStats = () => {
            try {
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
            } catch (error) {
               console.error('Error updating stats:', error);
            }
         };

         socketClient.on('connect', updateConnectionState);
         socketClient.on('disconnect', updateConnectionState);
         socketClient.on('reconnect', updateConnectionState);
         socketClient.on('reconnecting', updateConnectionState);
         socketClient.on('error', updateConnectionState);

         // Update stats periodically
         const statsInterval = setInterval(updateStats, 1000);

         return () => {
            try {
               if (typeof clearInterval !== 'undefined') {
                  clearInterval(statsInterval);
               }
            } catch (error) {
               console.error('Error clearing interval:', error);
            }
            socketClient.destroy();
         };
      } catch (error) {
         console.error('Error creating socket client:', error);
         setSocket(null);
      }
   }, [socketConfig]);

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
