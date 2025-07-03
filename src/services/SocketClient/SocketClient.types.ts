/**
 * SocketClient Types
 * Frontend types for Socket.IO client interactions
 */

export interface SocketClientConfig {
   url?: string;
   options?: SocketClientOptions;
   autoConnect?: boolean;
   reconnectAttempts?: number;
   reconnectDelay?: number;
   timeout?: number;
}

export interface SocketClientOptions {
   transports?: ('websocket' | 'polling')[];
   upgrade?: boolean;
   rememberUpgrade?: boolean;
   path?: string;
   query?: Record<string, string>;
   extraHeaders?: Record<string, string>;
   withCredentials?: boolean;
   forceNew?: boolean;
   multiplex?: boolean;
   timeout?: number;
   ackTimeout?: number;
   retries?: number;
}

export interface SocketConnectionState {
   isConnected: boolean;
   isConnecting: boolean;
   isReconnecting: boolean;
   connectionId?: string;
   lastConnected?: Date;
   lastDisconnected?: Date;
   reconnectCount: number;
   error?: Error;
}

export interface SocketEventCallback<T = unknown> {
   (data: T): void;
}

export interface SocketErrorCallback {
   (error: Error): void;
}

export interface SocketConnectionCallback {
   (): void;
}

export interface SocketRoomData {
   roomId: string;
   password?: string;
}

export interface SocketRoomMessage {
   roomId: string;
   event: string;
   message: unknown;
}

export interface SocketMessage {
   event: string;
   data?: unknown;
   timestamp?: Date;
   from?: string;
   to?: string;
}

export interface SocketNamespaceConfig {
   path: string;
   events?: string[];
}

export interface SocketClientEventMap {
   // Connection events
   'connect': () => void;
   'disconnect': (reason: string) => void;
   'reconnect': (attemptNumber: number) => void;
   'reconnect_attempt': (attemptNumber: number) => void;
   'reconnecting': (attemptNumber: number) => void;
   'reconnect_error': (error: Error) => void;
   'reconnect_failed': () => void;
   'error': (error: Error) => void;
   
   // Custom events
   'message': (data: unknown) => void;
   'notification': (data: unknown) => void;
   'room-joined': (roomId: string) => void;
   'room-left': (roomId: string) => void;
   'room-message': (data: SocketRoomMessage) => void;
   'user-joined': (userId: string) => void;
   'user-left': (userId: string) => void;
}

export type SocketEventNames = keyof SocketClientEventMap;

export type SocketEmitEvent = (event: string, data?: unknown, callback?: (response: unknown) => void) => boolean;

export interface SocketClientStats {
   connectionTime?: number;
   totalConnections: number;
   totalDisconnections: number;
   totalReconnections: number;
   messagesReceived: number;
   messagesSent: number;
   lastActivity?: Date;
}
