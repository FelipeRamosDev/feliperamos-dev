import '@testing-library/jest-dom';

// Suppress HTMLFormElement.requestSubmit console errors globally
const originalConsoleError = console.error;
console.error = (...args) => {
   if (args[0]?.message?.includes('Not implemented: HTMLFormElement.prototype.requestSubmit')) {
      return;
   }
   originalConsoleError(...args);
};

// Mock TextResources globally - using a simpler approach to avoid circular dependencies
jest.mock('@/services', () => ({
   TextResources: jest.fn().mockImplementation(() => ({
      create: jest.fn(),
      getText: jest.fn((key) => `Mocked text for ${key}`),
      currentLanguage: 'en'
   })),
   useAuth: jest.fn(() => ({ user: null })),
   Ajax: jest.fn().mockImplementation(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
   }))
}));

// Mock timers globally for all tests
global.setInterval = jest.fn((callback, delay) => {
   return setTimeout(callback, delay);
});

global.clearInterval = jest.fn((id) => {
   clearTimeout(id);
});

// Mock window.setInterval and window.clearInterval as well
Object.defineProperty(window, 'setInterval', {
   value: global.setInterval,
   writable: true
});

Object.defineProperty(window, 'clearInterval', {
   value: global.clearInterval,
   writable: true
});
