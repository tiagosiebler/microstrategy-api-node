const mstr = require('../../../lib/mstr');
const axios = require('axios');
const buildCommonQueryParams = require('../../../lib/util/buildCommonQueryParams');

jest.mock('axios', () => jest.fn(() => Promise.resolve({})));

const testUrl = 'http://fakehost/fakeurl/api';
const sharedRestOptions = {
  baseUrl: testUrl,
  skipValidateResponseStatusCode: true,//skip response validation/handling, since we're not interested in server response here
  skipThrowOnHTTPException: true
};

const sharedInputInfo = {
  fakeAuthToken: 'someAuthToken',
  projectId: 'fakeProjectID',
  objectId: 'fakeObjectId',
  fields: 'fakeField01,fakeField02',
  userId: 'fakeUserId',
  publishInfo: {}
}

// const fakeAuthToken = 'someAuthToken';
// const projectId = 'fakeProjectID';
// const objectId = 'fakeObjectId';
// const fields = 'fakeField01,fakeField02';
// const userId = 'fakeUserId';
// const publishInfo = {};


describe('RESTAPI -> Library', () => {

  describe('getLibrary()', () => {
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

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

      const library = mstrApi.library.getLibrary();

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  });

  describe('publishObject()', () => {
    it('should always use POST', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const library = mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);
      const requestOptions = expect.objectContaining({ method: 'POST' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const library = mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('/api/library')
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

      const library = mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct object info', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      //Adding some content to publishInfo test var
      const publishInfo = { fakePublishInfo: 'fakePublishInfoData' }

      const library = await mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);

      requestOptions = expect.objectContaining({
        data: sharedInputInfo.publishInfo
      })

      expect(axios).toHaveBeenCalledWith(requestOptions)
    })
  })

  describe('getObject()', () => {
    it('Should always use POST', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const library = mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);
      const requestOptions = expect.objectContaining({ method: 'GET' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
      });

      mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });

      mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct fields in query parameters', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const separateFields = sharedInputInfo.fields.split(',');
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`fields=${separateFields[0]}%2C${separateFields[1]}`)
      });

      mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })
  })

  describe('deleteObject()', () => {
    it('Should always use DELETE', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const library = mstrApi.library.deleteObject(sharedInputInfo.objectId, sharedInputInfo.projectId);
      const requestOptions = expect.objectContaining({ method: 'DELETE' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
      });

      mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });

      mstrApi.library.deleteObject(sharedInputInfo.objectId, sharedInputInfo.projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      // Setting project ID as a request header.
      mstrApi.setProjectId(sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      });

      mstrApi.library.deleteObject(sharedInputInfo.objectId, sharedInputInfo.projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })

  describe('deleteUserObject()', () => {
    it('Should always use DELETE', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const library = mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);
      const requestOptions = expect.objectContaining({ method: 'DELETE' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}/recipients/${sharedInputInfo.userId}`)
      });

      mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });

      mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      // Setting project ID as a request header.
      mstrApi.setProjectId(sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      });

      mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })
});
