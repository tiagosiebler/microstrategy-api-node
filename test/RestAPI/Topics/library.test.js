const mstr = require('../../../lib/mstr');
const axios = require('axios');

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
  publishInfo: { fakePublishInfo: 'fakePublishInfoData' }
}

const mstrApi = new mstr.REST(sharedRestOptions);
mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

describe('RESTAPI -> Library', () => {

  describe('getLibrary()', () => {

    let library;
    beforeEach(() => {
      library = mstrApi.library.getLibrary();
    })

    it('Should always use GET', async () => {
      const requestOptions = expect.objectContaining({ method: 'GET' });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should always direct to the correct endpoint', async () => {
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('/api/library')
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Correctly passes outputFlag parameter, if defined', () => {
      const exampleFlag = 'customOutputFlag';
      library = mstrApi.library.getLibrary(exampleFlag);

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('outputFlag=' + exampleFlag)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  });

  describe('publishObject()', () => {

    let requestAction;
    beforeEach(() => {
      requestAction = mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);
    })

    it('should always use POST', async () => {
      const requestOptions = expect.objectContaining({ method: 'POST' });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching('/api/library')
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct object info', async () => {
      requestOptions = expect.objectContaining({
        data: sharedInputInfo.publishInfo
      })
      expect(axios).toHaveBeenCalledWith(requestOptions)
    })
  })

  describe('getObject()', () => {

    let requestAction;
    beforeEach(() => {
      requestAction = mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);
    })

    it('Should always use POST', async () => {
      const requestOptions = expect.objectContaining({ method: 'GET' });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should send the correct fields in query parameters', async () => {
      const separateFields = sharedInputInfo.fields.split(',');

      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`fields=${separateFields[0]}%2C${separateFields[1]}`)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })
  })

  describe('deleteObject()', () => {

    let requestAction;
    beforeEach(() => {
      requestAction = mstrApi.library.deleteObject(sharedInputInfo.objectId, sharedInputInfo.projectId);
    })

    it('Should always use DELETE', async () => {
      const requestOptions = expect.objectContaining({ method: 'DELETE' });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      mstrApi.setProjectId(sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })

  describe('deleteUserObject()', () => {

    let requestAction;
    beforeEach(() => {
      requestAction = mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);
    })

    it('Should always use DELETE', async () => {
      const requestOptions = expect.objectContaining({ method: 'DELETE' });

      expect(axios).toHaveBeenCalledWith(requestOptions);
    })

    it('Should always direct to the correct endpoint', async () => {
      const requestOptions = expect.objectContaining({
        url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}/recipients/${sharedInputInfo.userId}`)
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Automatically includes auth-token, if module already has a token stored', () => {
      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });

    it('Should have been called with the correct project id header', () => {
      mstrApi.setProjectId(sharedInputInfo.projectId);

      const requestOptions = expect.objectContaining({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      });
      expect(axios).toHaveBeenCalledWith(requestOptions);
    });
  })
});
