module.exports = (offset, limit, fields) => {
  const queryParameters = {};
  if (offset) {
    queryParameters.offset = offset;
  }
  if (limit) {
    queryParameters.limit = limit;
  }
  if (fields) {
    queryParameters.fields = fields;
  }
  return queryParameters; 
}