'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner/Spinner';
import type { AjaxResponse, AjaxResponseError } from '../Ajax/Ajax.types';
import { useAjax } from '@/hooks/useAjax';
import type { 
   AuthContextValue, 
   AuthProviderProps, 
   User, 
   RegisterData, 
   AuthResponse,
   AuthErrorResponse
} from './Auth.types';

/**
 * React Context for authentication state and loading status.
 * Provides user and loading state to consumers.
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Safe router hook that works in both app and test environments
 */
const useSafeRouter = () => {
   try {
      return useRouter();
   } catch {
      // Return a mock router for testing environments
      return {
         push: (url: string) => {
            if (typeof window !== 'undefined') {
               console.warn(`Navigation to ${url} attempted in test environment`);
            }
         },
         replace: (url: string) => {
            if (typeof window !== 'undefined') {
               console.warn(`Replace navigation to ${url} attempted in test environment`);
            }
         },
         back: () => {
            if (typeof window !== 'undefined') {
               console.warn('Back navigation attempted in test environment');
            }
         },
         forward: () => {
            if (typeof window !== 'undefined') {
               console.warn('Forward navigation attempted in test environment');
            }
         },
         refresh: () => {
            if (typeof window !== 'undefined') {
               console.warn('Refresh attempted in test environment');
            }
         }
      };
   }
};

/**
 * AuthProvider component for managing authentication state and user session.
 * Fetches user info on mount, handles loading and redirect logic, and provides context to children.
 */
export function AuthProvider({
   loadedUser,
   noSpinner = false,
   renderIfLoading = false,
   redirectLogin = false,
   spinnerHeight,
   spinnerSize,
   notAuthRender = false,
   children
}: AuthProviderProps) {
   const [ user, setUser ] = useState<User | null>(loadedUser || null);
   const [ loading, setLoading ] = useState<boolean>(loadedUser ? false : true);
   const isRender = user || notAuthRender || renderIfLoading;
   const router = useSafeRouter();
   const ajax = useAjax();

   const login = async (email: string, password: string): Promise<AuthResponse | AjaxResponseError> => {
      try {
         const loginUser = await ajax.post<AuthResponse>('/auth/login', { email, password });

         if (!loginUser.success) {
            throw loginUser;
         }

         router.push('/admin');
         return loginUser.data;
      } catch (error) {
         return error as AjaxResponseError;
      }
   };

   const register = async (data: RegisterData): Promise<AuthResponse | AjaxResponseError> => {
      try {
         const registerUser = await ajax.put<AuthResponse>('/auth/cadastro', data);

         if (!registerUser.success) {
            return registerUser as AjaxResponseError;
         }

         router.push('/admin');
         return registerUser.data;
      } catch (error) {
         return error as AjaxResponseError;
      }
   };

   const logout = async (): Promise<AuthResponse | AjaxResponseError> => {
      try {
         const logoutUser = await ajax.post<AuthResponse | AjaxResponseError>('/auth/logout');

         if (!logoutUser.success) {
            throw logoutUser;
         }

         setUser(null);
         router.push('/');
         return logoutUser.data;
      } catch (error: unknown) {
         const errorData = (error as AuthErrorResponse).response ? (error as AuthErrorResponse).response?.data : error;
         return errorData as AuthResponse;
      }
   };

   useEffect(() => {
      if (user) {
         return;
      }

      ajax.get<User>('/auth/user').then((response: AjaxResponse<User> | AjaxResponseError) => {
         if (!response.success) {
            throw response;
         }

         if (!response.data) {
            setUser(null);

            if (redirectLogin) {
               router.push('/admin/login');
            }

            return;
         }

         setUser(response.data || null);
      }).catch(() => {
         setUser(null);

         if (redirectLogin) {
            router.push('/admin/login');
         }
      }).finally(() => {
         setLoading(false);
      });
   }, [ user, ajax, redirectLogin, router ]);

   if (loading && !renderIfLoading && !noSpinner) {
      return <Spinner wrapperHeight={spinnerHeight} size={spinnerSize} />;
   }

   return (
      <AuthContext.Provider value={{
         user,
         loading,
         login,
         register,
         logout
      }}>
         {isRender && children}
      </AuthContext.Provider>
   );
}

/**
 * Custom hook to access authentication context values.
 *
 * @returns Authentication context value containing user, loading state, and auth methods
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextValue {
   const context = useContext(AuthContext);

   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }

   return context;
}

export default AuthContext;
