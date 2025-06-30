/**
 * SocketClient Hook
 * React hook for managing socket connections
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import SocketClient from './SocketClient';
import { 
   SocketClientConfig, 
   SocketConnectionState, 
   SocketEventCallback,
   SocketClientStats 
} from './SocketClient.types';

export interface UseSocketClientOptions extends SocketClientConfig {
   autoConnect?: boolean;
   dependencies?: any[];
}

export interface UseSocketClientReturn {
   socket: SocketClient | null;
   connectionState: SocketConnectionState;
   stats: SocketClientStats;
   connect: () => Promise<void>;
   disconnect: () => void;
   emit: (event: string, data?: any) => boolean;
   joinRoom: (roomId: string, password?: string) => void;
   leaveRoom: (roomId: string) => void;
   sendToRoom: (roomId: string, event: string, message: any) => void;
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

   // Initialize socket client
   useEffect(() => {
      const config: SocketClientConfig = {
         url: options.url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000',
         autoConnect: options.autoConnect ?? true,
         ...options
      };

      socketRef.current = new SocketClient(config);

      // Setup state update listeners
      socketRef.current.on('connect', () => {
         setConnectionState(socketRef.current!.getConnectionState());
      });

      socketRef.current.on('disconnect', () => {
         setConnectionState(socketRef.current!.getConnectionState());
      });

      socketRef.current.on('reconnect', () => {
         setConnectionState(socketRef.current!.getConnectionState());
      });

      socketRef.current.on('reconnecting', () => {
         setConnectionState(socketRef.current!.getConnectionState());
      });

      socketRef.current.on('error', () => {
         setConnectionState(socketRef.current!.getConnectionState());
      });

      // Update stats periodically
      statsIntervalRef.current = setInterval(() => {
         if (socketRef.current) {
            setStats(socketRef.current.getStats());
         }
      }, 1000);

      return () => {
         if (statsIntervalRef.current) {
            clearInterval(statsIntervalRef.current);
         }
         if (socketRef.current) {
            socketRef.current.destroy();
         }
      };
   }, [options.dependencies || []]);

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

   const emit = useCallback((event: string, data?: any) => {
      return socketRef.current?.emit(event, data) || false;
   }, []);

   const joinRoom = useCallback((roomId: string, password?: string) => {
      socketRef.current?.joinRoom(roomId, password);
   }, []);

   const leaveRoom = useCallback((roomId: string) => {
      socketRef.current?.leaveRoom(roomId);
   }, []);

   const sendToRoom = useCallback((roomId: string, event: string, message: any) => {
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
      isConnected: connectionState.isConnected
   };
}

export default useSocketClient;
