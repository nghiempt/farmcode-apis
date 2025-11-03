const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllCourses() {
  const courses = await ieltsvietModel.course.find({});
  return courses.filter((course) => !course.deleted_at);
}

async function createCourse(data) {
  return await ieltsvietModel.course.insertOne(data);
}

async function updateCourse(id, data) {
  const dataUpdate = {
    ...data,
    updated_at: new Date(),
  };
  return ieltsvietModel.course.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function deleteCourse(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.course.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};
