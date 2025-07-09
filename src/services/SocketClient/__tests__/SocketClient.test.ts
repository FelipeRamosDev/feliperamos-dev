import { SocketClient } from '../SocketClient';
import { SocketClientConfig } from '../SocketClient.types';
import { io, Socket } from 'socket.io-client';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
   io: jest.fn()
}));

// Mock console methods
const mockConsole = {
   log: jest.fn(),
   warn: jest.fn(),
   error: jest.fn()
};

beforeEach(() => {
   jest.clearAllMocks();
   global.console = mockConsole as any;
});

describe('SocketClient', () => {
   let mockSocket: jest.Mocked<Socket>;
   let mockIo: jest.MockedFunction<typeof io>;

   beforeEach(() => {
      mockSocket = {
         id: 'test-socket-id',
         connected: false,
         connect: jest.fn(),
         disconnect: jest.fn(),
         emit: jest.fn(),
         on: jest.fn(),
         off: jest.fn(),
         onAny: jest.fn(),
         removeAllListeners: jest.fn(),
         listeners: jest.fn(),
         listenersAny: jest.fn(),
         offAny: jest.fn(),
         removeListener: jest.fn()
      } as any;

      mockIo = io as jest.MockedFunction<typeof io>;
      mockIo.mockReturnValue(mockSocket);
   });

   describe('Constructor', () => {
      it('creates SocketClient with default config', () => {
         const client = new SocketClient({ autoConnect: false });
         
         expect(client).toBeInstanceOf(SocketClient);
         expect(client.getConnectionState()).toEqual({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });
      });

      it('creates SocketClient with custom config', () => {
         const config: SocketClientConfig = {
            url: 'http://localhost:8080',
            autoConnect: false,
            reconnectAttempts: 10,
            reconnectDelay: 5000,
            timeout: 15000
         };

         const client = new SocketClient(config);
         
         expect(client).toBeInstanceOf(SocketClient);
         expect(client.getConnectionState()).toEqual({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });
      });

      it('auto-connects when autoConnect is true', () => {
         const config: SocketClientConfig = {
            autoConnect: true
         };

         new SocketClient(config);
         
         expect(mockIo).toHaveBeenCalledWith('http://localhost:5000', expect.any(Object));
      });

      it('does not auto-connect when autoConnect is false', () => {
         const config: SocketClientConfig = {
            autoConnect: false
         };

         new SocketClient(config);
         
         expect(mockIo).not.toHaveBeenCalled();
      });
   });

   describe('Connection Management', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('connects successfully', async () => {
         mockSocket.connected = false;
         
         const connectPromise = client.connect();
         
         // Simulate successful connection
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         expect(mockIo).toHaveBeenCalledWith('http://localhost:5000', expect.any(Object));
         expect(client.isConnected()).toBe(true);
      });

      it('handles connection already established', async () => {
         // Create a client and connect it first
         const connectPromise = client.connect();
         
         // Simulate successful connection
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Now try to connect again - should log already connected
         await client.connect();
         
         expect(mockConsole.log).toHaveBeenCalledWith('[SocketClient] Already connected');
      });

      it('handles connection error', async () => {
         const error = new Error('Connection failed');
         
         const connectPromise = client.connect();
         
         // Simulate connection error
         const errorCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect_error'
         )?.[1];
         
         if (errorCallback) {
            errorCallback(error);
         }
         
         await expect(connectPromise).rejects.toThrow('Connection failed');
         expect(mockConsole.error).toHaveBeenCalledWith('[SocketClient] Connection error:', error);
      });

      it('handles connection timeout', async () => {
         jest.useFakeTimers();
         
         const connectPromise = client.connect();
         
         // Fast-forward time to trigger timeout
         jest.advanceTimersByTime(10000);
         
         await expect(connectPromise).rejects.toThrow('Connection timeout');
         
         jest.useRealTimers();
      });

      it('disconnects successfully', async () => {
         // First connect
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Now disconnect
         client.disconnect();
         
         expect(mockSocket.disconnect).toHaveBeenCalled();
         expect(mockConsole.log).toHaveBeenCalledWith('[SocketClient] Disconnected');
      });

      it('handles disconnect when not connected', () => {
         client.disconnect();
         
         expect(mockSocket.disconnect).not.toHaveBeenCalled();
      });
   });

   describe('Connection State', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('returns correct connection state', () => {
         const state = client.getConnectionState();
         
         expect(state).toEqual({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });
      });

      it('updates connection state on connect', async () => {
         const connectPromise = client.connect();
         
         // Simulate connection
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         const state = client.getConnectionState();
         expect(state.isConnected).toBe(true);
         expect(state.connectionId).toBe('test-socket-id');
         expect(state.lastConnected).toBeInstanceOf(Date);
      });

      it('updates connection state on disconnect', async () => {
         // First connect
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Then disconnect
         const disconnectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'disconnect'
         )?.[1];
         
         if (disconnectCallback) {
            mockSocket.connected = false;
            disconnectCallback('io client disconnect');
         }
         
         const state = client.getConnectionState();
         expect(state.isConnected).toBe(false);
         expect(state.connectionId).toBeUndefined();
         expect(state.lastDisconnected).toBeInstanceOf(Date);
      });

      it('returns correct isConnected status', async () => {
         expect(client.isConnected()).toBe(false);
         
         // Connect and verify
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         expect(client.isConnected()).toBe(true);
      });
   });

   describe('Statistics', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('returns initial statistics', () => {
         const stats = client.getStats();
         
         expect(stats).toEqual({
            totalConnections: 0,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 0,
            messagesSent: 0,
            connectionTime: undefined
         });
      });

      it('updates statistics on connect', async () => {
         const connectPromise = client.connect();
         
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         const stats = client.getStats();
         expect(stats.totalConnections).toBe(1);
         expect(stats.connectionTime).toBeGreaterThanOrEqual(0);
      });

      it('updates statistics on disconnect', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Then disconnect
         const disconnectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'disconnect'
         )?.[1];
         
         if (disconnectCallback) {
            mockSocket.connected = false;
            disconnectCallback('io client disconnect');
         }
         
         const stats = client.getStats();
         expect(stats.totalDisconnections).toBe(1);
      });

      it('updates message statistics on emit', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         client.emit('test-event', { data: 'test' });
         
         const stats = client.getStats();
         expect(stats.messagesSent).toBe(1);
         expect(stats.lastActivity).toBeInstanceOf(Date);
      });

      it('updates message statistics on receive', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Simulate message received
         const onAnyCallback = mockSocket.onAny.mock.calls[0]?.[0];
         if (onAnyCallback) {
            onAnyCallback();
         }
         
         const stats = client.getStats();
         expect(stats.messagesReceived).toBe(1);
         expect(stats.lastActivity).toBeInstanceOf(Date);
      });
   });

   describe('Message Handling', () => {
      let client: SocketClient;

      beforeEach(async () => {
         client = new SocketClient({ autoConnect: false });
         
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
      });

      it('emits message when connected', () => {
         const result = client.emit('test-event', { data: 'test' });
         
         expect(result).toBe(true);
         expect(mockSocket.emit).toHaveBeenCalledWith('test-event', { data: 'test' }, undefined);
      });

      it('emits message with callback when connected', () => {
         const callback = jest.fn();
         const result = client.emit('test-event', { data: 'test' }, callback);
         
         expect(result).toBe(true);
         expect(mockSocket.emit).toHaveBeenCalledWith('test-event', { data: 'test' }, callback);
      });

      it('fails to emit when not connected', () => {
         mockSocket.connected = false;
         
         const result = client.emit('test-event', { data: 'test' });
         
         expect(result).toBe(false);
         expect(mockConsole.warn).toHaveBeenCalledWith('[SocketClient] Cannot emit - not connected');
      });

      it('handles emit error', () => {
         mockSocket.emit.mockImplementation(() => {
            throw new Error('Emit error');
         });
         
         const result = client.emit('test-event', { data: 'test' });
         
         expect(result).toBe(false);
         expect(mockConsole.error).toHaveBeenCalledWith('[SocketClient] Error emitting event:', expect.any(Error));
      });

      it('registers event listener', () => {
         const callback = jest.fn();
         
         client.on('test-event', callback);
         
         expect(mockSocket.on).toHaveBeenCalledWith('test-event', callback);
      });

      it('removes event listener with callback', () => {
         const callback = jest.fn();
         
         client.on('test-event', callback);
         client.off('test-event', callback);
         
         expect(mockSocket.off).toHaveBeenCalledWith('test-event', callback);
      });

      it('removes all event listeners for event', () => {
         const callback1 = jest.fn();
         const callback2 = jest.fn();
         
         client.on('test-event', callback1);
         client.on('test-event', callback2);
         client.off('test-event');
         
         expect(mockSocket.off).toHaveBeenCalledWith('test-event');
      });

      it('sends typed message', () => {
         const message = {
            event: 'test-event',
            data: { text: 'Hello' }
         };
         
         client.sendMessage(message);
         
         expect(mockSocket.emit).toHaveBeenCalledWith('message', {
            ...message,
            timestamp: expect.any(Date)
         }, undefined);
      });
   });

   describe('Room Management', () => {
      let client: SocketClient;

      beforeEach(async () => {
         client = new SocketClient({ autoConnect: false });
         
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
      });

      it('joins room without password', () => {
         client.joinRoom('test-room');
         
         expect(mockSocket.emit).toHaveBeenCalledWith('join-global-room', {
            roomId: 'test-room',
            password: undefined
         }, undefined);
      });

      it('joins room with password', () => {
         client.joinRoom('test-room', 'secret');
         
         expect(mockSocket.emit).toHaveBeenCalledWith('join-global-room', {
            roomId: 'test-room',
            password: 'secret'
         }, undefined);
      });

      it('leaves room', () => {
         client.leaveRoom('test-room');
         
         expect(mockSocket.emit).toHaveBeenCalledWith('leave-global-room', {
            roomId: 'test-room'
         }, undefined);
      });

      it('sends message to room', () => {
         const message = { text: 'Hello room' };
         
         client.sendToRoom('test-room', 'chat-message', message);
         
         expect(mockSocket.emit).toHaveBeenCalledWith('global-room-message', {
            roomId: 'test-room',
            event: 'chat-message',
            message
         }, undefined);
      });
   });

   describe('Reconnection', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ 
            autoConnect: false,
            reconnectAttempts: 3,
            reconnectDelay: 1000
         });
         jest.useFakeTimers();
      });

      afterEach(() => {
         jest.useRealTimers();
      });

      it('attempts reconnection on unexpected disconnect', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Simulate unexpected disconnect
         const disconnectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'disconnect'
         )?.[1];
         
         if (disconnectCallback) {
            mockSocket.connected = false;
            disconnectCallback('transport error');
         }
         
         // Fast-forward time to trigger reconnection
         jest.advanceTimersByTime(1000);
         
         expect(mockConsole.log).toHaveBeenCalledWith('[SocketClient] Reconnection attempt 1');
      });

      it('does not attempt reconnection on manual disconnect', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Simulate manual disconnect
         const disconnectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'disconnect'
         )?.[1];
         
         if (disconnectCallback) {
            mockSocket.connected = false;
            disconnectCallback('io client disconnect');
         }
         
         // Fast-forward time
         jest.advanceTimersByTime(1000);
         
         expect(mockConsole.log).not.toHaveBeenCalledWith(
            expect.stringContaining('Reconnection attempt')
         );
      });

      it('handles reconnection success', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Simulate reconnection
         const reconnectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'reconnect'
         )?.[1];
         
         if (reconnectCallback) {
            reconnectCallback(2);
         }
         
         expect(mockConsole.log).toHaveBeenCalledWith('[SocketClient] Reconnected after', 2, 'attempts');
      });

      it('handles reconnection error', async () => {
         // Connect first
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Simulate reconnection error
         const reconnectErrorCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'reconnect_error'
         )?.[1];
         
         if (reconnectErrorCallback) {
            const error = new Error('Reconnection failed');
            reconnectErrorCallback(error);
         }
         
         expect(mockConsole.error).toHaveBeenCalledWith('[SocketClient] Reconnection error:', expect.any(Error));
      });
   });

   describe('Error Handling', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('handles socket errors', async () => {
         const connectPromise = client.connect();
         
         const errorCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'error'
         )?.[1];
         
         if (errorCallback) {
            const error = new Error('Socket error');
            errorCallback(error);
         }
         
         const state = client.getConnectionState();
         expect(state.error).toBeInstanceOf(Error);
         expect(mockConsole.error).toHaveBeenCalledWith('[SocketClient] Socket error:', expect.any(Error));
      });

      it('handles connection errors gracefully', async () => {
         const error = new Error('Connection failed');
         
         const connectPromise = client.connect();
         
         const errorCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect_error'
         )?.[1];
         
         if (errorCallback) {
            errorCallback(error);
         }
         
         await expect(connectPromise).rejects.toThrow('Connection failed');
         
         const state = client.getConnectionState();
         expect(state.error).toBe(error);
         expect(state.isConnecting).toBe(false);
      });
   });

   describe('Cleanup and Destruction', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('cleans up resources on destroy', () => {
         client.destroy();
         
         // Should not throw and should clean up internal state
         expect(() => client.destroy()).not.toThrow();
      });

      it('clears reconnection timer on destroy', () => {
         jest.useFakeTimers();
         
         client.destroy();
         
         // Should not have any active timers
         expect(jest.getTimerCount()).toBe(0);
         
         jest.useRealTimers();
      });

      it('disconnects socket on destroy', async () => {
         // First connect
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         client.destroy();
         
         expect(mockSocket.disconnect).toHaveBeenCalled();
      });
   });

   describe('Event Listener Management', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('stores event listeners for re-registration', async () => {
         const callback = jest.fn();
         
         // Connect first to create socket
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Now register event listener
         client.on('test-event', callback);
         
         // Should store the callback for later re-registration
         expect(mockSocket.on).toHaveBeenCalledWith('test-event', callback);
      });

      it('re-registers event listeners on reconnection', async () => {
         const callback = jest.fn();
         
         // Register event listener before connection
         client.on('test-event', callback);
         
         // Connect
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         // Should have registered the event listener
         expect(mockSocket.on).toHaveBeenCalledWith('test-event', callback);
      });

      it('removes event listener from internal storage', async () => {
         const callback = jest.fn();
         
         // Connect first to create socket
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         client.on('test-event', callback);
         client.off('test-event', callback);
         
         // Should remove from internal storage
         expect(mockSocket.off).toHaveBeenCalledWith('test-event', callback);
      });
   });

   describe('Type Safety', () => {
      let client: SocketClient;

      beforeEach(() => {
         client = new SocketClient({ autoConnect: false });
      });

      it('accepts typed event callbacks', async () => {
         // Connect first to create socket
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         const connectCb = jest.fn();
         const disconnectCb = jest.fn();
         
         client.on('connect', connectCb);
         client.on('disconnect', disconnectCb);
         
         expect(mockSocket.on).toHaveBeenCalledWith('connect', connectCb);
         expect(mockSocket.on).toHaveBeenCalledWith('disconnect', disconnectCb);
      });

      it('accepts string event callbacks', async () => {
         // Connect first to create socket
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         const customCallback = jest.fn();
         
         client.on('custom-event', customCallback);
         
         expect(mockSocket.on).toHaveBeenCalledWith('custom-event', customCallback);
      });

      it('maintains type safety with event map', async () => {
         // Connect first to create socket
         const connectPromise = client.connect();
         const connectCallback = mockSocket.on.mock.calls.find(
            call => call[0] === 'connect'
         )?.[1];
         
         if (connectCallback) {
            mockSocket.connected = true;
            connectCallback();
         }
         
         await connectPromise;
         
         const errorCallback = jest.fn();
         
         client.on('error', errorCallback);
         
         expect(mockSocket.on).toHaveBeenCalledWith('error', errorCallback);
      });
   });
});

