const mstr = require('../../../lib/mstr');
const axios = require('axios');

jest.mock('axios', () => jest.fn(() => Promise.resolve({})));

const testUrl = 'http://fakehost/fakeurl/api';
const sharedRestOptions = {
  baseUrl: testUrl,
  skipValidateResponseStatusCode: true,//skip response validation/handling, since we're not interested in server response here
  skipThrowOnHTTPException: true
};

describe('Testing Library module', () => {

  describe('Library -> getLibrary() method:', () => {
    it('Should always use GET', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);
      const library = mstrApi.library.getLibrary();

      const requestOptions = expect.objectContaining({ method: 'GET' });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);
      const library = mstrApi.library.getLibrary();

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('/api/library')
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Correctly passes outputFlag parameter, if defined', () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const exampleFlag = 'customOutputFlag';
      const library = mstrApi.library.getLibrary(exampleFlag);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('outputFlag=' + exampleFlag)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const fakeAuthToken = 'someAuthToken';

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(fakeAuthToken);

      const library = mstrApi.library.getLibrary();

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': fakeAuthToken
        })
      });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  });
});
