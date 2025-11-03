const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietBlogCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietBlogCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietBlogCol().findOne(query);
}

async function updateOne(query, data) {
  return database.ieltsvietBlogCol().updateOne(query, { $set: data });
}

async function findBlogWithPagination(
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
    .ieltsvietBlogCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietBlogCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findBlogWithPagination,
  countDocument,
};
