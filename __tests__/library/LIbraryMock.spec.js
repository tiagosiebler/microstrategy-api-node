const RestTopic = require('../../lib/restAPIs/library');
const mstr = require('../../lib/mstr');
const RestUtil = require('../../lib/util/RestUtil');
const axios = require('axios');

//jest.mock('../../lib/util/RestUtil');
jest.mock('axios');

describe('Library endpoints (RestTopic = Library', () => {
  test('Axios mock is bein used.', async () => {
    const baseUrl = 'http://10.23.1.124:8080/MicroStrategyLibrary/api';

    const mstrApi = new mstr.REST({
      baseUrl: baseUrl,
    });
    expect(mstrApi.baseUrl).toBe(baseUrl);
    // await mstrApi.login({
    //   username: 'Administrator',
    //   password: '',
    //   loginMode: 1,
    // });

    // // MicroStrategy Tutorial
    // const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    // mstrApi.setProjectId(projectId);

    // //Document id:
    // const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
    // const data = {
    //   data: {
    //     objectId: objectId,
    //   },
    // };
    //expect(mstrApi.projectID).toBe(projectId);
    // axios.post.mockImplementationOnce(() => Promise.resolve(data));
    // const libraryAPI = mstrApi.library;
    // const objectResult = await libraryAPI.getObject(objectId, projectId);
    // await expect(axios).not.toHaveBeenCalled();
    //await expect(objectResult).resolves.toEqual('hola');
  });
});
