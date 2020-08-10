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

  describe('publishObject()', () => {
    it('should always use POST', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const publishInfo = {}
      const projectID = 'fakeProjectID';

      const library = mstrApi.library.publishObject(publishInfo, projectID);
      const requestOptions = expect.objectContaining({ method: 'POST' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const publishInfo = { fakePublishInfo: 'fakePublishInfoValue' }
      const projectID = 'fakeProjectID';

      const library = mstrApi.library.publishObject(publishInfo, projectID);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('/api/library')
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const fakeAuthToken = 'someAuthToken';

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(fakeAuthToken);

      const publishInfo = {}
      const projectID = 'fakeProjectID';

      const library = mstrApi.library.publishObject(publishInfo, projectID);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': fakeAuthToken
        })
      });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct object info', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const publishInfo = { fakePublishInfo: 'fakePublishInfoData' }
      const projectID = 'fakeProjectID';

      const library = await mstrApi.library.publishObject(publishInfo, projectID);

      requestOptions = expect.objectContaining({
        data: publishInfo
      })

      expect(axios).toHaveBeenCalledWith(requestOptions)
    })
  })

  describe('getObject()', () => {
    it('Should always use POST', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectID = 'fakeProjectID';
      const fields = 'fakeField01,fakeField02';


      const library = mstrApi.library.getObject(objectId, projectID, fields);
      const requestOptions = expect.objectContaining({ method: 'GET' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectID = 'fakeProjectID';
      const fields = 'fakeField01,fakeField02';

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${objectId}`)
      });

      mstrApi.library.getObject(objectId, projectID, fields);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const fakeAuthToken = 'someAuthToken';

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(fakeAuthToken);

      const objectId = 'fakeObjectId';
      const projectID = 'fakeProjectID';
      const fields = 'fakeField01,fakeField02';

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': fakeAuthToken
        })
      });

      mstrApi.library.getObject(objectId, projectID, fields);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct fields in query parameters', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectId = 'fakeProjectId';
      const fields = 'fakeField01,fakeField02';

      const separateFields = fields.split(',');
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`fields=${separateFields[0]}%2C${separateFields[1]}`)
      });

      mstrApi.library.getObject(objectId, projectId, fields);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })
  })

  describe('deleteObject()', () => {
    it('Should always use DELETE', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectID = 'fakeProjectID';

      const library = mstrApi.library.deleteObject(objectId, projectID);
      const requestOptions = expect.objectContaining({ method: 'DELETE' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectId = 'fakeProjectID';

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${objectId}`)
      });

      mstrApi.library.getObject(objectId, projectId);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const fakeAuthToken = 'someAuthToken';

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(fakeAuthToken);

      const objectId = 'fakeObjectId';
      const projectID = 'fakeProjectID';

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': fakeAuthToken
        })
      });

      mstrApi.library.deleteObject(objectId, projectID);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const projectId = 'fakeProjectID';

      // Setting project ID as a request header.
      mstrApi.setProjectId(projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': projectId
        })
      });

      mstrApi.library.deleteObject(objectId, projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })

  describe('deleteUserObject()', () => {
    it('Should always use DELETE', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const userId = 'fakeUserId';
      const projectID = 'fakeProjectId';

      const library = mstrApi.library.deleteUserObject(objectId, userId, projectID);
      const requestOptions = expect.objectContaining({ method: 'DELETE' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const userId = 'fakeUserId';
      const projectId = 'fakeProjectID';

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${objectId}/recipients/${userId}`)
      });

      mstrApi.library.deleteUserObject(objectId, userId, projectId);
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const fakeAuthToken = 'someAuthToken';

      // either call login API via module to store token, or manually provide a token to store
      const mstrApi = new mstr.REST(sharedRestOptions);
      mstrApi.setAuthToken(fakeAuthToken);

      const objectId = 'fakeObjectId';
      const userId = 'fakeUserId'
      const projectID = 'fakeProjectID';

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': fakeAuthToken
        })
      });

      mstrApi.library.deleteUserObject(objectId, userId, projectID);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      const mstrApi = new mstr.REST(sharedRestOptions);

      const objectId = 'fakeObjectId';
      const userId = 'fakeUserId';
      const projectId = 'fakeProjectID';

      // Setting project ID as a request header.
      mstrApi.setProjectId(projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': projectId
        })
      });

      mstrApi.library.deleteUserObject(objectId, userId, projectId);

      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })
});
