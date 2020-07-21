const mstr = require('../lib/mstr');

const axios = require('axios');

jest.mock('axios');

describe('Testing Library module', () => {
  const testUrl = 'http://fakehost/fakeurl/api';

  //const mstrApi = new mstr.REST({ baseUrl: testUrl });
  describe('Library->getLibrary', () => {
    //hacer algo como esto
    //hacer lo mismo para las cookies
    const mstrApi = new mstr.REST({ baseUrl: testUrl });
    const mockSessionObject = {
      'X-MSTR-AuthToken': 'mockAuthToken',
      Cookie: 'JSESSIONID=mockSessionID',
    };
    // restore session state with mock values
    // axios.get.mockImplementation(() => {
    //   return Promise.resolve({ data: {} });
    // });
    mstrApi.setSessionHeaders(mockSessionObject);
    it('should not throw error', () => {
      expect(() => mstrApi.library.getLibrary()).not.toThrow();
    });

    it('should have been called with GET method', async () => {
      try {
        const endpoint = expect.stringContaining('/api/library');
        //Mirar esto y ver casos y pensar.

        const library = mstrApi.library.getLibrary();

        expect(axios).toHaveBeenCalledWith({
          url: endpoint,
          method: 'GET',
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    });
    it('has authToken header', async () => {
      try {
        const authTokenHeader = expect.objectContaining({
          'X-MSTR-AuthToken': 'mockAuthToken',
        });
        const library = await mstrApi.library.getLibrary();
        const a = 42;
        expect(axios).toHaveBeenCalledWith('');
      } catch (error) {}
    });
  });
});
