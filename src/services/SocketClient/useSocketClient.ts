'use client';

/**
 * SocketClient Hook
 * React hook for managing socket connections
 */

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import SocketClient from './SocketClient';
import { 
   SocketClientConfig, 
   SocketConnectionState, 
   SocketClientStats 
} from './SocketClient.types';

export interface UseSocketClientOptions extends SocketClientConfig {
   autoConnect?: boolean;
   dependencies?: unknown[];
}

export interface UseSocketClientReturn {
   socket: SocketClient | null;
   connectionState: SocketConnectionState;
   stats: SocketClientStats;
   connect: () => Promise<void>;
   disconnect: () => void;
   emit: (event: string, data?: unknown) => boolean;
   joinRoom: (roomId: string, password?: string) => void;
   leaveRoom: (roomId: string) => void;
   sendToRoom: (roomId: string, event: string, message: unknown) => void;
   isConnected: boolean;
}

export function useSocketClient(options: UseSocketClientOptions = {}): UseSocketClientReturn {
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

   const socketRef = useRef<SocketClient | null>(null);
   const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

   // Memoize dependencies to avoid changing on every render
   const dependencies = useMemo(() => options.dependencies || [], [options.dependencies]);

   // Initialize socket client
   useEffect(() => {
      try {
         const config: SocketClientConfig = {
            url: options.url || 'http://localhost:5000',
            autoConnect: options.autoConnect ?? true,
            ...options
         };

         socketRef.current = new SocketClient(config);

         // Setup state update listeners
         socketRef.current.on('connect', () => {
            try {
               setConnectionState(socketRef.current!.getConnectionState());
            } catch (error) {
               console.error('[useSocketClient] Error updating connection state on connect:', error);
            }
         });

         socketRef.current.on('disconnect', () => {
            try {
               setConnectionState(socketRef.current!.getConnectionState());
            } catch (error) {
               console.error('[useSocketClient] Error updating connection state on disconnect:', error);
            }
         });

         socketRef.current.on('reconnect', () => {
            try {
               setConnectionState(socketRef.current!.getConnectionState());
            } catch (error) {
               console.error('[useSocketClient] Error updating connection state on reconnect:', error);
            }
         });

         socketRef.current.on('reconnecting', () => {
            try {
               setConnectionState(socketRef.current!.getConnectionState());
            } catch (error) {
               console.error('[useSocketClient] Error updating connection state on reconnecting:', error);
            }
         });

         socketRef.current.on('error', () => {
            try {
               setConnectionState(socketRef.current!.getConnectionState());
            } catch (error) {
               console.error('[useSocketClient] Error updating connection state on error:', error);
            }
         });

         // Update stats periodically
         statsIntervalRef.current = setInterval(() => {
            if (socketRef.current) {
               try {
                  setStats(socketRef.current.getStats());
               } catch (error) {
                  console.error('[useSocketClient] Error updating stats:', error);
               }
            }
         }, 1000);

         return () => {
            if (statsIntervalRef.current) {
               clearInterval(statsIntervalRef.current);
            }
            if (socketRef.current) {
               try {
                  socketRef.current.destroy();
               } catch (error) {
                  console.error('[useSocketClient] Error destroying socket client:', error);
               }
            }
         };
      } catch (error) {
         console.error('[useSocketClient] Error initializing socket client:', error);
         socketRef.current = null;
      }
   }, [options, dependencies]);

   const connect = useCallback(async () => {
      if (socketRef.current) {
         await socketRef.current.connect();
         setConnectionState(socketRef.current.getConnectionState());
      }
   }, []);

   const disconnect = useCallback(() => {
      if (socketRef.current) {
         socketRef.current.disconnect();
         setConnectionState(socketRef.current.getConnectionState());
      }
   }, []);

   const emit = useCallback((event: string, data?: unknown) => {
      return socketRef.current?.emit(event, data) || false;
   }, []);

   const joinRoom = useCallback((roomId: string, password?: string) => {
      socketRef.current?.joinRoom(roomId, password);
   }, []);

   const leaveRoom = useCallback((roomId: string) => {
      socketRef.current?.leaveRoom(roomId);
   }, []);

   const sendToRoom = useCallback((roomId: string, event: string, message: unknown) => {
      socketRef.current?.sendToRoom(roomId, event, message);
   }, []);

   return {
      socket: socketRef.current,
      connectionState,
      stats,
      connect,
      disconnect,
      emit,
      joinRoom,
      leaveRoom,
      sendToRoom,
      isConnected: connectionState?.isConnected || false
   };
}

export default useSocketClient;
