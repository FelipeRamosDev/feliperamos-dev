import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { SocketProvider, useSocket } from '../SocketProvider';
import SocketClient from '../SocketClient';
import { SocketEventCallback } from '../SocketClient.types';

// Mock SocketClient
jest.mock('../SocketClient');

// Mock timers with proper types
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
(global as any).setInterval = jest.fn((callback: string | Function, delay?: number) => {
   if (typeof callback === 'function') {
      return setTimeout(callback, delay) as unknown as number;
   }
   return setTimeout(() => {}, delay) as unknown as number;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).clearInterval = jest.fn((id: string | number | NodeJS.Timeout | undefined) => {
   clearTimeout(id as NodeJS.Timeout);
});

// Test component that uses the useSocket hook
const TestComponent: React.FC = () => {
   const {
      socket,
      connectionState,
      stats,
      connect,
      disconnect,
      emit,
      joinRoom,
      leaveRoom,
      sendToRoom,
      isConnected
   } = useSocket();

   return (
      <div>
         <div data-testid="socket-id">{socket?.constructor.name || 'null'}</div>
         <div data-testid="is-connected">{isConnected.toString()}</div>
         <div data-testid="connection-state">{JSON.stringify(connectionState)}</div>
         <div data-testid="stats">{JSON.stringify(stats)}</div>
         <button data-testid="connect-btn" onClick={connect}>Connect</button>
         <button data-testid="disconnect-btn" onClick={disconnect}>Disconnect</button>
         <button data-testid="emit-btn" onClick={() => emit('test-event', { data: 'test' })}>Emit</button>
         <button data-testid="join-room-btn" onClick={() => joinRoom('test-room', 'password')}>Join Room</button>
         <button data-testid="leave-room-btn" onClick={() => leaveRoom('test-room')}>Leave Room</button>
         <button data-testid="send-to-room-btn" onClick={() => sendToRoom('test-room', 'message', { text: 'hello' })}>Send to Room</button>
      </div>
   );
};

describe('SocketProvider', () => {
   let mockSocketClient: jest.Mocked<SocketClient>;

   beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();

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
         destroy: jest.fn(),
         constructor: { name: 'SocketClient' }
      } as unknown as jest.Mocked<SocketClient>;

      (SocketClient as jest.MockedClass<typeof SocketClient>).mockImplementation(() => mockSocketClient);
   });

   afterEach(() => {
      jest.useRealTimers();
   });

   describe('Provider Initialization', () => {
      it('creates SocketClient with default config', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         expect(SocketClient).toHaveBeenCalledWith({
            url: 'http://localhost:5000',
            autoConnect: true
         });
      });

      it('creates SocketClient with custom config', () => {
         const config = {
            url: 'http://localhost:8080',
            autoConnect: false,
            reconnectAttempts: 10
         };

         render(
            <SocketProvider config={config}>
               <TestComponent />
            </SocketProvider>
         );

         expect(SocketClient).toHaveBeenCalledWith({
            url: 'http://localhost:8080',
            autoConnect: false,
            reconnectAttempts: 10
         });
      });

      it('provides socket client to children', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         expect(screen.getByTestId('socket-id')).toHaveTextContent('SocketClient');
      });
   });

   describe('Context Value Provision', () => {
      it('provides initial connection state', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);

         expect(connectionState).toEqual({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });
      });

      it('provides initial statistics', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const statsText = screen.getByTestId('stats').textContent;
         const stats = JSON.parse(statsText!);

         expect(stats).toEqual({
            totalConnections: 0,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 0,
            messagesSent: 0
         });
      });

      it('provides isConnected status', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         expect(screen.getByTestId('is-connected')).toHaveTextContent('false');
      });
   });

   describe('Event Handling', () => {
      it('updates connection state on connect event', () => {
         let connectCallback: SocketEventCallback<unknown> | undefined;

         mockSocketClient.on.mockImplementation((event: string, callback: SocketEventCallback<unknown>) => {
            if (event === 'connect') {
               connectCallback = callback;
            }
         });

         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0,
            connectionId: 'test-id'
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         act(() => {
            connectCallback?.(undefined);
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.isConnected).toBe(true);
         expect(connectionState.connectionId).toBe('test-id');
      });

      it('updates connection state on disconnect event', () => {
         let disconnectCallback: SocketEventCallback<unknown> | undefined;

         mockSocketClient.on.mockImplementation((event: string, callback: SocketEventCallback<unknown>) => {
            if (event === 'disconnect') {
               disconnectCallback = callback;
            }
         });

         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         act(() => {
            disconnectCallback?.(undefined);
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.isConnected).toBe(false);
      });

      it('updates connection state on reconnect event', () => {
         let reconnectCallback: SocketEventCallback<unknown> | undefined;

         mockSocketClient.on.mockImplementation((event: string, callback: SocketEventCallback<unknown>) => {
            if (event === 'reconnect') {
               reconnectCallback = callback;
            }
         });

         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 1
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         act(() => {
            reconnectCallback?.(undefined);
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.reconnectCount).toBe(1);
      });

      it('updates connection state on error event', () => {
         let errorCallback: SocketEventCallback<unknown> | undefined;

         mockSocketClient.on.mockImplementation((event: string, callback: SocketEventCallback<unknown>) => {
            if (event === 'error') {
               errorCallback = callback;
            }
         });

         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0,
            error: new Error('Test error')
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         act(() => {
            errorCallback?.(undefined);
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.error).toBeDefined();
      });
   });

   describe('Statistics Updates', () => {
      it('updates statistics periodically', () => {
         mockSocketClient.getStats.mockReturnValue({
            totalConnections: 1,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 5,
            messagesSent: 3
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         act(() => {
            jest.advanceTimersByTime(1000);
         });

         const statsText = screen.getByTestId('stats').textContent;
         const stats = JSON.parse(statsText!);
         expect(stats.totalConnections).toBe(1);
         expect(stats.messagesReceived).toBe(5);
         expect(stats.messagesSent).toBe(3);
      });

      it('prevents unnecessary re-renders with unchanged stats', () => {
         const initialStats = {
            totalConnections: 1,
            totalDisconnections: 0,
            totalReconnections: 0,
            messagesReceived: 5,
            messagesSent: 3
         };

         mockSocketClient.getStats.mockReturnValue(initialStats);

         const { rerender } = render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         // Advance time to trigger stats update
         act(() => {
            jest.advanceTimersByTime(1000);
         });

         const renderCount = jest.fn();
         const TestComponentWithRenderCount: React.FC = () => {
            renderCount();
            return <TestComponent />;
         };

         rerender(
            <SocketProvider>
               <TestComponentWithRenderCount />
            </SocketProvider>
         );

         // Stats should remain the same, preventing unnecessary re-renders
         act(() => {
            jest.advanceTimersByTime(1000);
         });

         expect(renderCount).toHaveBeenCalledTimes(1);
      });
   });

   describe('Context Methods', () => {
      it('provides working connect method', async () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const connectBtn = screen.getByTestId('connect-btn');

         await act(async () => {
            connectBtn.click();
         });

         expect(mockSocketClient.connect).toHaveBeenCalled();
      });

      it('provides working disconnect method', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const disconnectBtn = screen.getByTestId('disconnect-btn');

         act(() => {
            disconnectBtn.click();
         });

         expect(mockSocketClient.disconnect).toHaveBeenCalled();
      });

      it('provides working emit method', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const emitBtn = screen.getByTestId('emit-btn');

         act(() => {
            emitBtn.click();
         });

         expect(mockSocketClient.emit).toHaveBeenCalledWith('test-event', { data: 'test' }, undefined);
      });

      it('provides working joinRoom method', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const joinRoomBtn = screen.getByTestId('join-room-btn');

         act(() => {
            joinRoomBtn.click();
         });

         expect(mockSocketClient.joinRoom).toHaveBeenCalledWith('test-room', 'password');
      });

      it('provides working leaveRoom method', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const leaveRoomBtn = screen.getByTestId('leave-room-btn');

         act(() => {
            leaveRoomBtn.click();
         });

         expect(mockSocketClient.leaveRoom).toHaveBeenCalledWith('test-room');
      });

      it('provides working sendToRoom method', () => {
         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const sendToRoomBtn = screen.getByTestId('send-to-room-btn');

         act(() => {
            sendToRoomBtn.click();
         });

         expect(mockSocketClient.sendToRoom).toHaveBeenCalledWith('test-room', 'message', { text: 'hello' });
      });
   });

   describe('Connection State Updates', () => {
      it('updates connection state after connect', async () => {
         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const connectBtn = screen.getByTestId('connect-btn');

         await act(async () => {
            connectBtn.click();
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.isConnected).toBe(true);
      });

      it('updates connection state after disconnect', () => {
         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: false,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const disconnectBtn = screen.getByTestId('disconnect-btn');

         act(() => {
            disconnectBtn.click();
         });

         const connectionStateText = screen.getByTestId('connection-state').textContent;
         const connectionState = JSON.parse(connectionStateText!);
         expect(connectionState.isConnected).toBe(false);
      });
   });

   describe('Error Handling and Edge Cases', () => {
      it('handles socket client creation errors gracefully', () => {
         (SocketClient as jest.MockedClass<typeof SocketClient>).mockImplementation(() => {
            throw new Error('Creation failed');
         });

         expect(() => {
            render(
               <SocketProvider>
                  <TestComponent />
               </SocketProvider>
            );
         }).not.toThrow();
      });

      it('handles null socket client gracefully', () => {
         (SocketClient as jest.MockedClass<typeof SocketClient>).mockImplementation(() => null as unknown as SocketClient);

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const emitBtn = screen.getByTestId('emit-btn');

         expect(() => {
            act(() => {
               emitBtn.click();
            });
         }).not.toThrow();
      });

      it('handles method calls when socket is null', () => {
         (SocketProvider as unknown as { socket: SocketClient | null }).socket = null;

         render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         const connectBtn = screen.getByTestId('connect-btn');
         const disconnectBtn = screen.getByTestId('disconnect-btn');
         const emitBtn = screen.getByTestId('emit-btn');
         const joinRoomBtn = screen.getByTestId('join-room-btn');
         const leaveRoomBtn = screen.getByTestId('leave-room-btn');
         const sendToRoomBtn = screen.getByTestId('send-to-room-btn');

         expect(() => {
            act(() => {
               connectBtn.click();
               disconnectBtn.click();
               emitBtn.click();
               joinRoomBtn.click();
               leaveRoomBtn.click();
               sendToRoomBtn.click();
            });
         }).not.toThrow();
      });
   });

   describe('Cleanup and Unmounting', () => {
      it('destroys socket client on unmount', () => {
         const { unmount } = render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         unmount();

         expect(mockSocketClient.destroy).toHaveBeenCalled();
      });

      it('clears intervals on unmount', () => {
         const clearIntervalSpy = jest.spyOn(global, 'clearInterval');

         const { unmount } = render(
            <SocketProvider>
               <TestComponent />
            </SocketProvider>
         );

         unmount();

         expect(clearIntervalSpy).toHaveBeenCalled();
      });
   });

   describe('useSocket Hook Error Handling', () => {
      it('throws error when used outside SocketProvider', () => {
         const TestComponentOutsideProvider: React.FC = () => {
            useSocket();
            return <div>Test</div>;
         };

         // Suppress error boundary logs for this test
         const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

         expect(() => {
            render(<TestComponentOutsideProvider />);
         }).toThrow('useSocket must be used within a SocketProvider');

         consoleSpy.mockRestore();
      });
   });

   describe('Type Safety and Return Values', () => {
      it('provides correct types for all context values', () => {
         const ContextChecker: React.FC = () => {
            const context = useSocket();

            expect(typeof context.connect).toBe('function');
            expect(typeof context.disconnect).toBe('function');
            expect(typeof context.emit).toBe('function');
            expect(typeof context.joinRoom).toBe('function');
            expect(typeof context.leaveRoom).toBe('function');
            expect(typeof context.sendToRoom).toBe('function');
            expect(typeof context.isConnected).toBe('boolean');
            expect(typeof context.connectionState).toBe('object');
            expect(typeof context.stats).toBe('object');

            return <div data-testid="type-check">OK</div>;
         };

         render(
            <SocketProvider>
               <ContextChecker />
            </SocketProvider>
         );

         expect(screen.getByTestId('type-check')).toHaveTextContent('OK');
      });
   });

   describe('Multiple Children and Complex Scenarios', () => {
      it('provides same context to multiple children', () => {
         const TestChild1: React.FC = () => {
            const { isConnected } = useSocket();
            return <div data-testid="child1-connected">{isConnected.toString()}</div>;
         };

         const TestChild2: React.FC = () => {
            const { isConnected } = useSocket();
            return <div data-testid="child2-connected">{isConnected.toString()}</div>;
         };

         render(
            <SocketProvider>
               <TestChild1 />
               <TestChild2 />
            </SocketProvider>
         );

         expect(screen.getByTestId('child1-connected')).toHaveTextContent('false');
         expect(screen.getByTestId('child2-connected')).toHaveTextContent('false');
      });

      it('updates all children when connection state changes', () => {
         let connectCallback: SocketEventCallback<unknown> | undefined;

         mockSocketClient.on.mockImplementation((event: string, callback: SocketEventCallback<unknown>) => {
            if (event === 'connect') {
               connectCallback = callback;
            }
         });

         mockSocketClient.getConnectionState.mockReturnValue({
            isConnected: true,
            isConnecting: false,
            isReconnecting: false,
            reconnectCount: 0
         });

         const TestChild1: React.FC = () => {
            const { isConnected } = useSocket();
            return <div data-testid="child1-connected">{isConnected.toString()}</div>;
         };

         const TestChild2: React.FC = () => {
            const { isConnected } = useSocket();
            return <div data-testid="child2-connected">{isConnected.toString()}</div>;
         };

         render(
            <SocketProvider>
               <TestChild1 />
               <TestChild2 />
            </SocketProvider>
         );

         act(() => {
            connectCallback?.(undefined);
         });

         expect(screen.getByTestId('child1-connected')).toHaveTextContent('true');
         expect(screen.getByTestId('child2-connected')).toHaveTextContent('true');
      });
   });
});
