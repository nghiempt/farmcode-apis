require('dotenv').config();
const { MongoClient } = require('mongodb');

const mongoDBUrl = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let marketWarehouse = null;
let client = null;
let db = null;
let _helperAddressCol = null;
let _ecokaProductCol = null;
let _ecokaBlogCol = null;
let _ecokaEsgCol = null;
let _ecokaEnterpriseCol = null;
let _iattProductCol = null;
let _iattCommentCol = null;
let _iattBlogCol = null;
let _iattOrderCol = null;
let _iattAccountCol = null;
let _iattDiscountCol = null;
let _ieltsvietSliderCol = null;
let _ieltsvietVideosCol = null;
let _ieltsvietCoursesCol = null;
let _ieltsvietReviewCol = null;
let _ieltsvietBlogCol = null;
let _ieltsvietAccountCol = null;
let _ieltsvietTimekeepingCol = null;
let _ieltsvietAuthorCol = null;
let _ieltsvietUserCol = null;
let _ieltsvietBtestCol = null;
let _ieltsvietStestCol = null;
let _ieltsvietTestpartCol = null;
let _ieltsvietQuestionCol = null;
let _ieltsvietCompletepartCol = null;
let _ieltsvietTestcollectionCol = null;
let _ieltsvietFeedbackCol = null;

async function connection(cb) {
  if (db) {
    console.log('>>>>>> Reusing existing DB connection <<<<<<');
    cb();
    return;
  }
  client = new MongoClient(mongoDBUrl, connectOptions);
  try {
    await client.connect();
    db = client.db(dbName);
    marketWarehouse = db.collection('market_warehouses');
    _ecokaProductCol = db.collection('ecoka_products');
    _ecokaBlogCol = db.collection('ecoka_blogs');
    _ecokaEsgCol = db.collection('ecoka_esgs');
    _ecokaEnterpriseCol = db.collection('ecoka_enterprises');
    _iattProductCol = db.collection('iatt_products');
    _iattBlogCol = db.collection('iatt_blogs');
    _iattOrderCol = db.collection('iatt_orders');
    _iattCommentCol = db.collection('iatt_comments');
    _iattAccountCol = db.collection('iatt_accounts');
    _iattDiscountCol = db.collection('iatt_discounts');
    _ieltsvietSliderCol = db.collection('ieltsviet_sliders');
    _ieltsvietVideosCol = db.collection('ieltsviet_videos');
    _ieltsvietCoursesCol = db.collection('ieltsviet_courses');
    _ieltsvietReviewCol = db.collection('ieltsviet_reviews');
    _ieltsvietBlogCol = db.collection('ieltsviet_blogs');
    _ieltsvietAccountCol = db.collection('ieltsviet_accounts');
    _ieltsvietTimekeepingCol = db.collection(
      'ieltsviet_timekeepings'
    );
    _ieltsvietAuthorCol = db.collection('ieltsviet_authors');
    _ieltsvietUserCol = db.collection('ieltsviet_users');
    _ieltsvietBtestCol = db.collection('ieltsviet_btests');
    _ieltsvietStestCol = db.collection('ieltsviet_stests');
    _ieltsvietTestpartCol = db.collection('ieltsviet_testparts');
    _ieltsvietQuestionCol = db.collection('ieltsviet_questions');
    _ieltsvietCompletepartCol = db.collection(
      'ieltsviet_completeparts'
    );
    _ieltsvietTestcollectionCol = db.collection(
      'ieltsviet_testcollections'
    );
    _ieltsvietFeedbackCol = db.collection('ieltsviet_feedback');
    _helperAddressCol = db.collection('helper_address');

    await marketWarehouse.createIndex({
      created_at: 1,
      updated_at: 1,
      created_by: 1,
      updated_by: 1,
    });
    console.log('>>>>>>>> Connected to DB Successfully <<<<<<<<');
    cb();
  } catch (e) {
    console.error('Connection error:', e);
  }
}

const ecokaProductCol = () => _ecokaProductCol;
const ecokaBlogCol = () => _ecokaBlogCol;
const ecokaEsgCol = () => _ecokaEsgCol;
const ecokaEnterpriseCol = () => _ecokaEnterpriseCol;
const iattProductCol = () => _iattProductCol;
const iattCommentCol = () => _iattCommentCol;
const iattBlogCol = () => _iattBlogCol;
const iattOrderCol = () => _iattOrderCol;
const iattAccountCol = () => _iattAccountCol;
const iattDiscountCol = () => _iattDiscountCol;
const ieltsvietSliderCol = () => _ieltsvietSliderCol;
const ieltsvietVideosCol = () => _ieltsvietVideosCol;
const ieltsvietCoursesCol = () => _ieltsvietCoursesCol;
const ieltsvietReviewCol = () => _ieltsvietReviewCol;
const ieltsvietBlogCol = () => _ieltsvietBlogCol;
const ieltsvietAccountCol = () => _ieltsvietAccountCol;
const ieltsvietTimekeepingCol = () => _ieltsvietTimekeepingCol;
const ieltsvietAuthorCol = () => _ieltsvietAuthorCol;
const ieltsvietUserCol = () => _ieltsvietUserCol;
const helperAddressCol = () => _helperAddressCol;
const ieltsvietBtestCol = () => _ieltsvietBtestCol;
const ieltsvietStestCol = () => _ieltsvietStestCol;
const ieltsvietTestpartCol = () => _ieltsvietTestpartCol;
const ieltsvietQuestionCol = () => _ieltsvietQuestionCol;
const ieltsvietCompletepartCol = () => _ieltsvietCompletepartCol;
const ieltsvietTestcollectionCol = () => _ieltsvietTestcollectionCol;
const ieltsvietFeedbackCol = () => _ieltsvietFeedbackCol;

module.exports = {
  connection,
  ecokaProductCol,
  ecokaBlogCol,
  ecokaEsgCol,
  ecokaEnterpriseCol,
  iattProductCol,
  iattBlogCol,
  iattOrderCol,
  iattAccountCol,
  iattDiscountCol,
  iattCommentCol,
  ieltsvietSliderCol,
  ieltsvietVideosCol,
  ieltsvietCoursesCol,
  ieltsvietReviewCol,
  ieltsvietBlogCol,
  ieltsvietAccountCol,
  ieltsvietTimekeepingCol,
  ieltsvietAuthorCol,
  ieltsvietUserCol,
  ieltsvietBtestCol,
  ieltsvietStestCol,
  ieltsvietTestpartCol,
  ieltsvietQuestionCol,
  ieltsvietCompletepartCol,
  ieltsvietTestcollectionCol,
  ieltsvietFeedbackCol,
  helperAddressCol,
};
