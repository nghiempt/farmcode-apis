const { iattModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllAccounts() {
  const accounts = await iattModel.account.find({});
  return accounts.filter((account) => !account.deleted_at);
}

async function getAccountByEmail(data) {
  const accountEmail = await iattModel.account.find({
    email: data.email,
    role: 'personal',
  });

  if (accountEmail && accountEmail.length > 1) {
    const activeAccount = accountEmail.find(
      (account) => !account.deleted_at
    );
    return activeAccount || { message: 'Account deleted' };
  }

  if (accountEmail && accountEmail.length === 1) {
    const account = accountEmail[0];
    if (account.deleted_at) {
      return { message: 'Account deleted' };
    }
    return account;
  }

  return accountEmail;
}

async function getAccountByPhone(data) {
  const accountPhone = await iattModel.account.find({
    phone: data.phone,
    role: 'personal',
  });

  if (accountPhone && accountPhone.length > 1) {
    const activeAccount = accountPhone.find(
      (account) => !account.deleted_at
    );

    return activeAccount || { message: 'Account deleted' };
  }

  if (accountPhone && accountPhone.length === 1) {
    const account = accountPhone[0];
    if (account.deleted_at) {
      return { message: 'Account deleted' };
    }
    return account;
  }

  return accountPhone;
}

async function getAccountByEmailAdmin(data) {
  return iattModel.account.findOne({
    email: data.email,
    role: 'admin',
  });
}

async function getAccountByPhoneAdmin(data) {
  return iattModel.account.findOne({
    phone: data.phone,
    role: 'admin',
  });
}

async function createAccount(data) {
  if (data.phone) {
    const existingAccount = await iattModel.account.find({
      phone: data.phone,
    });

    if (existingAccount && existingAccount.length > 0) {
      const allDeleted = existingAccount.every(
        (account) => account.deleted_at
      );

      if (allDeleted) {
        return await iattModel.account.insertOne(data);
      } else {
        return { error: 'Phone number are in used' };
      }
    }
  }

  return await iattModel.account.insertOne(data);
}

async function getAccount(id) {
  return iattModel.account.findOne({ _id: new ObjectId(id) });
}

async function updateProfile(id, data) {
  return iattModel.account.updateOne({ _id: new ObjectId(id) }, data);
}

async function changePassword(id, data) {
  const oldPassword = data.oldPassword;
  const newPassword = data.newPassword;
  const account = await iattModel.account.findOne({
    _id: new ObjectId(id),
  });
  if (!account) {
    return { message: 'Tài khoản không tồn tại' };
  }
  if (account.password !== oldPassword) {
    return { message: 'Mật khẩu cũ không đúng' };
  }
  return iattModel.account.updateOne(
    { _id: new ObjectId(id) },
    { password: newPassword }
  );
}

async function deleteAccount(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };

  return await iattModel.account.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllAccounts,
  getAccountByEmail,
  getAccountByEmailAdmin,
  createAccount,
  getAccount,
  updateProfile,
  getAccountByPhone,
  getAccountByPhoneAdmin,
  changePassword,
  deleteAccount,
};
