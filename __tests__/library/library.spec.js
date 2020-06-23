const RestTopic = require('../../lib/restAPIs/library');
const RestUtil = require('../../lib/util/RestUtil');

jest.mock('../../lib/util/RestUtil');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Library endpoints (RestTopic = Library', () => {
  // it.skip('has been called once', () => {
  //   const library = new RestTopic(axios);
  //   expect(axios).toHaveBeenCalled();
  // });
  it.skip('RestUtil getProject mock have been called', () => {
    const library = new RestTopic();
    const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
    const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
    const result = library.getObject(objectId, projectId);
    expect(library.getProjectHeader).toHaveBeenCalled();
  });

  // it('RestUtil getProject mock should be Hola', () => {
  //   const library = new RestTopic();
  //   const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  //   console.log(.getProjectHeader(projectId));
  //   expect(library.getProjectHeader(projectId)).toEqual('Hola');
  // });
  // it('RestUtil _makeRequest mock have been called', async () => {
  //   const library = new RestTopic();
  //   const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
  //   const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
  //   const result = await library.getObject(objectId, projectId);
  //   expect(library._makeRequest).toHaveBeenCalled();
  // });
});
