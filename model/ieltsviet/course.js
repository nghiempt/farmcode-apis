const database = require('~/database/connection');

async function find(query) {
  return database.ieltsvietCoursesCol().find(query).toArray();
}
async function insertOne(data) {
  return database.ieltsvietCoursesCol().insertOne({
    ...data,
    created_at: new Date(),
  });
}

async function findOne(query) {
  return database.ieltsvietCoursesCol().findOne(query);
}

async function updateOne(query, data) {
  return database
    .ieltsvietCoursesCol()
    .updateOne(query, { $set: data });
}

async function findSliderWithPagination(
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
    .ieltsvietCoursesCol()
    .find(query, { projection })
    .sort(sort)
    .skip(skip)
    .limit(parsedPageSize)
    .toArray();
}

async function countDocument(query) {
  return await database.ieltsvietCoursesCol().count(query);
}

module.exports = {
  find,
  insertOne,
  findOne,
  updateOne,
  findSliderWithPagination,
  countDocument,
};
