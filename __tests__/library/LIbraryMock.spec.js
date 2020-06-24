const RestTopic = require('../../lib/restAPIs/library');
const RestUtil = require('../../lib/util/RestUtil');

//jest.mock('../../lib/util/RestUtil');

beforeEach(() => {
  RestUtil.mockClear();
});

describe('Testing library wrapper', () => {
  describe('Testing getObject() method', () => {
    test('RestUtil constructor has been called', () => {
      const library = new RestTopic();
      expect(RestUtil).toHaveBeenCalledTimes(1);
    });

    test('RestUtil getProjectHeader method has been called', async () => {
      const library = new RestTopic();
      const object = await library.getObject();
      const mockCall = jest.spyOn(RestUtil, 'getProjectHeader');
      expect(mockCall).toHaveBeenCalledTimes(1);
    });
  });
});
