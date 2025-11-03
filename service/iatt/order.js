const { iattModel } = require('~/model');
const payment = require('~/service/iatt/payment');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs');

async function getAllOrders() {
  const orders = await iattModel.order.find({});
  return orders.filter((order) => !order.deleted_at);
}

async function getAllOrdersById(id) {
  const orders = await iattModel.order.find({
    account_id: new ObjectId(id),
  });
  const user = await iattModel.account.findOne({
    _id: new ObjectId(id),
  });
  const user_orders = [];
  for (let i = 0; i < orders.length; i++) {
    user_orders.push({
      ...orders[i],
      phone: user.phone,
    });
  }
  return user_orders.filter((order) => !order.deleted_at);
}

async function getOrder(id) {
  return iattModel.order.findOne({ _id: new ObjectId(id) });
}

async function updateOrder(id, data) {
  const order = await iattModel.order.findOne({
    _id: new ObjectId(id),
  });
  if (order.status === 'completed') {
    delete data.status;
  }
  if (data.status === 'completed') {
    data.date_completed = new Date();
  }
  return iattModel.order.updateOne({ _id: new ObjectId(id) }, data);
}

async function createOrder(account, order) {
  const { _id, ...accountData } = account;
  await iattModel.account.updateOne(
    { _id: new ObjectId(account._id) },
    accountData
  );
  const ans = await iattModel.product.findOne({
    _id: new ObjectId(order.product_id),
  });
  let data_input = {};
  if (order.payment_method === 'cash') {
    data_input = {
      product_id: order.product_id,
      account_id: new ObjectId(account._id),
      order_type: order.order_type,
      image: order.image,
      color: order.color,
      size: order.size,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'waiting',
      date_completed: '',
      product_name: ans.name,
      product_price: ans.category,
    };
  } else {
    data_input = {
      product_id: order.product_id,
      account_id: new ObjectId(account._id),
      order_type: order.order_type,
      image: order.image,
      color: order.color,
      size: order.size,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'paid pending',
      date_completed: '',
      product_name: ans.name,
      product_price: ans.category,
    };
  }
  const product = await iattModel.product.findOne({
    _id: new ObjectId(order.product_id),
  });
  await iattModel.product.updateOne(
    { _id: new ObjectId(order.product_id) },
    { sold: Number(product.sold) + 1 }
  );
  const customer = await iattModel.account.findOne({
    _id: new ObjectId(account._id),
  });
  await iattModel.account.updateOne(
    { _id: new ObjectId(account._id) },
    { number_orders: Number(customer.number_orders) + 1 }
  );
  const result = await iattModel.order.insertOne(data_input);
  const payment_data = {
    order_id: result.insertedId,
    order_total: order.total,
  };
  const payUrl = await payment.momo(payment_data);
  return payUrl;
}

async function createOrderWithoutLogin(account, order) {
  let user = await iattModel.account.findOne({
    phone: account.phone,
  });
  const ans = await iattModel.product.findOne({
    _id: new ObjectId(order.product_id),
  });
  let user_id = '';
  let isAccountExisted = true;
  if (!user) {
    const dataAccount = {
      email: '',
      // password: crypto.randomBytes(8).toString('hex'),
      password: account.name + '123',
      name: account.name,
      status: true,
      phone: account.phone,
      role: 'personal',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT18iwsdCCbBfpa50-5BmNa_m_BX087_x1oWQ&s',
      address: account.address,
      ward: account.ward,
      district: account.district,
      province: account.province,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
    };
    isAccountExisted = false;
    user = await iattModel.account.insertOne(dataAccount);
    user_id = user.insertedId;
  } else {
    await iattModel.account.updateOne(
      { _id: new ObjectId(user._id) },
      account
    );
    user_id = user._id;
  }
  let data_input = {};
  if (order.payment_method === 'cash') {
    data_input = {
      product_id: order.product_id,
      account_id: user_id,
      order_type: order.order_type,
      image: order.image,
      color: order.color,
      size: order.size,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'waiting',
      date_completed: '',
      product_name: ans.name,
      product_price: ans.category,
    };
  } else {
    data_input = {
      product_id: order.product_id,
      account_id: user_id,
      order_type: order.order_type,
      image: order.image,
      color: order.color,
      size: order.size,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'paid pending',
      date_completed: '',
      product_name: ans.name,
      product_price: ans.category,
    };
  }
  const product = await iattModel.product.findOne({
    _id: new ObjectId(order.product_id),
  });
  await iattModel.product.updateOne(
    { _id: new ObjectId(order.product_id) },
    { sold: Number(product.sold) + 1 }
  );
  const customer = await iattModel.account.findOne({
    _id: new ObjectId(user_id),
  });
  await iattModel.account.updateOne(
    { _id: new ObjectId(user_id) },
    { number_orders: Number(customer.number_orders) + 1 }
  );
  const result = await iattModel.order.insertOne(data_input);
  const payment_data = {
    order_id: result.insertedId,
    order_total: order.total,
  };
  if (order.payment_method === 'cash') {
    if (customer.email == '') {
      return {
        user_id: user_id,
        phone: customer.phone,
        password: customer.password,
        isAccountExisted: isAccountExisted,
      };
    } else {
      return {
        user_id: user_id,
        email: customer.email,
        password: customer.password,
        isAccountExisted: isAccountExisted,
      };
    }
  } else {
    const payUrl = await payment.momo(payment_data);
    if (customer.email == '') {
      return {
        user_id: user_id,
        phone: customer.phone,
        password: customer.password,
        payUrl: payUrl,
        isAccountExisted,
      };
    } else {
      return {
        user_id: user_id,
        email: customer.email,
        password: customer.password,
        payUrl: payUrl,
        isAccountExisted,
      };
    }
  }
}

async function deleteOrder(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  const order = await iattModel.order.findOne({
    _id: new ObjectId(id),
  });
  const customer = await iattModel.account.findOne({
    _id: new ObjectId(order.account_id),
  });
  await iattModel.account.updateOne(
    { _id: new ObjectId(order.account_id) },
    { number_orders: Number(customer.number_orders) - 1 }
  );
  return iattModel.order.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function createTempAlbumOrder(data) {
  const data_input = {
    order_type: '',
    cover_image: '',
    size: data.size,
    pages: data.pages,
    album_data: data.album_data,
    album_cover: '',
    album_core: '',
    districtName: '',
    provinceName: '',
    wardName: '',
    address: '',
    payment_method: '',
    discount_code: '',
    discount_price: '',
    total: '',
    status: '',
    date_completed: '',
    album_price: '',
  };
  const new_order = await iattModel.order.insertOne(data_input);
  return { order_id: new_order.insertedId };
}

async function createOrderAlbum(account, order) {
  const { _id, ...accountData } = account;
  await iattModel.account.updateOne(
    { _id: new ObjectId(account._id) },
    accountData
  );
  let data_input = {};
  if (order.payment_method === 'cash') {
    data_input = {
      account_id: new ObjectId(account._id),
      order_type: order.order_type,
      cover_image: order.cover_image,
      album_cover: order.album_cover,
      album_core: order.album_core,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'waiting',
      date_completed: '',
      album_price: order.album_price,
    };
  } else {
    data_input = {
      account_id: new ObjectId(account._id),
      order_type: order.order_type,
      cover_image: order.cover_image,
      album_cover: order.album_cover,
      album_core: order.album_core,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'paid pending',
      date_completed: '',
      album_price: order.album_price,
    };
  }
  const customer = await iattModel.account.findOne({
    _id: new ObjectId(account._id),
  });
  await iattModel.account.updateOne(
    { _id: new ObjectId(account._id) },
    { number_orders: Number(customer.number_orders) + 1 }
  );
  const result = await iattModel.order.updateOne(
    { _id: new ObjectId(order.order_id) },
    data_input
  );
  const payment_data = {
    order_id: order.order_id,
    order_total: order.total,
  };
  const payUrl = await payment.momo(payment_data);
  return payUrl;
}

async function createOrderAlbumWithoutLogin(account, order) {
  let user = await iattModel.account.findOne({
    phone: account.phone,
  });
  let user_id = '';
  let isAccountExisted = true;
  if (!user) {
    const dataAccount = {
      email: '',
      password: account.name + '123',
      name: account.name,
      status: true,
      phone: account.phone,
      role: 'personal',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT18iwsdCCbBfpa50-5BmNa_m_BX087_x1oWQ&s',
      address: account.address,
      ward: account.ward,
      district: account.district,
      province: account.province,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
    };
    isAccountExisted = false;
    user = await iattModel.account.insertOne(dataAccount);
    user_id = user.insertedId;
  } else {
    await iattModel.account.updateOne(
      { _id: new ObjectId(user._id) },
      account
    );
    user_id = user._id;
  }
  let data_input = {};
  if (order.payment_method === 'cash') {
    data_input = {
      account_id: user_id,
      order_type: order.order_type,
      cover_image: order.cover_image,
      album_cover: order.album_cover,
      album_core: order.album_core,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'waiting',
      date_completed: '',
      album_price: order.album_price,
    };
  } else {
    data_input = {
      account_id: user_id,
      order_type: order.order_type,
      cover_image: order.cover_image,
      album_cover: order.album_cover,
      album_core: order.album_core,
      districtName: account.districtName,
      provinceName: account.provinceName,
      wardName: account.wardName,
      address: order.address,
      payment_method: order.payment_method,
      discount_code: order.discount_code,
      discount_price: order.discount_price,
      total: order.total,
      status: 'paid pending',
      date_completed: '',
      album_price: order.album_price,
    };
  }
  const customer = await iattModel.account.findOne({
    _id: new ObjectId(user_id),
  });
  await iattModel.account.updateOne(
    { _id: new ObjectId(user_id) },
    { number_orders: Number(customer.number_orders) + 1 }
  );
  const result = await iattModel.order.updateOne(
    { _id: new ObjectId(order.order_id) },
    data_input
  );
  const payment_data = {
    order_id: order.order_id,
    order_total: order.total,
  };
  if (order.payment_method === 'cash') {
    if (customer.email == '') {
      return {
        user_id: user_id,
        phone: customer.phone,
        password: customer.password,
        isAccountExisted: isAccountExisted,
      };
    } else {
      return {
        user_id: user_id,
        email: customer.email,
        password: customer.password,
        isAccountExisted: isAccountExisted,
      };
    }
  } else {
    const payUrl = await payment.momo(payment_data);
    if (customer.email == '') {
      return {
        user_id: user_id,
        phone: customer.phone,
        password: customer.password,
        payUrl: payUrl,
        isAccountExisted,
      };
    } else {
      return {
        user_id: user_id,
        email: customer.email,
        password: customer.password,
        payUrl: payUrl,
        isAccountExisted,
      };
    }
  }
}

module.exports = {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersById,
  createOrderWithoutLogin,
  createOrderAlbum,
  createOrderAlbumWithoutLogin,
  createTempAlbumOrder,
};
