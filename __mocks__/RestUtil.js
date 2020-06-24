module.exports = class RestUtil {
  constructor() {
    console.log('This is the constructor mock');
  }

  getProjectHeader() {
    return 'hola';
  }

  _makeRequest() {
    return 'makeRequest_response';
  }

  throwIfFailed() {
    return { data: 'hola' };
  }
};
