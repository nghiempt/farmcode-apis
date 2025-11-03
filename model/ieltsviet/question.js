const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietQuestionCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietQuestionCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietQuestionCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietQuestionCol().updateOne(query, data );
}

async function findQuestionWithPagination(
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
    .ieltsvietQuestionCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietQuestionCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findQuestionWithPagination,
  countDocument,
};
