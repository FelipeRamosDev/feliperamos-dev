/**
 * SocketClient Service
 * Frontend service for connecting to and interacting with the SocketServer
 */

import { io, Socket } from 'socket.io-client';
import {
   SocketClientConfig,
   SocketConnectionState,
   SocketEventCallback,
   SocketMessage,
   SocketClientStats,
   SocketEventNames,
   SocketClientEventMap
} from './SocketClient.types';

export class SocketClient {
   private socket: Socket | null = null;
   private config: SocketClientConfig;
   private connectionState: SocketConnectionState;
   private eventListeners: Map<string, SocketEventCallback[]> = new Map();
   private stats: SocketClientStats;
   private reconnectTimer: NodeJS.Timeout | null = null;

   constructor(config: SocketClientConfig = {}) {
      this.config = {
         url: 'http://localhost:5001',
         autoConnect: true,
         reconnectAttempts: 5,
         reconnectDelay: 2000,
         timeout: 10000,
         ...config
      };

      this.connectionState = {
         isConnected: false,
         isConnecting: false,
         isReconnecting: false,
         reconnectCount: 0
      };

      this.stats = {
         totalConnections: 0,
         totalDisconnections: 0,
         totalReconnections: 0,
         messagesReceived: 0,
         messagesSent: 0
      };

      if (this.config.autoConnect) {
         this.connect();
      }
   }

   /**
    * Connect to the socket server
    */
   async connect(): Promise<void> {
      if (this.socket?.connected) {
         console.log('[SocketClient] Already connected');
         return;
      }

      return new Promise((resolve, reject) => {
         try {
            this.connectionState.isConnecting = true;
            this.connectionState.error = undefined;

            this.socket = io(this.config.url!, {
               transports: ['websocket', 'polling'],
               upgrade: true,
               rememberUpgrade: true,
               timeout: this.config.timeout,
               ...this.config.options
            });

            this.setupEventHandlers();

            this.socket.on('connect', () => {
               this.connectionState.isConnected = true;
               this.connectionState.isConnecting = false;
               this.connectionState.connectionId = this.socket!.id;
               this.connectionState.lastConnected = new Date();
               this.stats.totalConnections++;
               this.stats.lastActivity = new Date();

               console.log('[SocketClient] Connected:', this.socket!.id);
               resolve();
            });

            this.socket.on('connect_error', (error) => {
               this.connectionState.isConnecting = false;
               this.connectionState.error = error;
               console.error('[SocketClient] Connection error:', error);
               reject(error);
            });

            // Set connection timeout
            setTimeout(() => {
               if (this.connectionState.isConnecting) {
                  this.connectionState.isConnecting = false;
                  reject(new Error('Connection timeout'));
               }
            }, this.config.timeout);

         } catch (error) {
            this.connectionState.isConnecting = false;
            this.connectionState.error = error as Error;
            reject(error);
         }
      });
   }

   /**
    * Disconnect from the socket server
    */
   disconnect(): void {
      if (this.socket) {
         this.socket.disconnect();
         this.socket = null;
         this.connectionState.isConnected = false;
         this.connectionState.connectionId = undefined;
         this.connectionState.lastDisconnected = new Date();
         this.stats.totalDisconnections++;

         console.log('[SocketClient] Disconnected');
      }
   }

   /**
    * Get current connection state
    */
   getConnectionState(): SocketConnectionState {
      return { ...this.connectionState };
   }

   /**
    * Get connection statistics
    */
   getStats(): SocketClientStats {
      return { 
         ...this.stats,
         connectionTime: this.connectionState.lastConnected 
            ? Date.now() - this.connectionState.lastConnected.getTime() 
            : undefined
      };
   }

   /**
    * Check if connected
    */
   isConnected(): boolean {
      return this.socket?.connected || false;
   }

   /**
    * Send a message to the server
    */
   emit(event: string, data?: unknown, callback?: (response: unknown) => void): boolean {
      if (!this.socket?.connected) {
         console.warn('[SocketClient] Cannot emit - not connected');
         return false;
      }

      try {
         this.socket.emit(event, data, callback);
         this.stats.messagesSent++;
         this.stats.lastActivity = new Date();
         return true;
      } catch (error) {
         console.error('[SocketClient] Error emitting event:', error);
         return false;
      }
   }

   /**
    * Listen for events from the server
    */
   on<T extends SocketEventNames>(
      event: T, 
      callback: SocketClientEventMap[T]
   ): void;
   on(event: string, callback: SocketEventCallback): void;
   on(event: string, callback: SocketEventCallback): void {
      if (!this.eventListeners.has(event)) {
         this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event)!.push(callback);

      if (this.socket) {
         this.socket.on(event, callback);
      }
   }

   /**
    * Remove event listener
    */
   off(event: string, callback?: SocketEventCallback): void {
      if (this.socket) {
         if (callback) {
            this.socket.off(event, callback);
         } else {
            this.socket.off(event);
         }
      }

      if (callback) {
         const listeners = this.eventListeners.get(event);
         if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
               listeners.splice(index, 1);
            }
         }
      } else {
         this.eventListeners.delete(event);
      }
   }

   /**
    * Join a room
    */
   joinRoom(roomId: string, password?: string): void {
      this.emit('join-global-room', { roomId, password });
   }

   /**
    * Leave a room
    */
   leaveRoom(roomId: string): void {
      this.emit('leave-global-room', { roomId });
   }

   /**
    * Send message to a room
    */
   sendToRoom(roomId: string, event: string, message: unknown): void {
      this.emit('global-room-message', { roomId, event, message });
   }

   /**
    * Send a typed message
    */
   sendMessage(message: SocketMessage): void {
      this.emit('message', {
         ...message,
         timestamp: new Date()
      });
   }

   /**
    * Setup automatic reconnection
    */
   private setupReconnection(): void {
      if (this.reconnectTimer || this.connectionState.reconnectCount >= (this.config.reconnectAttempts || 5)) {
         return;
      }

      this.connectionState.isReconnecting = true;
      this.reconnectTimer = setTimeout(() => {
         this.connectionState.reconnectCount++;
         this.stats.totalReconnections++;
         this.reconnectTimer = null;

         console.log(`[SocketClient] Reconnection attempt ${this.connectionState.reconnectCount}`);
         
         this.connect().catch(() => {
            this.setupReconnection();
         });
      }, this.config.reconnectDelay);
   }

   /**
    * Setup socket event handlers
    */
   private setupEventHandlers(): void {
      if (!this.socket) return;

      this.socket.on('disconnect', (reason: string) => {
         this.connectionState.isConnected = false;
         this.connectionState.connectionId = undefined;
         this.connectionState.lastDisconnected = new Date();
         this.stats.totalDisconnections++;

         console.log('[SocketClient] Disconnected:', reason);

         // Auto-reconnect if not manually disconnected
         if (reason !== 'io client disconnect') {
            this.setupReconnection();
         }
      });

      this.socket.on('reconnect', (attemptNumber: number) => {
         this.connectionState.isReconnecting = false;
         this.connectionState.reconnectCount = 0;
         console.log('[SocketClient] Reconnected after', attemptNumber, 'attempts');
      });

      this.socket.on('reconnect_error', (error: Error) => {
         console.error('[SocketClient] Reconnection error:', error);
      });

      this.socket.on('error', (error: Error) => {
         this.connectionState.error = error;
         console.error('[SocketClient] Socket error:', error);
      });

      // Handle incoming messages
      this.socket.onAny(() => {
         this.stats.messagesReceived++;
         this.stats.lastActivity = new Date();
      });

      // Re-register custom event listeners
      this.eventListeners.forEach((callbacks, event) => {
         callbacks.forEach(callback => {
            this.socket!.on(event, callback);
         });
      });
   }

   /**
    * Clean up resources
    */
   destroy(): void {
      if (this.reconnectTimer) {
         clearTimeout(this.reconnectTimer);
         this.reconnectTimer = null;
      }

      this.eventListeners.clear();
      this.disconnect();
   }
}

export default SocketClient;
