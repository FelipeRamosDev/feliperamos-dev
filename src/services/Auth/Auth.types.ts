import { ReactNode } from 'react';

/**
 * User object interface representing authenticated user data
 */
export interface User {
   id?: string | number;
   email?: string;
   name?: string;
   [key: string]: string | number | boolean | null | undefined;
}

/**
 * Authentication context value interface
 */
export interface AuthContextValue {
   user: User | null;
   loading: boolean;
   login: (email: string, password: string) => Promise<AuthResponse>;
   register: (data: RegisterData) => Promise<AuthResponse>;
   logout: () => Promise<AuthResponse>;
}

/**
 * Auth provider props interface
 */
export interface AuthProviderProps {
   loadedUser?: User | null;
   noSpinner?: boolean;
   renderIfLoading?: boolean;
   redirectLogin?: boolean;
   spinnerHeight?: string;
   spinnerSize?: 'small' | 'medium' | 'large';
   notAuthRender?: boolean;
   children: ReactNode;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
   email: string;
   password: string;
}

/**
 * Registration data interface
 */
export interface RegisterData {
   email: string;
   password: string;
   name?: string;
   username?: string;
   [key: string]: string | number | boolean | null | undefined;
}

/**
 * Auth API response interface
 */
export interface AuthResponse {
   success: boolean;
   message?: string;
   user?: User;
   token?: string;
   error?: string;
   [key: string]: string | number | boolean | User | null | undefined;
}

/**
 * Auth status response interface
 */
export interface AuthStatusResponse {
   success: boolean;
   data: User | null;
   message?: string;
}

/**
 * Error response from API calls
 */
export interface AuthErrorResponse {
   response?: {
      data: AuthResponse;
   };
   message?: string;
}

