const { iattModel } = require('~/model');


async function checkDiscount(code) {
  const check = await iattModel.discount.findOne({ code: code });
  if(check!=null){
    return check;
  } 
  return 'Discount code not found';
}

module.exports = {
  checkDiscount
};
