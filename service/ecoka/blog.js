const { ecokaModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllBlogs() {
  const blogs = await ecokaModel.blog.find({});
  return blogs.filter((blog) => !blog.deleted_at);
}

async function getBlogById(id) {
  return ecokaModel.blog.findOne({ _id: new ObjectId(id) });
}

async function updateBlog(id, data) {
  return ecokaModel.blog.updateOne({ _id: new ObjectId(id) }, data);
}

async function createBlog(data) {
  const insert_blog = {
    author: data.author,
    s1_title_vn: data.s1_title_vn,
    s1_title_en: data.s1_title_en,
    s1_title_jp: data.s1_title_jp,
    s1_content_vn: data.s1_content_vn,
    s1_content_en: data.s1_content_en,
    s1_content_jp: data.s1_content_jp,
    s1_thumbnail: data.s1_thumbnail,
    s2_title_vn: data.s2_title_vn,
    s2_title_en: data.s2_title_en,
    s2_title_jp: data.s2_title_jp,
    s2_content_vn: data.s2_content_vn,
    s2_content_en: data.s2_content_en,
    s2_content_jp: data.s2_content_jp,
    s2_thumbnail: data.s2_thumbnail,
    s3_title_vn: data.s3_title_vn,
    s3_title_en: data.s3_title_en,
    s3_title_jp: data.s3_title_jp,
    s3_content_vn: data.s3_content_vn,
    s3_content_en: data.s3_content_en,
    s3_content_jp: data.s3_content_jp,
    s3_thumbnail: data.s3_thumbnail,
    s4_title_vn: data.s4_title_vn,
    s4_title_en: data.s4_title_en,
    s4_title_jp: data.s4_title_jp,
    s4_content_vn: data.s4_content_vn,
    s4_content_en: data.s4_content_en,
    s4_content_jp: data.s4_content_jp,
    s4_thumbnail: data.s4_thumbnail,
  };
  return await ecokaModel.blog.insertOne(insert_blog);
}

async function deleteBlog(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ecokaModel.blog.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
