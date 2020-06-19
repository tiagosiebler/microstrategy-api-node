const RestUtil = require('../../lib/util/RestUtil');
const RestTopic = require('../../lib/restAPIs/library');

jest.mock('../../lib/util/RestUtil');
//jest.mock('../../lib/util/buildCommonQueryParams');

beforeEach(() => {
  RestTopic.mockClear();
});

describe('Library endpoints (RestTopic = Library', () => {
  it('has been called once', () => {
    const library = new RestTopic();
    expect(RestTopic).toHaveBeenCalledTimes(1);
  });

  it('returns valid json object', () => {
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

    const mocked_makeRequest = jest.fn();
    RestUtil.prototype._makeRequest = mocked_makeRequest;
    //mocked_makeRequest.mockReturnValue(Promise.resolve(response));

    //expect(library.getObject(objectId, projectId)).toBe(response);
    //return expect(mocked_makeRequest).toBe(response);
    library.getObject(objectId, projectId).then((data) => {
      expect(data).toBe(response);
    });
  });
});
