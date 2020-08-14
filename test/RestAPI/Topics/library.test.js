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

function assetHTTPRequestRequirement(requirement) {

  const requestOptions = expect.objectContaining(requirement);
  expect(axios).toHaveBeenCalledWith(requestOptions);
}

function assetHTTPRequestRequirements(requirements) {
  for (const { name, requirement } of requirements) {
    it(name, () => {
      assetHTTPRequestRequirement(requirement);
    })
  }
}

describe('RESTAPI -> Library', () => {

  const mstrApi = new mstr.REST(sharedRestOptions);
  mstrApi.setAuthToken(sharedInputInfo.fakeAuthToken);

  beforeEach(() => {
    mstrApi.library.getLibrary();
  })
  it('Automatically includes auth-token, if module already has a token stored', () => {
    assetHTTPRequestRequirement({
      headers: expect.objectContaining({
        'X-MSTR-AuthToken': sharedInputInfo.fakeAuthToken
      })
    });
  })

  describe('getLibrary()', () => {

    const requirements = [
      {
        name: 'Should always use correct method',
        requirement: { method: 'GET' }
      },
      {
        name: 'Should always direct to the correct endpoint',
        requirement: { url: expect.stringMatching('/api/library') }
      },
    ];

    assetHTTPRequestRequirements(requirements);

    it('Corectly passes outputFlag parameter, if defined', () => {
      const exampleFlag = 'customOutputFlag';
      mstrApi.library.getLibrary(exampleFlag);
      assetHTTPRequestRequirement({
        url: expect.stringMatching('outputFlag=' + exampleFlag)
      })
    })

  });

  describe('publishObject()', () => {

    beforeEach(() => {
      mstrApi.library.publishObject(sharedInputInfo.publishInfo, sharedInputInfo.projectId);
    })

    const requirements = [
      {
        name: 'Should always use correct method',
        requirement: { method: 'POST' }
      },
      {
        name: 'Should always direct to the correct endpoint',
        requirement: {
          url: expect.stringMatching('/api/library')
        }
      },
      {
        name: 'Should send the correct object info',
        requirement: {
          data: sharedInputInfo.publishInfo
        }
      },
    ];

    assetHTTPRequestRequirements(requirements);

  })

  describe('getObject()', () => {

    beforeEach(() => {
      mstrApi.library.getObject(sharedInputInfo.objectId, sharedInputInfo.projectId, sharedInputInfo.fields);
    })

    const requirements = [
      {
        name: 'Should always use correct method',
        requirement: { method: 'GET' }
      },
      {
        name: 'Should always direct to the correct endpoint',
        requirement: {
          url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
        }
      },
    ];

    assetHTTPRequestRequirements(requirements);

    it('Should send the correct fields in query parameters', async () => {

      const separateFields = sharedInputInfo.fields.split(',');

      assetHTTPRequestRequirement({
        url: expect.stringMatching(`fields=${separateFields[0]}%2C${separateFields[1]}`)
      })

    })

  })

  describe('deleteObject()', () => {

    beforeEach(() => {
      mstrApi.library.deleteObject(sharedInputInfo.objectId, sharedInputInfo.projectId);
    })

    const requirements = [
      {
        name: 'Should always use correct method',
        requirement: { method: 'DELETE' }
      },
      {
        name: 'Should always direct to the correct endpoint',
        requirement: {
          url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}`)
        }
      },
    ];

    assetHTTPRequestRequirements(requirements);

    it('Should have been called with the correct project id header', () => {
      mstrApi.setProjectId(sharedInputInfo.projectId);
      assetHTTPRequestRequirement({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      })
    });
  })

  describe('deleteUserObject()', () => {

    beforeEach(() => {
      mstrApi.library.deleteUserObject(sharedInputInfo.objectId, sharedInputInfo.userId, sharedInputInfo.projectId);
    })

    const requirements = [
      {
        name: 'Should always use correct method',
        requirement: { method: 'DELETE' }
      },
      {
        name: 'Should always direct to the correct endpoint',
        requirement: {
          url: expect.stringMatching(`/api/library/${sharedInputInfo.objectId}/recipients/${sharedInputInfo.userId}`)
        }
      },
    ];

    assetHTTPRequestRequirements(requirements);

    it('Should have been called with the correct project id header', () => {

      mstrApi.setProjectId(sharedInputInfo.projectId);

      assetHTTPRequestRequirement({
        headers: expect.objectContaining({
          'X-MSTR-ProjectID': sharedInputInfo.projectId
        })
      })

    });

  })

});
