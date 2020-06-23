const RestTopic = require('../../lib/restAPIs/library');
const RestUtil = require('../../lib/util/RestUtil');
const axios = require('axios');
//jest.mock('../../lib/util/RestUtil');
jest.mock('axios');

describe('testing whole scenario', () => {
  // it('Should instantiate mstr object', () => {
  //   async () => {
  //     const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';
  //     const mstrApi = new mstr.REST({
  //       baseUrl: baseUrl,
  //     });

  //     await mstrApi.login({
  //       username: 'Administrator',
  //       password: '',
  //       loginMode: 1,
  //     });

  //     // MicroStrategy Tutorial
  //     const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  //     mstrApi.setProjectId(projectId);

  //     //Document id:
  //     const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';

  //     //Fields to retrieve
  //     //const fields = 'id,elements';
  //     const libraryAPI = mstrApi.library;

  //     //Test
  //     const objectResult = await libraryAPI.getObject(objectId, projectId);
  //     expect(axios).toHaveBeenCalled();
  //   };
  // });

  it('should have been called with', () => {
    async () => {
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

      //Test
      const objectResult = await libraryAPI.getObject(objectId, projectId);
      expect(axios.post).toHaveBeenCalledWith({
        'X-MSTR-ProjectID': 'B19DEDCC11D4E0EFC000EB9495D0F44F',
      });
    };
  });
});
