const RestTopic = require('../../lib/restAPIs/library');
const mstr = require('../../lib/mstr');
//const RestUtil = require('../../lib/util/RestUtil');
//const buildCommonQuery = require('../../lib/util/buildCommonQueryParams');

describe('Testing library wrapper', () => {
  describe('Testing getObject() method', () => {
    test('RestUtil constructor has been called', async () => {
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
      const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
      mstrApi.setProjectId(projectId);
      //Document id:
      const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';

      //Fields to retrieve
      //const fields = 'id,elements';
      const libraryAPI = mstrApi.library;
      try {
        objectResult = await libraryAPI.getObject(
          objectId,
          projectId
          //fields
        );
        console.log(
          'Finished getting object: ',
          JSON.stringify(objectResult, null, 2)
        );
      } catch (e) {
        console.error(e);
      }
      await expect(objectResult.id).toBe(objectId);
    });

    // test('RestUtil getProjectHeader method has been called', async () => {
    //   const library = new RestTopic();
    //   const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
    //   const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    //   const object = await library.getObject(objectId, projectId);

    //   expect(object).toBe('hola');
    // });
  });
});
