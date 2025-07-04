/**
 * SocketClient Service - Index
 * Main exports for the SocketClient service
 */

export { default as SocketClient } from './SocketClient';
export { default as useSocketClient } from './useSocketClient';
export { default as SocketProvider, useSocket } from './SocketProvider';

export type {
   SocketClientConfig,
   SocketClientOptions,
   SocketConnectionState,
   SocketEventCallback,
   SocketErrorCallback,
   SocketConnectionCallback,
   SocketRoomData,
   SocketRoomMessage,
   SocketMessage,
   SocketNamespaceConfig,
   SocketClientEventMap,
   SocketEventNames,
   SocketClientStats
} from './SocketClient.types';

export type {
   UseSocketClientOptions,
   UseSocketClientReturn
} from './useSocketClient';
