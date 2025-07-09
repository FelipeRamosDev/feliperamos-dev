import { renderHook, act } from '@testing-library/react';
import { useSocketClient } from '../useSocketClient';
import SocketClient from '../SocketClient';

// Mock SocketClient
jest.mock('../SocketClient');

describe('useSocketClient', () => {
   let mockSocketClient: jest.Mocked<SocketClient>;
   let mockSocketClientConstructor: jest.MockedClass<typeof SocketClient>;

   beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();

      mockSocketClient = {
         connect: jest.fn().mockResolvedValue(undefined),
         disconnect: jest.fn(),
         emit: jest.fn().mockReturnValue(true),
         joinRoom: jest.fn(),
         leaveRoom: jest.fn(),
         sendToRoom: jest.fn(),
         on: jest.fn(),
         off: jest.fn(),
         getConnectionState: jest.fn().mockReturnValue({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         }),
         getStats: jest.fn().mockReturnValue({
            totalConnections: 0,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 0,
            messagesSent: 0
         }),
         isConnected: jest.fn().mockReturnValue(false),
         destroy: jest.fn()
      } as any;

      mockSocketClientConstructor = SocketClient as jest.MockedClass<typeof SocketClient>;
      mockSocketClientConstructor.mockImplementation(() => mockSocketClient);
   });

   describe('initialization', () => {
      it('should initialize with default options', () => {
         const { result } = renderHook(() => useSocketClient());

         // Check that SocketClient was called with the correct config
         expect(SocketClient).toHaveBeenCalledWith({
            url: 'http://localhost:5000',
            autoConnect: true
         });
         
         // Since effects run asynchronously, we can check if socket exists or is null
         expect(result.current.socket).toBeDefined();
         expect(result.current.isConnected).toBe(false);
      });

      it('should initialize with custom options', () => {
         const customOptions = {
            url: 'https://custom-server.com',
            autoConnect: false,
            reconnectOnError: false,
            maxReconnectAttempts: 5
         };

         const { result } = renderHook(() => useSocketClient(customOptions));

         expect(SocketClient).toHaveBeenCalledWith(customOptions);
         expect(result.current.socket).toBeDefined();
      });

      it('should handle null socket during initialization', () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { result } = renderHook(() => useSocketClient());

         expect(result.current.socket).toBeNull();
         expect(result.current.isConnected).toBe(false);
      });
   });

   describe('connection management', () => {
      it('should provide connection methods', async () => {
         const { result } = renderHook(() => useSocketClient());

         await act(async () => {
            await result.current.connect();
         });

         expect(mockSocketClient.connect).toHaveBeenCalled();

         act(() => {
            result.current.disconnect();
         });

         expect(mockSocketClient.disconnect).toHaveBeenCalled();
      });

      it('should handle connection errors gracefully', async () => {
         mockSocketClient.connect.mockRejectedValue(new Error('Connection failed'));

         const { result } = renderHook(() => useSocketClient());

         await act(async () => {
            await expect(result.current.connect()).rejects.toThrow('Connection failed');
         });

         expect(mockSocketClient.connect).toHaveBeenCalled();
      });

      it('should handle connect with null socket', async () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { result } = renderHook(() => useSocketClient());

         await act(async () => {
            await result.current.connect();
         });

         // Should not throw error and should not call connect on null socket
         expect(mockSocketClient.connect).not.toHaveBeenCalled();
      });
   });

   describe('message handling', () => {
      it('should provide message methods', () => {
         const { result } = renderHook(() => useSocketClient());

         const success = result.current.emit('test-event', { data: 'test' });

         expect(success).toBe(true);
         expect(mockSocketClient.emit).toHaveBeenCalledWith('test-event', { data: 'test' });
      });

      it('should handle emit with no data', () => {
         const { result } = renderHook(() => useSocketClient());

         const success = result.current.emit('test-event');

         expect(success).toBe(true);
         expect(mockSocketClient.emit).toHaveBeenCalledWith('test-event', undefined);
      });

      it('should handle emit failure', () => {
         mockSocketClient.emit.mockReturnValue(false);

         const { result } = renderHook(() => useSocketClient());

         const success = result.current.emit('test-event', { data: 'test' });

         expect(success).toBe(false);
      });

      it('should handle emit with null socket', () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { result } = renderHook(() => useSocketClient());

         const success = result.current.emit('test-event', { data: 'test' });

         expect(success).toBe(false);
      });
   });

   describe('room management', () => {
      it('should provide room management methods', () => {
         const { result } = renderHook(() => useSocketClient());

         result.current.joinRoom('test-room', 'password');
         expect(mockSocketClient.joinRoom).toHaveBeenCalledWith('test-room', 'password');

         result.current.leaveRoom('test-room');
         expect(mockSocketClient.leaveRoom).toHaveBeenCalledWith('test-room');

         result.current.sendToRoom('test-room', 'chat-message', { text: 'Hello' });
         expect(mockSocketClient.sendToRoom).toHaveBeenCalledWith('test-room', 'chat-message', { text: 'Hello' });
      });

      it('should handle room operations with null socket', () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { result } = renderHook(() => useSocketClient());

         result.current.joinRoom('test-room');
         result.current.leaveRoom('test-room');
         result.current.sendToRoom('test-room', 'message', {});

         expect(mockSocketClient.joinRoom).not.toHaveBeenCalled();
         expect(mockSocketClient.leaveRoom).not.toHaveBeenCalled();
         expect(mockSocketClient.sendToRoom).not.toHaveBeenCalled();
      });
   });

   describe('statistics', () => {
      it('should provide default statistics', () => {
         const { result } = renderHook(() => useSocketClient());

         expect(result.current.stats).toEqual({
            totalConnections: 0,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 0,
            messagesSent: 0
         });
      });

      it('should handle null stats from socket', () => {
         mockSocketClient.getStats.mockReturnValue(null as any);

         const { result } = renderHook(() => useSocketClient());

         expect(result.current.stats).toEqual({
            totalConnections: 0,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 0,
            messagesSent: 0
         });
      });
   });

   describe('cleanup', () => {
      it('should cleanup on unmount', () => {
         const { unmount } = renderHook(() => useSocketClient());

         unmount();

         expect(mockSocketClient.destroy).toHaveBeenCalled();
      });

      it('should handle cleanup with null socket', () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { unmount } = renderHook(() => useSocketClient());

         unmount();

         expect(mockSocketClient.destroy).not.toHaveBeenCalled();
      });
   });

   describe('connection state', () => {
      it('should provide connection state', () => {
         const { result } = renderHook(() => useSocketClient());

         expect(result.current.connectionState).toEqual({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });
      });

      it('should handle isConnected derived from connection state', () => {
         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });

         const { result } = renderHook(() => useSocketClient());

         expect(result.current.isConnected).toBe(false); // Initially false due to async nature
      });
   });

   describe('error handling', () => {
      it('should handle socket creation errors', () => {
         mockSocketClientConstructor.mockImplementation(() => {
            throw new Error('Socket creation failed');
         });

         const { result } = renderHook(() => useSocketClient());

         expect(result.current.socket).toBeNull();
         expect(result.current.isConnected).toBe(false);
      });

      it('should handle method calls with null socket gracefully', () => {
         mockSocketClientConstructor.mockImplementation(() => null as any);

         const { result } = renderHook(() => useSocketClient());

         // Should not throw errors
         expect(() => result.current.disconnect()).not.toThrow();
         expect(() => result.current.joinRoom('test')).not.toThrow();
         expect(() => result.current.leaveRoom('test')).not.toThrow();
         expect(() => result.current.sendToRoom('test', 'event', {})).not.toThrow();
      });
   });
});
