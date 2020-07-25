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
    it('Should have been called with endpoint /api/library', () => {
      const mstrApi = new mstr.REST({ baseUrl: testUrl });
      const library = mstrApi.library.getLibrary();
      const endpoint = expect.stringMatching('/api/library');

      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({ url: endpoint })
      );
    });

    it('Should have been called with GET method', async () => {
      const mstrApi = new mstr.REST({ baseUrl: testUrl });
      const library = mstrApi.library.getLibrary();
      const method = expect.objectContaining({ method: 'GET' });

      expect(axios).toHaveBeenCalledWith(method);
    });

    it('should have been called with authToken header', async () => {
      const mstrApi = new mstr.REST({
        baseUrl: testUrl,
      });
      const sessionInfo = await mstrApi.login(loginInfo);
      const headers = mstrApi.getSessionHeaders();
      jest.clearAllMocks();
      const library = mstrApi.library.getLibrary();
      const expectedHeaders = expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
          'X-MSTR-AuthToken': headers['X-MSTR-AuthToken'],
        },
      });
      expect(axios).toHaveBeenCalledTimes(1);
      expect(axios).toHaveBeenCalledWith(expectedHeaders);
    });
  });
});
