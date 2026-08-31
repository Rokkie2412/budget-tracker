const { createRequestHandler } = require('@expo/server/adapter/netlify');

module.exports = createRequestHandler({
  build: require('path').join(__dirname, '../../dist/server'),
});
