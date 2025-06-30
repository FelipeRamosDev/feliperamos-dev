# SocketClient Service

Frontend Socket.IO client service for connecting to the SocketServer backend.

## Features

- 🔗 **Auto-connection and reconnection**
- 🏠 **Room management** (join/leave/send messages)
- 📊 **Connection statistics and monitoring**
- 🔄 **React hooks and context provider**
- 🛡️ **TypeScript support with full type safety**
- 📡 **Event-driven architecture**

## Files

- `SocketClient.ts` - Main client class
- `SocketClient.types.ts` - TypeScript type definitions
- `useSocketClient.ts` - React hook for socket management
- `SocketProvider.tsx` - React context provider
- `index.ts` - Main exports

## Quick Start

### 1. Install Socket.IO Client

```bash
npm install socket.io-client
```

### 2. Basic Usage

```typescript
import { SocketClient } from '@/services/SocketClient';

const client = new SocketClient({
  url: 'http://localhost:5001',
  autoConnect: true
});

// Listen for messages
client.on('message', (data) => {
  console.log('Received:', data);
});

// Send a message
client.emit('message', { text: 'Hello Server!' });
```

### 3. React Hook Usage

```tsx
import { useSocketClient } from '@/services/SocketClient';

function MyComponent() {
  const { socket, isConnected, emit, joinRoom } = useSocketClient({
    url: 'http://localhost:5001'
  });

  const sendMessage = () => {
    emit('message', { text: 'Hello from React!' });
  };

  const joinChatRoom = () => {
    joinRoom('chat-room-1');
  };

  return (
    <div>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={joinChatRoom}>Join Chat Room</button>
    </div>
  );
}
```

### 4. Context Provider Usage

```tsx
// App.tsx
import { SocketProvider } from '@/services/SocketClient';

function App() {
  return (
    <SocketProvider config={{ url: 'http://localhost:5001' }}>
      <MyApp />
    </SocketProvider>
  );
}

// MyComponent.tsx
import { useSocket } from '@/services/SocketClient';

function MyComponent() {
  const { isConnected, emit, joinRoom } = useSocket();
  
  // Use socket methods...
}
```

## Configuration

```typescript
const config: SocketClientConfig = {
  url: 'http://localhost:5001',
  autoConnect: true,
  reconnectAttempts: 5,
  reconnectDelay: 2000,
  timeout: 10000,
  options: {
    transports: ['websocket', 'polling'],
    upgrade: true,
    withCredentials: true
  }
};
```

## Events

### Connection Events
- `connect` - Connected to server
- `disconnect` - Disconnected from server
- `reconnect` - Reconnected after disconnect
- `error` - Connection error

### Custom Events
- `message` - General messages
- `notification` - Notifications
- `room-joined` - Joined a room
- `room-left` - Left a room
- `room-message` - Message in a room

## Room Management

```typescript
// Join a room
client.joinRoom('chat-room-1');

// Join with password
client.joinRoom('private-room', 'secret123');

// Send message to room
client.sendToRoom('chat-room-1', 'message', {
  text: 'Hello room!',
  user: 'john'
});

// Leave room
client.leaveRoom('chat-room-1');
```

## Environment Variables

Add to your `.env.local`:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

## TypeScript Support

Full type safety with:
- Event name validation
- Data type checking  
- Configuration interfaces
- State management types

## Error Handling

```typescript
client.on('error', (error) => {
  console.error('Socket error:', error);
});

client.on('connect_error', (error) => {
  console.error('Connection failed:', error);
});
```
