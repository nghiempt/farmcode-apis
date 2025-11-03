const { botBridgeController } = require('~/controller');

function botBridgeRoute(fastify, options, done) {
  fastify.post('/check', botBridgeController.check.handler);
  done();
}

module.exports = botBridgeRoute;
