const database = require('~/database/connection');

async function find(query) {
  return database.ecokaEnterpriseCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ecokaEnterpriseCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ecokaEnterpriseCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ecokaEnterpriseCol().updateOne(query, { $set: data });
}

async function findEnterpriseWithPagination(
  query,
  paginate,
  { projection = { password: 0 } } = {}
) {
  const {
    sort = { created_at: -1 },
    skip = 0,
    parsedPageSize = 10,
  } = paginate;
  return await database
    .ecokaEnterpriseCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ecokaEnterpriseCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findEnterpriseWithPagination,
  countDocument,
};
