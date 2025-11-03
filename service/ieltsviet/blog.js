const { ieltsvietModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllBlogs() {
  const blogs = await ieltsvietModel.blog.find({});
  return blogs
    .filter(blog => !blog.deleted_at);
}

async function getBlog(id) {
  return ieltsvietModel.blog.findOne({ _id: new ObjectId(id) });
}

async function updateBlog(id, data) {
  return ieltsvietModel.blog.updateOne({ _id: new ObjectId(id) }, data);
}

async function createBlog(data) {
  const data_insert = {
    ...data,
    author_id: new ObjectId('67a8779e9ce92c2626f05d66'),
  };
  return await ieltsvietModel.blog.insertOne(data_insert);
}

async function deleteBlog(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.blog.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
};
