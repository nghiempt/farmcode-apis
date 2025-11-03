const { ecokaModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllEnterprises() {
  const enterprises = await ecokaModel.enterprise.find({});
    return enterprises
      .filter(enterprise => !enterprise.deleted_at);
}

async function updateEnterprise(id, data) {
  return ecokaModel.enterprise.updateOne({ _id: new ObjectId(id) }, data);
}

module.exports = {
  getAllEnterprises,
  updateEnterprise,
};
