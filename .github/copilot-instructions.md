# Copilot Instructions - Felipe Ramos Dev (Frontend)

## Project Overview
Next.js 15 frontend for an AI-powered interactive portfolio with real-time chat, admin dashboard, CV management, cover letter generation, and job opportunity tracking. Features Material-UI v7, Redux Toolkit, Socket.IO client, and comprehensive TypeScript coverage.

**Tech Stack**: Next.js 15.3.2 (App Router, Turbopack), React 19, TypeScript 5, Material-UI v7, Redux Toolkit, Socket.IO Client 4.8+, SCSS/Sass, Axios

## Architecture Patterns

### Next.js App Router Structure
**App directory** (`src/app/`) uses Next.js 15 App Router:
- `[lang]/` - Language-specific routes (dynamic segment for i18n)
- `admin/` - Protected admin dashboard (JWT-based auth)
- `layout.tsx` - Root layout with providers
- `page.tsx` - Home page with dynamic metadata

**Key pattern**: Public pages under `[lang]/`, admin pages under `admin/`. No nested admin routes inside `[lang]/`.

### Internationalization Architecture
**Language detection** via URL parameter or browser headers:
```typescript
// Route pattern: /[lang]/page
// Example: /en/curriculum/123 or /pt/curriculum/123
```

Text resources service (`src/services/TextResources/`) provides i18n strings:
```typescript
const text = TextResources.getText('key.path', 'en');
```

Resources stored in `src/resources/text/[locale]/` as TypeScript objects. Default language: 'en' (English), supported: 'en', 'pt' (Portuguese) from `src/app.config.ts`.

### Component Organization
**Strict component hierarchy** (`src/components/`):
- `badges/` - Small UI indicators (SkillBadge, StatusBadge)
- `banners/` - Large header sections (HomeTopBanner)
- `buttons/` - Interactive buttons (CTAButton, RoundButton, FavoriteButton)
- `chat/` - Chat interface components (ChatInterface, MessageBubble)
- `common/` - Reusable UI primitives (TableBase, ModalBase, Spinner, DateView, Markdown, FlexLine)
- `content/` - Page-specific sections (HomeContent, ErrorContent, admin content)
- `footers/` - Footer components
- `forms/` - Form components (LoginForm, Create*Form, Generate*Form)
- `headers/` - Header/navigation components
- `layout/` - Layout wrappers (AdminPageBase, ContentSidebar, DataContainer)
- `menus/` - Menu components
- `modals/` - Modal dialogs
- `tables/` - Table components
- `tiles/` - Card/tile components
- `widgets/` - Dashboard widgets (CVsTableWidget, CustomCVWidget, OpportunityWidget, etc.)

**Component naming**: PascalCase folder and file names. Export from `index.tsx` in component folder.

### State Management (Redux)
**Redux store** (`src/store/`) with Redux Toolkit:
- **Slices**: Feature-based state (chat, ui, auth, etc.)
- **Thunks**: Async actions for API calls
- **Selectors**: Memoized state selectors

Access state via hooks:
```typescript
import { useAppDispatch, useAppSelector } from '@/store';

const dispatch = useAppDispatch();
const value = useAppSelector(state => state.feature.value);
```

**Pattern**: Actions dispatched from components, reducers update state, selectors read state.

### Service Layer Pattern
**Services** (`src/services/`) encapsulate external communication:
- **Ajax** - HTTP client wrapper around Axios with interceptors
- **Auth** - Authentication state and JWT token management
- **SocketClient** - Socket.IO client for real-time communication
- **TextResources** - Internationalization text provider

Services initialized in `src/services/index.tsx` and provided via React Context or direct import.

### Socket.IO Integration
**Real-time connection** to backend Socket.IO server:
```typescript
// Configuration
const socketConfig = {
  url: `${process.env.NEXT_PUBLIC_SERVER_HOST}:${process.env.NEXT_PUBLIC_SERVER_SOCKET_PORT}/namespace`,
  autoConnect: false,
  reconnectAttempts: 5
};

// Usage via hook
const { socket, isConnected, emit, on } = useSocketClient(config);
```

**Namespaces**: `/cv-chat`, `/cover-letter`, `/opportunities` match backend namespaces.

**Pattern**: Socket connections managed by custom hooks (`useGenLetter`, `useLetters`, `useOpportunities`). Components consume hooks, not raw socket.

## Development Workflows

### Running Locally
```bash
npm run dev    # Start development server with Turbopack (fast refresh)
npm run build  # Production build
npm run start  # Run production build
npm run lint   # ESLint checks
npm test       # Run Jest test suite
```

**Hot reload**: Turbopack provides instant hot module replacement. Changes reflect immediately.

### Environment Configuration
Required `.env.local` variables:
```bash
NEXT_PUBLIC_SERVER_HOST=http://localhost
NEXT_PUBLIC_SERVER_SOCKET_PORT=5000
NEXT_PUBLIC_API_PORT=7000
```

**Pattern**: Public env vars prefixed with `NEXT_PUBLIC_` are exposed to browser. Others are server-side only.

### Testing Strategy
**Jest + React Testing Library** (`jest.config.js`, `jest.setup.js`):
- Mock external services (Socket.IO, Axios, marked)
- Test component rendering and user interactions
- Mock store with `redux-mock-store`

```typescript
// Test pattern
import { render, screen } from '@testing-library/react';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

**Module aliases**: `@/` maps to `src/` in both code and tests.

### Admin Dashboard Access
**Protected routes** under `/admin/*` require:
1. JWT token from `POST /auth/login` to backend
2. Cookie-based session (no manual token handling)
3. User role: 'admin' or 'master'

**Pattern**: `AuthContext` (`src/services/Auth/`) manages auth state. Redirect to login if unauthenticated.

## Project-Specific Conventions

### Component Patterns

#### Form Components
Forms in `src/components/forms/` follow standard pattern:
```typescript
interface FormProps {
  onSubmit: (data: FormData) => void | Promise<void>;
  initialValues?: Partial<FormData>;
  isLoading?: boolean;
}
```

Use Material-UI form components with validation. Date fields use `@mui/x-date-pickers` with Day.js.

#### Modal Pattern
Modals extend `ModalBase` component:
```typescript
<ModalBase
  open={isOpen}
  onClose={handleClose}
  title="Modal Title"
  maxWidth="md"
>
  <ModalContent />
</ModalBase>
```

**Pattern**: Modal state managed by parent component. Pass `open` and `onClose` props.

#### Table Pattern
Tables use `TableBase` with generic types:
```typescript
<TableBase<DataType>
  columns={columns}
  data={data}
  onRowClick={handleRowClick}
  isLoading={isLoading}
/>
```

Columns defined with `TableColumn<T>` interface. Sorting and pagination handled by `TableBase`.

### API Communication

#### HTTP Requests
Use `useAjax` hook for API calls:
```typescript
const { loading, error, execute } = useAjax({
  method: 'POST',
  url: '/endpoint',
  onSuccess: (data) => { /* ... */ },
  onError: (error) => { /* ... */ }
});

// Trigger request
execute({ body: data });
```

**Pattern**: Hook manages loading state and error handling. Component renders based on state.

#### Socket Events
Socket hooks (`useGenLetter`, `useLetters`) provide event handling:
```typescript
const { generateLetter, isGenerating, letterContent, error } = useGenLetter({
  opportunityId,
  onComplete: (letter) => { /* ... */ }
});

// Trigger generation
generateLetter({ prompt: '...', jobDescription: '...' });
```

**Pattern**: Hook abstracts socket connection and event lifecycle. Component uses simple API.

### Styling Approach

#### SCSS Architecture
Global styles in `src/style/`:
- `variables.scss` - Colors, spacing, breakpoints
- `globals.scss` - Global CSS resets and utilities
- `global-mui.scss` - Material-UI theme overrides

**Pattern**: Component-specific styles as SCSS modules (`Component.module.scss`). Global utilities for common patterns.

#### Material-UI Theme
Custom theme in `src/theme/defaultTheme.ts`:
- Color palette customization
- Typography scale
- Component default props
- Responsive breakpoints

**Pattern**: Theme provided at root via `ThemeProvider`. Components use MUI's `sx` prop or `styled` API.

#### Responsive Design
**Mobile-first** breakpoints:
```scss
// Mobile: base styles
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large screens */ }
```

Use MUI's responsive utilities: `sx={{ xs: value, md: value }}`.

### CV and PDF Management

#### CV Viewing
CV pages under `[lang]/curriculum/[cv_id]`:
- Server-side rendered with dynamic metadata
- PDF viewer at `[lang]/pdf/curriculum/[cv_id]`
- Download PDF from backend `/public/cv/` endpoint

**Pattern**: Fetch CV data server-side, pass to client components as props.

#### Cover Letter Flow
1. **Create Opportunity** - Admin creates job opportunity
2. **Generate Letter** - Socket.IO real-time generation with AI
3. **View/Edit** - Admin can edit generated content
4. **Download PDF** - Export to PDF via VirtualBrowser service

**Pattern**: Status updates via Socket.IO events (`status`, `complete`, `error`). UI reflects generation progress.

### Language Set Handling
**Multi-language entities** (skills, companies, experiences, etc.):
- Base entity with primary language
- Additional language versions via `*_set` records
- Frontend requests specific language: `?language_set=en`

**Pattern**: Forms include language selector. API returns language-specific content.

## Critical Integration Points

### Backend API Endpoints
API server on port 7000 provides RESTful endpoints:
- **Auth**: `POST /auth/login`, `GET /auth/user`
- **CRUD**: `POST /resource/create`, `GET /resource/:id`, `PATCH /resource/update`, `DELETE /resource/delete`
- **Search**: `GET /resource/query` with query params

**Pattern**: Use Axios via Ajax service. Credentials included automatically (cookies).

### Socket.IO Namespaces
Connect to specific namespaces for real-time features:
- `/cv-chat` - AI assistant conversations
- `/cover-letter` - Cover letter generation
- `/opportunities` - Job opportunity management

**Pattern**: One socket connection per namespace. Disconnect when component unmounts.

### State Synchronization
**Admin dashboard** updates across tabs via:
- Redux state (local updates)
- API polling for fresh data (optional)
- Socket.IO events for real-time updates (opportunities, letters)

**Pattern**: Optimistic UI updates, then API confirmation. Revert on error.

## Testing & Debugging

### Test Structure
Tests in `__tests__/` folders or `*.test.tsx` files:
```typescript
// Mock setup
jest.mock('@/services/SocketClient');

// Component test
describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

**Pattern**: Mock external dependencies. Test component behavior, not implementation.

### Common Issues
- **Hydration errors**: Ensure server and client render same HTML (check date formats, random values)
- **Socket connection fails**: Verify backend Socket.IO server is running on correct port
- **API 401 errors**: Check authentication cookie exists and is valid
- **Module not found**: Verify import path uses `@/` alias correctly
- **PDF not loading**: Ensure PDF file exists in backend's public directory

### Debug Tools
- **React DevTools**: Inspect component tree and props
- **Redux DevTools**: Monitor state changes and actions
- **Network tab**: Check API requests and responses
- **Console errors**: Watch for hydration mismatches and runtime errors

## Key Files Reference

- `src/app/layout.tsx` - Root layout with providers (Redux, MUI Theme, Auth)
- `src/app.config.ts` - Language and category configuration
- `src/services/index.tsx` - Service initialization and exports
- `src/store/index.ts` - Redux store configuration
- `next.config.ts` - Next.js configuration
- `jest.config.js` - Test configuration with module aliases

## Style Guidelines

- **Imports**: Group by external, internal services, components, types, styles
- **TypeScript**: Prefer `interface` for props, `type` for unions/intersections
- **Component structure**: Props interface → Component function → Export
- **Async state**: Use hooks (`useAjax`, socket hooks) over manual state management
- **Error handling**: Show user-friendly messages, log detailed errors to console
- **Accessibility**: Use semantic HTML, ARIA labels, keyboard navigation support
