const axios = require('axios');
const mstr = require('//lib/mstr');

// const generateGrid = require('//src/game/util/generateGrid');
const fakeURL = 'http://fakedomain:8080/something/api';

// jest.mock('axios', () => jest.fn(() => Promise.resolve()));
jest.mock('axios');

describe('MSTR REST - Authentication', () => {
  describe('Login', () => {
    test('asdfafdasfasfasdfasf', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: fakeURL,
      });

      const loginRequest = {
        username: 'Administrator',
        password: '',
        loginMode: 1,
      };

      const loginRequest2 = {
        username: 'Administrataor',
        password: '',
        loginMode: 1,
      };

      axios.post.mockImplementation(() => Promise.resolve({ data: {} }));

      // expect(axios.post).toHaveBeenCalledWith('/web-service-url/', {data: 'a' });

      try {
        const sessionInfo = await mstrApi.login(loginRequest);
        console.log('session', sessionInfo);
      } catch (e) {}

      const endpoint = expect.stringContaining('/api/auth/login');
      const method = 'POST';
      const headers = expect.objectContaining({
        Accept: 'application/json',
      });

      expect(axios).toBeCalledWith({
        url: endpoint,
        method,
        headers,
        data: loginRequest,
      });
    });
  });
});
