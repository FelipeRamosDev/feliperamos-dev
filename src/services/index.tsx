export { default as TextResources } from './TextResources/TextResources';
export { default as SocketClient } from './SocketClient/SocketClient';

// Auth service exports
export { AuthProvider, useAuth, AuthContext } from './Auth';
export type {
   User,
   AuthContextValue,
   AuthProviderProps,
   LoginCredentials,
   RegisterData,
   AuthResponse,
   AuthStatusResponse
} from './Auth';

// Ajax service exports
export { Ajax } from './Ajax';
export type { AjaxConfig, RequestOptions, AjaxResponse } from './Ajax';
