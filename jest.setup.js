import '@testing-library/jest-dom';

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
