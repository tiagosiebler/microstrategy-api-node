const RestTopic = require('../../lib/restAPIs/library');
//jest.mock('../../lib/restAPIs/library');

describe.skip('Library API tests', () => {
  describe('_getBase()', () => {
    test('it should return library as topic', () => {
      const library = new RestTopic();
      const output = 'library';
      expect(library._getBase()).toEqual(output);
    });
  });
  describe('getObject()', () => {
    test('it should return valid JSON for object', () => {
      const library = new RestTopic();
      const projectId = 'B19DEDCC11D4E0EFC000EB9495D0F44F';
      const objectId = 'C866FC0B417F8BD4DBBC07BE57C83413';
      const response = {
        id: 'C866FC0B417F8BD4DBBC07BE57C83413',
        recipients: [
          {
            description: '',
            name: 'Administrator',
            subtype: 8704,
            id: '54F3D26011D2896560009A8E67019608',
          },
        ],
      };

      expect(library.getObject(objectId, projectId)).toBe(response);
    });
  });
});
