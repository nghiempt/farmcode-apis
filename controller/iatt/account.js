const { statusCode, successMessage, failMessage } = require('~/common/message');
const { iattService } = require("~/service");
const { iattValidation } = require('~/validation');

async function getAllAccounts(request, reply) {
  try {
    const data = await iattService.account.getAllAccounts()
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function getAccount(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.account.getAccount(id)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function updateProfile(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body
    const sdt = body.phone
    if(sdt){
      const checkPhone = await iattService.account.getAccountByPhone({phone: sdt})
      if(checkPhone && checkPhone._id.toString() !== id){
        return reply.status(statusCode.badRequest).send({ message: failMessage.phoneExist });
      }
    }
    const data = await iattService.account.updateProfile(id, body)
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

async function changePassword(request, reply) {
  try {
    const { id } = request.params;
    const body = request.body
    const data = await iattService.account.changePassword(id, body)
    if(data.message){
      return reply.status(statusCode.badRequest).send({ message: data.message });
    }
    return reply.status(statusCode.success).send({ data: data, message: successMessage.index });
  } catch (err) {
    reply.status(statusCode.internalError).send({ message: failMessage.internalError });
  }
}

module.exports = {
  getAllAccounts,
  getAccount,
  updateProfile,
  changePassword
};
