module.exports = axios = {
  get: jest.fn(() => {
    Promise.resolve({ data: {} });
  }),
  post: jest.fn(() => {
    Promise.resolve({ data: {} });
  }),
};
