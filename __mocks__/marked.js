// Mock for marked module
export const marked = {
  parse: (markdown) => `<p>${markdown}</p>`,
  setOptions: () => {},
  use: () => {},
  defaults: {},
};

export default marked;
