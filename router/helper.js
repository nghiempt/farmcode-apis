const { helperController } = require('~/controller');

function helperRoute(fastify, options, done) {
  fastify.get('/address/', helperController.address.getAllAddresses);
  done();
}

module.exports = helperRoute;
