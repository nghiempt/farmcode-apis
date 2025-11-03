const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietTestcollectionCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietTestcollectionCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietTestcollectionCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietTestcollectionCol().updateOne(query, data );
}

async function findTestcollectionWithPagination(
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
    .ieltsvietTestcollectionCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietTestcollectionCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findTestcollectionWithPagination,
  countDocument,
};
