const mstr = require('../../lib/mstr');
const RestConnection = require('../../lib/util/RestConnection');
const buildCommonQuery = require('../../lib/util/buildCommonQueryParams');
//const axios = require('axios');

jest.mock('axios');

describe('Testing library wrapper', () => {
  describe('Testing getObject() method', () => {
    test('RestUtil constructor has been called', async () => {
      const projectId = ' B19DEDCC11D4E0EFC000EB9495D0F44F';
      const objectId = ' C866FC0B417F8BD4DBBC07BE57C83413';
      const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';
      const mstrApi = new mstr.REST({
        baseUrl: baseUrl,
      });
      await mstrApi.login({
        username: 'Administrator',
        password: '',
        loginMode: 1,
      });
      // MicroStrategy Tutorial

      mstrApi.setProjectId(projectId);
      const library = mstrApi.library;
      const object = await mstrApi.library.getObject(objectId, projectId);
      await expect(axios).toHaveBeenCalled();
    });
  });
});
