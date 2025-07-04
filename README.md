# Felipe Ramos - Interactive Resume & Portfolio

A modern, AI-powered interactive resume built with Next.js, featuring real-time chat capabilities and a sleek user interface. This project serves as both a portfolio showcase and an intelligent assistant that can answer questions about Felipe's professional background.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat with an AI assistant trained on Felipe's professional background
- **Real-time Communication**: Socket.io integration for live chat functionality
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Modern UI/UX**: Built with Material-UI components and custom SCSS styling
- **TypeScript**: Fully typed codebase for better development experience
- **Redux State Management**: Centralized state management for chat and application state
- **Professional Portfolio**: Showcase of skills, projects, and career journey

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.2** - React framework with App Router and Turbopack
- **React 19** - Latest React with modern features
- **TypeScript 5** - Type-safe JavaScript with latest features
- **Redux Toolkit** - Modern Redux state management
- **Material-UI v7** - Latest Material Design components
- **SCSS/Sass** - Advanced CSS preprocessing
- **Socket.io Client 4.8+** - Real-time bidirectional communication

### Backend Integration
- **Socket.io** - Real-time WebSocket communication
- **Redis** - Session storage and caching
- **RESTful APIs** - Backend service integration

## 📦 Project Structure

```
feliperamos-dev/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # Reusable React components
│   │   ├── banners/           # Banner components
│   │   ├── chat/              # Chat interface components
│   │   ├── common/            # Shared UI components
│   │   ├── content/           # Content-specific components
│   │   ├── footers/           # Footer components
│   │   ├── headers/           # Header components
│   │   └── layout/            # Layout components
│   ├── models/                # Data models and types
│   ├── services/              # API and service integrations
│   │   └── SocketClient/      # Socket.io client service
│   ├── store/                 # Redux store configuration
│   ├── style/                 # Global styles and SCSS files
│   ├── theme/                 # Material-UI theme configuration
│   └── utils/                 # Utility functions
├── public/                    # Static assets
└── ...config files
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to the backend API services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FelipeRamosDev/feliperamos-dev.git
   cd feliperamos-dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file based on the example:
   ```bash
   cp example.env .env.local
   ```
   
   Update the environment variables:
   ```env
   NEXT_PUBLIC_SERVER_HOST=http://localhost
   NEXT_PUBLIC_SERVER_SOCKET_PORT=5000
   NEXT_PUBLIC_API_PORT=3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🎯 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run test suite

### Testing
- `npm test` - Run all tests with Jest

## 🎨 Key Components

### Chat System
- **Chat Interface**: Real-time messaging with AI assistant
- **Message Components**: Styled message bubbles with timestamps
- **Input Handling**: Smart input with keyboard shortcuts (Shift+Enter to send)
- **Typing Indicators**: Real-time typing status

### UI Components
- **Responsive Cards**: Flexible card components with elevation options
- **Social Links**: Professional social media integration
- **Navigation**: Clean header and footer navigation
- **Buttons**: Consistent button styling across the application

### State Management
- **Chat State**: Message history, input values, and chat status
- **UI State**: Loading states, modal controls, and user preferences
- **Socket State**: Connection status and real-time updates

## 🔌 Socket Integration

The application integrates with the feliperamos-api backend service for real-time functionality:

```typescript
// Socket connection configuration
const socketConfig = {
  url: `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT}/cv-chat`,
  autoConnect: false,
  reconnectAttempts: 5,
  reconnectDelay: 2000,
  timeout: 10000
};
```

### Socket Events
- `start-chat` - Initialize chat session
- `assistant-message` - Receive AI responses
- `assistant-typing` - Typing indicators

## 🎨 Styling & Theming

### SCSS Architecture
- **Variables**: Consistent color scheme, spacing, and breakpoints
- **Mixins**: Reusable style patterns
- **Components**: Modular component-specific styles
- **Utilities**: Helper classes for common patterns

### Material-UI Theme
- Custom color palette
- Typography scale
- Component overrides
- Responsive breakpoints

## 🧪 Testing

The project includes comprehensive testing with:

- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **TypeScript Support** - Type-safe test environment

Run tests:
```bash
npm test                    # Run all tests with Jest
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Optimized for smartphones (320px+)
- **Tablet**: Enhanced layout for tablets (768px+)
- **Desktop**: Full-featured desktop experience (1024px+)
- **Large Screens**: Optimized for large displays (1440px+)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Support
```bash
# Build Docker image
docker-compose build --no-cache

# Run container
docker-compose up -d
```

### Environment Variables
Ensure all production environment variables are configured:
- `NEXT_PUBLIC_SERVER_HOST` - Backend server host
- `NEXT_PUBLIC_SERVER_SOCKET_PORT` - Socket server port
- `NEXT_PUBLIC_API_PORT` - API server port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/_FRD-**`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/_FRD-**`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Felipe Ramos**
- Website: [https://feliperamos.dev](https://feliperamos.dev)
- Email: felipe@feliperamos.dev
- LinkedIn: [linkedin.com/in/feliperamos-dev](https://linkedin.com/in/feliperamos-dev)
- GitHub: [github.com/FelipeRamosDev](https://github.com/FelipeRamosDev)
