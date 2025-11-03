const { ieltsvietModel } = require('~/model');
const { ObjectId } = require('mongodb');

async function getAllSliders() {
  const sliders = await ieltsvietModel.slider.find({});
  return sliders.filter((slider) => !slider.deleted_at);
}

async function createSlider(data) {
  return await ieltsvietModel.slider.insertOne(data);
}

async function updateSlider(id, data) {
  const dataUpdate = {
    ...data,
    updated_at: new Date(),
  };
  return ieltsvietModel.slider.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

async function deleteSlider(id) {
  const dataUpdate = {
    deleted_at: new Date(),
  };
  return ieltsvietModel.slider.updateOne(
    { _id: new ObjectId(id) },
    dataUpdate
  );
}

module.exports = {
  getAllSliders,
  createSlider,
  updateSlider,
  deleteSlider,
};
