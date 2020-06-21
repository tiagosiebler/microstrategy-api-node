const RestTopic = require('../../lib/restAPIs/library');
const RestUtil = require('../../lib/util/RestUtil');
const mockedAxios = require('axios');

jest.mock('../../lib/util/RestUtil');
jest.mock('axios');

describe('Library endpoints (RestTopic = Library', () => {
  test('library.getProjectHeader has been called', async () => {
    const library = new RestTopic();
    const result = library.getObject();
    await expect(library.getProjectHeader).toHaveBeenCalled();
  });

  // test('Axios request should have been called', async () => {
  //   const library = new RestTopic();

  //   mockedAxios.get.mockImplementationOnce(() => Promise.resolve('hola'));
  //   console.log('siete');
  //   await expect(mockedAxios.get).toHaveBeenCalled();
  //   console.log('ocho');
  // });
});
