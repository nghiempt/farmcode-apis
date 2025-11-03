const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllAccounts() {
  const accounts = await iattModel.account.find({});
  return accounts
    .filter(account => !account.deleted_at);
}

async function getAccountByEmail(data) {
    return iattModel.account.findOne({ email: data.email });
}

async function getAccountByPhone(data) {
    return iattModel.account.findOne({ phone: data.phone });
}

async function createAccount(data) {
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
    const account = await iattModel.account.findOne({ _id: new ObjectId(id) });
    if (!account) {
        return { message: 'Tài khoản không tồn tại' };
    }
    if (account.password !== oldPassword) {
        return { message: 'Mật khẩu cũ không đúng' };
    }
    return iattModel.account.updateOne({ _id: new ObjectId(id) }, { password: newPassword });
}

module.exports = {
    getAllAccounts,
    getAccountByEmail,
    createAccount,
    getAccount,
    updateProfile,
    getAccountByPhone,
    changePassword
};
