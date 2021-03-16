const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
});

const systemShops = [
];

shopSchema.statics.initData = async (Shop) => {
  var promises = [];
  Shop.deleteMany({}, (err) => {
    systemShops.forEach((shop) => {
      promises.push(Shop.create(shop));
    });
  });
  Promise.all(promises);
};

module.exports = mongoose.model("Shop", shopSchema);
module.exports.systemShops = function () {
  return systemShops;
};
