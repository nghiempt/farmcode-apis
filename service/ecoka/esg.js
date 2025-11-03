const { ecokaModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllEsgs() {
  const esgs = await ecokaModel.esg.find({});
    return esgs
      .filter(esg => !esg.deleted_at);
}

async function updateEsg(id, data) {
  return ecokaModel.esg.updateOne({ _id: new ObjectId(id) }, data);
}

module.exports = {
  getAllEsgs,
  updateEsg,
};
