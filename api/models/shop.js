const mongoose = require("mongoose");

const shopSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
});

const systemShops = [
  {
    name: "The Big Bazar",
    readonly: false,
    description: "For exotic ingredients.",
  },
  {
    name: "Market A",
    readonly: false,
    description: "For fruits and vegetables.",
  },
  {
    name: "Mega Shop",
    readonly: false,
    description: "For other ingredients.",
  },
  {
    name: "Mr Butcher",
    readonly: false,
    description: "For meats.",
  }
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
