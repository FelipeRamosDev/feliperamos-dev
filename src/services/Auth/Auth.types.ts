import { ReactNode } from 'react';
import { AjaxResponseError } from '../Ajax/Ajax.types';

/**
 * User object interface representing authenticated user data
 */
export interface UserData {
   id?: string | number;
   email?: string;
   phone?: string;
   name?: string;
   first_name: string;
   last_name: string;
   birth_date?: Date;
   country?: string;
   state?: string;
   city?: string;
   avatar_url?: string;
   github_url?: string;
   linkedin_url?: string;
   whatsapp_number?: string;
   portfolio_url?: string;
}

/**
 * Authentication context value interface
 */
export interface AuthContextValue {
   user: UserData | null;
   loading: boolean;
   login: (email: string, password: string) => Promise<AuthResponse | AjaxResponseError>;
   register: (data: RegisterData) => Promise<AuthResponse | AjaxResponseError>;
   logout: () => Promise<AuthResponse | AjaxResponseError>;
}

/**
 * Auth provider props interface
 */
export interface AuthProviderProps {
   loadedUser?: UserData | null;
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
   data?: UserData;
   token?: string;
   error?: string;
   [key: string]: string | number | boolean | UserData | null | undefined;
}

/**
 * Auth status response interface
 */
export interface AuthStatusResponse {
   success: boolean;
   data: UserData | null;
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

