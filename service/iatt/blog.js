const { iattModel } = require('~/model');
const { ObjectId } = require("mongodb");

async function getAllBlogs() {
  const blogs = await iattModel.blog.find({});
  return blogs
    .filter(blog => !blog.deleted_at);
}

async function getBlog(id) {
  return iattModel.blog.findOne({ _id: new ObjectId(id) });
}

async function updateBlog(id, data) {
  return iattModel.blog.updateOne({ _id: new ObjectId(id) }, data);
}

async function createBlog(data) {
  return await iattModel.blog.insertOne(data);
}

async function deleteBlog(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return iattModel.blog.updateOne({ _id: new ObjectId(id) }, dataUpdate);
}

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
};
