const mstr = require('../lib/mstr');
const axios = require('axios');

jest.mock('axios', () =>
  jest.fn(() =>
    Promise.resolve({
      status: 204,
      headers: { 'x-mstr-authtoken': 'mockAuthToken' },
    })
  )
);

describe('Testing Library module', () => {
  const testUrl = 'http://fakehost/fakeurl/api';
  const loginInfo = {
    username: 'Administrator',
    password: '',
    loginMode: 1,
  };

  const mstrApi = new mstr.REST({
    baseUrl: testUrl,
  });

  // test('Axios should have been called', async () => {
  //   const sessionInfo = await mstrApi.login(loginInfo);
  //   expect(axios).toHaveBeenCalled();
  // });

  // test('should store auth toekn after successful login', async () => {
  //   const headers = mstrApi.getSessionHeaders();
  //   expect(headers['X-MSTR-AuthToken']).toEqual('mockAuthToken');
  // });

  describe('Library -> getLibrary()', () => {
    it('Should have been called with proper endpoint', () => {
      const endpoint = expect.stringContaining('/api/library');
      const library = mstrApi.library.getLibrary();
      expect(axios).toHaveBeenCalledWith({ url: endpoint });
    });
    it('Should have been called with GET method', async () => {
      const library = mstrApi.library.getLibrary();
    });
  });
});
