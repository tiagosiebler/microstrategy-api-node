const RestTopic = require('../../lib/restAPIs/library');
const RestUtil = require('../../lib/util/RestUtil');
const buildCommonQuery = require('../../lib/util/buildCommonQueryParams');

jest.mock('../../lib/util/RestUtil');
jest.mock('../../lib/util/buildCommonQueryParams');
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Testing library wrapper', () => {
  describe('Testing getObject() method', () => {
    test('RestUtil constructor has been called', () => {
      const library = new RestTopic();
      expect(RestUtil).toHaveBeenCalledTimes(1);
    });

    test('RestUtil getProjectHeader method has been called', async () => {
      const library = new RestTopic();
      const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
      const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
      const object = await library.getObject(objectId, projectId);

      expect(object).toBe('hola');
    });
  });
});
