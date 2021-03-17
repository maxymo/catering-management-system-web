const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
  portions: { type: Number, require: true },
  ingredients: [
    {
      ingredientName: { type: String, require: true },
      unitName: { type: String, require: true },
      quantity: { type: Number, require: true }
    }
  ]
});

const systemMenus = [
  {
    name: "Pasta Carbonara",
    shopName: "Market A",
    readonly: false,
    description: "Classic recipe",
    portions: 10,
    ingredients: [
      {
        name: "Double cream",
        unitName: "ml",
        quantity: 500
      },
      {
        name: "Parmesan cheese",
        unitName: "g",
        quantity: 200,
      },
      {
        name: "Eggs",
        unitName: "quantity",
        quantity: "5",
      },
      {
        name: "Spaghetti",
        unitName: "g",
        quantity: 1000,
      },
      {
        name: "Bacon",
        unitName: "g",
        quantity: 250,
      },
      {
        name: "Salt",
        unitName: "g",
        quantity: 20,
      },
      {
        name: "Pepper",
        unitName: "g",
        quantity: 10,
      }
    ]
  },
];

menuSchema.statics.initData = async (Menu) => {
  var promises = [];
  Menu.deleteMany({}, (err) => {
    systemMenus.forEach((menu) => {
      promises.push(Menu.create(menu));
    });
  });
  Promise.all(promises);
};

module.exports = mongoose.model("Menu", menuSchema);
module.exports.systemMenus = function () {
  return systemMenus;
};
