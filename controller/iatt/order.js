const {
  statusCode,
  successMessage,
  failMessage,
} = require('~/common/message');
const { iattService } = require('~/service');
const { iattValidation } = require('~/validation');

async function getAllOrders(request, reply) {
  try {
    const data = await iattService.order.getAllOrders();
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getAllOrdersById(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.order.getAllOrdersById(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function getOrder(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.order.getOrder(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createTempAlbumOrder(request, reply) {
  try {
    const body = request.body;
    const data = await iattService.order.createTempAlbumOrder(body);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createOrder(request, reply) {
  try {
    const { account, order } = request.body;
    // const check1 = iattValidation.validate(order, iattValidation.OrderSchema.CreateOrderSchema, reply);
    // const check2 = iattValidation.validate(account, iattValidation.OrderSchema.AccountOrderSChema, reply);
    // if (check1 === false || check2 === false) {
    //   return reply.status(statusCode.badRequest).send({ message: failMessage.invalidData });
    // };
    const sdt = account.phone;
    if (sdt) {
      const checkPhone = await iattService.account.getAccountByPhone({
        phone: sdt,
      });
      if (checkPhone && checkPhone._id.toString() !== account._id) {
        return reply
          .status(statusCode.badRequest)
          .send({ message: failMessage.phoneExist });
      }
    }

    const data = await iattService.order.createOrder(account, order);
    if (data === 'invalidEmail') {
      return reply
        .status(statusCode.badRequest)
        .send({ message: failMessage.unvalidAccount });
    }
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
    console.log(err);
  }
}

async function createOrderWithoutLogin(request, reply) {
  try {
    const { account, order } = request.body;
    // const check1 = iattValidation.validate(order, iattValidation.OrderSchema.CreateOrderSchema, reply);
    // const check2 = iattValidation.validate(account, iattValidation.OrderSchema.AccountOrderSChema, reply);
    // if (check1 === false || check2 === false) {
    //   return reply.status(statusCode.badRequest).send({ message: failMessage.invalidData });
    // };
    const data = await iattService.order.createOrderWithoutLogin(
      account,
      order
    );
    if (data === 'invalidEmail') {
      return reply
        .status(statusCode.badRequest)
        .send({ message: failMessage.unvalidAccount });
    }
    console.log(data);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
    console.log(err);
  }
}

async function updateOrder(request, reply) {
  try {
    const { id } = request.params;
    const Order = request.body;
    // const check = iattValidation.validate(Order, iattValidation.OrderSchema.UpdateOrderSchema, reply);
    // if (check === false) {
    //   return reply.status(statusCode.badRequest).send({ message: failMessage.invalidData });
    // };
    const data = await iattService.order.updateOrder(id, Order);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function deleteOrder(request, reply) {
  try {
    const { id } = request.params;
    const data = await iattService.order.deleteOrder(id);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
  }
}

async function createOrderAlbum(request, reply) {
  try {
    const { account, order } = request.body;
    const sdt = account.phone;
    if (sdt) {
      const checkPhone = await iattService.account.getAccountByPhone({
        phone: sdt,
      });
      if (checkPhone && checkPhone._id.toString() !== account._id) {
        return reply
          .status(statusCode.badRequest)
          .send({ message: failMessage.phoneExist });
      }
    }

    const data = await iattService.order.createOrderAlbum(
      account,
      order
    );
    if (data === 'invalidEmail') {
      return reply
        .status(statusCode.badRequest)
        .send({ message: failMessage.unvalidAccount });
    }
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
    console.log(err);
  }
}

async function createOrderAlbumWithoutLogin(request, reply) {
  try {
    const { account, order } = request.body;
    const data = await iattService.order.createOrderAlbumWithoutLogin(
      account,
      order
    );
    if (data === 'invalidEmail') {
      return reply
        .status(statusCode.badRequest)
        .send({ message: failMessage.unvalidAccount });
    }
    console.log(data);
    return reply
      .status(statusCode.success)
      .send({ data: data, message: successMessage.index });
  } catch (err) {
    reply
      .status(statusCode.internalError)
      .send({ message: failMessage.internalError });
    console.log(err);
  }
}

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  createOrderAlbum,
  updateOrder,
  deleteOrder,
  getAllOrdersById,
  createOrderWithoutLogin,
  createOrderAlbumWithoutLogin,
  createTempAlbumOrder,
};
