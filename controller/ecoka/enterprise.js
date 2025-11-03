
const { statusCode, successMessage, failMessage } = require('~/common/message');
const { ecokaService } = require("~/service");
const { ecokaValidation } = require('~/validation');
async function getAllEnterprises(request, reply) {
  try {
    const data = await ecokaService.enterprise.getAllEnterprises()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateEnterprise(request, reply) {
  try {
    const { id } = request.params
    const body  = request.body
    // ecokaValidation.validate(body, ecokaValidation.EnterpriseSchema.UpdateEnterpriseSchema, reply);
    const data = await ecokaService.enterprise.updateEnterprise(id, body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}


module.exports = {
  getAllEnterprises,
  updateEnterprise,
};
