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
- **Internationalization**: Multi-language support (English/Portuguese) with dynamic metadata
- **Dynamic Work Experience**: Comprehensive work history with markdown support and company logos
- **Skills Showcase**: Auto-generated skills section based on professional experience
- **Markdown Content Rendering**: Rich text content parsing and rendering capabilities
- **Admin Dashboard**: Full content management system for administrators
- **Data Management**: CRUD operations for companies, experiences, and skills
- **Form Validation**: Advanced form handling with date pickers and multi-select components

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.2** - React framework with App Router and Turbopack
- **React 19** - Latest React with modern features
- **TypeScript 5** - Type-safe JavaScript with latest features
- **Redux Toolkit** - Modern Redux state management
- **Material-UI v7** - Latest Material Design components
- **SCSS/Sass** - Advanced CSS preprocessing
- **Socket.io Client 4.8+** - Real-time bidirectional communication
- **Marked** - Markdown parsing and rendering library
- **Day.js** - Modern date manipulation library
- **Axios** - Promise-based HTTP client

### Backend Integration
- **Socket.io** - Real-time WebSocket communication
- **Redis** - Session storage and caching
- **RESTful APIs** - Backend service integration

### New in v1.2.0
- **Admin Dashboard System**: Complete content management interface for administrators
- **Company Management**: Full CRUD operations for company data with logo support
- **Experience Management**: Comprehensive experience editing with markdown support and skill assignment
- **Skill Management**: Advanced skill categorization and management system
- **Form Components**: Rich form library with date pickers, multi-select chips, and validation
- **Table Components**: Advanced data tables with pagination, sorting, and filtering
- **Authentication System**: User authentication and authorization for admin features
- **Enhanced Database Integration**: Improved API communication with axios and better error handling

### New in v1.1.0
- **Internationalization System**: Complete i18n support with TextResources service
- **Dynamic Metadata Generation**: SEO-optimized metadata based on language and content
- **Professional Experience Section**: Detailed work history with company logos and descriptions
- **Skills Showcase**: Auto-generated skills grid from work experience
- **Markdown Content Support**: Rich text rendering with HTML output
- **Improved Chat Interface**: Enhanced mobile responsiveness and scroll behavior
- **Component Architecture**: Reorganized component structure with better separation of concerns

## 📦 Project Structure

```
feliperamos-dev/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   │   ├── company/       # Company management pages
│   │   │   ├── skill/         # Skill management pages
│   │   │   ├── experience/    # Experience management pages
│   │   │   └── page.tsx       # Admin dashboard home
│   │   ├── [lang]/            # Language-specific routes
│   │   ├── app.config.ts      # App configuration (languages, defaults)
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page with dynamic metadata
│   ├── components/             # Reusable React components
│   │   ├── badges/            # Badge components (SkillBadge)
│   │   ├── banners/           # Banner components
│   │   ├── buttons/           # Button components (CTAButton, RoundButton)
│   │   ├── chat/              # Chat interface components
│   │   ├── common/            # Shared UI components
│   │   │   ├── TableBase/     # Advanced table components
│   │   │   ├── DateView/      # Date display components
│   │   │   └── Markdown/      # Markdown rendering components
│   │   ├── content/           # Content-specific components
│   │   │   ├── admin/         # Admin-specific content components
│   │   │   │   ├── company/   # Company management UI
│   │   │   │   ├── skill/     # Skill management UI
│   │   │   │   └── experience/ # Experience management UI
│   │   │   ├── ErrorContent/  # Error page components
│   │   │   └── HomeContent/   # Home page sections
│   │   │       └── sections/  # Experience, Skills sections
│   │   ├── forms/             # Form components and validation
│   │   │   ├── LoginForm/     # Authentication forms
│   │   │   ├── CreateCompanyForm/ # Company creation forms
│   │   │   ├── CreateExperienceForm/ # Experience forms
│   │   │   └── CreateSkillForm/ # Skill forms
│   │   ├── footers/           # Footer components
│   │   ├── headers/           # Header components
│   │   ├── layout/            # Layout components
│   │   │   ├── AdminPageBase/ # Admin layout wrapper
│   │   │   ├── ContentSidebar/ # Admin sidebar navigation
│   │   │   └── DataContainer/ # Data display containers
│   │   ├── tiles/             # Tile/card components
│   │   └── widgets/           # Dashboard widgets
│   ├── helpers/               # Utility functions and helpers
│   │   ├── database.helpers.ts # Database utility functions
│   │   └── parse.helpers.ts   # CSS and styling helpers
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAjax.ts        # HTTP request hook
│   │   └── Form/             # Form-related hooks
│   ├── models/                # Data models and types
│   ├── resources/             # Text resources and content
│   │   └── text/             # Internationalized text resources
│   ├── services/              # API and service integrations
│   │   ├── Ajax/             # HTTP service layer
│   │   ├── Auth/             # Authentication services
│   │   ├── SocketClient/      # Socket.io client service
│   │   └── TextResources/     # Internationalization service
│   ├── store/                 # Redux store configuration
│   ├── style/                 # Global styles and SCSS files
│   ├── theme/                 # Material-UI theme configuration
│   └── types/                 # TypeScript type definitions
│       └── database.types.ts  # Database entity types
├── public/                    # Static assets
│   ├── cv/                    # CV files
│   └── images/                # Images and logos
│       ├── companies/         # Company logos
│       └── osf_clients/       # Client logos
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

### Internationalization System
- **TextResources Service**: Centralized text management with language switching
- **Dynamic Metadata**: SEO-optimized metadata generation based on user language
- **Multi-language Support**: English and Portuguese support throughout the application

### Professional Experience Section
- **Company Showcase**: Detailed work history with company logos and descriptions
- **Markdown Support**: Rich text content rendering for job descriptions
- **Skills Integration**: Automatic skills extraction and display
- **Responsive Design**: Mobile-optimized layout for work experience cards

### Chat System
- **Chat Interface**: Real-time messaging with AI assistant
- **Message Components**: Styled message bubbles with timestamps
- **Input Handling**: Smart input with keyboard shortcuts (Shift+Enter to send)
- **Typing Indicators**: Real-time typing status
- **Mobile Optimization**: Enhanced mobile chat experience with scroll detection

### UI Components
- **Badge System**: Skill badges with different styles and states
- **Responsive Cards**: Flexible card components with elevation options
- **Social Links**: Professional social media integration with internationalized labels
- **Navigation**: Clean header and footer navigation
- **Buttons**: Consistent button styling across the application (CTA, Round buttons)

### State Management
- **Chat State**: Message history, input values, and chat status
- **UI State**: Loading states, modal controls, and user preferences
- **Socket State**: Connection status and real-time updates
- **Language State**: Current language and text resource management

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

## 📋 Changelog

### v1.2.0 Release Notes

#### 🏗️ Admin Dashboard System
- **Complete Admin Interface**: Full-featured administration panel for content management
- **User Authentication**: Secure login system with session management and role-based access
- **Admin Navigation**: Intuitive sidebar navigation with organized sections for different data types
- **Dashboard Overview**: Comprehensive dashboard with widgets for companies, experiences, and skills

#### 🏢 Company Management
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for company data
- **Company Profiles**: Detailed company information with logo support and metadata
- **Company Sets**: Advanced categorization system for organizing company data
- **Form Validation**: Comprehensive form validation with error handling and user feedback

#### 💼 Experience Management  
- **Experience Editor**: Rich experience creation and editing interface with markdown support
- **Skill Assignment**: Advanced skill linking system with multi-select capabilities
- **Experience Sets**: Organizational system for grouping related experiences
- **Date Management**: Sophisticated date handling with Day.js integration and date pickers
- **Status Tracking**: Experience status management (active, inactive, draft)

#### 🛠️ Skill Management
- **Skill Categories**: Organized skill categorization (languages, frameworks, tools, databases, cloud, other)
- **Skill Details**: Comprehensive skill information with descriptions and proficiency levels
- **Skill Sets**: Advanced grouping system for related skills
- **Skills Integration**: Deep integration with experience management for automatic skill detection

#### 📝 Advanced Form System
- **Form Components**: Rich library of form components including inputs, selects, date pickers
- **Multi-Select Chips**: Advanced multi-selection interface with chip-based UI
- **Form Validation**: Real-time validation with error messages and success feedback
- **Date Pickers**: Material-UI date picker integration with Day.js
- **Button Selects**: Custom button-based selection components for better UX

#### 📊 Data Management & Tables
- **Advanced Tables**: Sophisticated table components with sorting, filtering, and pagination
- **Data Containers**: Flexible data display containers with responsive design
- **Table Configuration**: Configurable table columns with custom formatting and tooltips
- **No Data States**: Elegant empty state handling with user-friendly messages
- **Responsive Design**: Mobile-optimized table layouts with proper overflow handling

#### 🔧 Technical Infrastructure
- **Axios Integration**: Enhanced HTTP client for API communication with interceptors
- **Day.js Integration**: Modern date manipulation library replacing moment.js
- **Database Types**: Comprehensive TypeScript interfaces for all database entities
- **Error Handling**: Improved error management with dedicated error pages and user feedback
- **Helper Functions**: Organized utility functions for database operations and parsing

#### 🎨 UI/UX Enhancements
- **Markdown Renderer**: Rich markdown rendering with syntax highlighting and custom styling
- **Date Display**: Flexible date viewing component with multiple format options
- **Error Content**: Dedicated error page components with proper error information display
- **Loading States**: Enhanced loading indicators and skeleton screens
- **Admin Styling**: Consistent admin interface styling with Material-UI integration

#### 🌐 Internationalization Updates
- **Language Normalization**: Updated from locale codes (en-US, pt-BR) to language codes (en, pt)
- **Admin Text Resources**: Comprehensive internationalization for all admin interface text
- **Form Labels**: Multilingual form labels and validation messages
- **Error Messages**: Internationalized error messages and user feedback

#### 🔒 Authentication & Authorization
- **Auth Context**: React context for authentication state management
- **Login Forms**: Secure login interface with validation and error handling
- **Session Management**: Proper session handling with automatic token refresh
- **Protected Routes**: Route protection for admin-only areas

#### 🧪 Testing & Quality
- **Comprehensive Tests**: Extensive test coverage for all new components
- **Component Testing**: React Testing Library integration for UI component testing
- **Mock Services**: Proper mocking for API services and external dependencies
- **Type Safety**: Enhanced TypeScript coverage for better development experience

### v1.1.0 Release Notes

#### 🌐 Internationalization & Localization
- **Complete i18n System**: Added comprehensive internationalization support with TextResources service
- **Dynamic Language Detection**: Automatic language detection from browser headers and URL parameters
- **Multi-language Metadata**: Dynamic SEO metadata generation based on user language (English/Portuguese)
- **Localized Content**: All UI text, buttons, and descriptions now support multiple languages

#### 💼 Professional Experience & Portfolio
- **Experience Section**: Comprehensive work history showcase with company details
- **Company Integration**: Added logos and information for CandlePilot, OSF Digital, Adam Robô, Prado & Becker, and Prieto & Spina
- **Markdown Support**: Rich text rendering for job descriptions and responsibilities
- **Skills Showcase**: Auto-generated skills section based on professional experience
- **Client Portfolio**: Added client logos and project showcases (Berluti, L'Oréal, Stonewall Kitchen, etc.)

#### 🎨 Enhanced UI/UX
- **Component Reorganization**: Moved buttons from `/common/buttons` to `/buttons` for better organization
- **Badge System**: New SkillBadge component with different states (normal, strong, disabled)
- **Improved Chat Interface**: Enhanced mobile responsiveness with scroll detection and behavior
- **Button Components**: New RoundButton component for improved social links and actions
- **Visual Improvements**: Updated color scheme and enhanced styling consistency

#### 🛠️ Technical Improvements
- **Marked Integration**: Added markdown parsing library for rich content rendering
- **App Configuration**: Centralized app config for languages and default settings
- **Component Architecture**: Better separation of concerns with dedicated text resource files
- **Mobile Optimization**: Improved chat behavior on mobile devices with scroll end detection
- **Performance**: Enhanced component rendering and state management

#### 🔧 Developer Experience
- **Type Safety**: Enhanced TypeScript types for new components and services
- **Code Organization**: Better file structure and component organization
- **Testing Support**: Updated test configurations for new components
- **Documentation**: Comprehensive inline documentation for new features

#### 🐛 Bug Fixes & Improvements
- **Chat Scroll Behavior**: Fixed chat scrolling issues on mobile devices
- **Metadata Generation**: Resolved issues with dynamic metadata in App Router
- **Component Styling**: Fixed various styling inconsistencies
- **Language Switching**: Improved language detection and switching reliability

---

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
