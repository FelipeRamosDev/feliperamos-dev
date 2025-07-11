/**
 * Auth Service - Entry Point
 * 
 * This file exports all authentication-related components, hooks, and types
 * for easy importing throughout the application.
 */

// Main components and hooks
export { AuthProvider, useAuth } from './AuthContext';
export { default as AuthContext } from './AuthContext';

// Types and interfaces
export type {
   User,
   AuthContextValue,
   AuthProviderProps,
   LoginCredentials,
   RegisterData,
   AuthResponse,
   AuthStatusResponse
} from './Auth.types';
