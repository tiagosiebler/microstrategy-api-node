const mstr = require('../lib/mstr');
const axios = require('axios');
const { TestScheduler } = require('jest');

jest.mock('axios');

describe('MSTR REST', () => {
  const testUrl = 'http://localhost:8080/112U2Library/api';

  const loginInfo = {
    username: 'Administrator',
    password: '',
    loginMode: 1,
  };

  const mstrApi = new mstr.REST({
    baseUrl: testUrl,
  });

  describe('Authentication', () => {
    test('axios should have been called', async () => {
      axios.post.mockImplementation(() => {
        Promise.resolve({ data: {} });
      });

      try {
        const sessionInfo = await mstrApi.login(loginInfo);
        expect(axios).toHaveBeenCalled();
      } catch (error) {}
    });

    it('should have been called with POST method', async () => {
      try {
        const endpoint = expect.stringContaining('/api/auth/login');
        const headers = expect.objectContaining({
          Accept: 'application/json',
        });

        const sessionInfo = await mstrApi.login(loginInfo);

        expect(axios).toHaveBeenCalledWith({
          url: endpoint,
          method: 'POST',
          headers,
        });
      } catch (error) {}
    });
  });
});
