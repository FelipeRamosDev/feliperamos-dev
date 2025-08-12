// Mock for marked module
const marked = jest.fn((markdown) => `<p>${markdown}</p>`);

// Add properties to mimic the real marked object
marked.parse = jest.fn((markdown) => `<p>${markdown}</p>`);
marked.setOptions = jest.fn(() => {});
marked.use = jest.fn(() => {});
marked.defaults = {};

export { marked };
export default marked;
