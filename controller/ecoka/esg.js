
const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ecokaService } = require("~/service");
const { ecokaValidation } = require('~/validation');
async function getAllEsgs(request, reply) {
  try {
    const data = await ecokaService.esg.getAllEsgs()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateEsg(request, reply) {
  try {
    const { id } = request.params
    const body  = request.body
    // ecokaValidation.validate(body, ecokaValidation.esgSchema.UpdateEsgSchema, reply);
    const data = await ecokaService.esg.updateEsg(id, body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


module.exports = {
  getAllEsgs,
  updateEsg,
};
