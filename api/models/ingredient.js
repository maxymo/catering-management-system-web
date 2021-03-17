const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  shopName:  { type: String, require: true },
  unitName: { type: String, require: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
});

const systemIngredients = [
  {
    name: "Onions",
    shopName: "Market A",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: "White and medium size"
  },
  {
    name: "Garlic",
    shopName: "Market A",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Double cream",
    shopName: "Mega Shop",
    unitNameToBuy: "l",
    unitNameToUse: "ml",
    readonly: false,
    description: ""
  },
  {
    name: "Parmesan cheese",
    shopName: "Mega Shop",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Eggs",
    shopName: "Mega Shop",
    unitNameToBuy: "quantity",
    unitNameToUse: "quantity",
    readonly: false,
    description: ""
  },
  {
    name: "Spaghetti",
    shopName: "Mega Shop",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Bacon",
    shopName: "Mr Butcher",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Salt",
    shopName: "Mega Shop",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Pepper",
    shopName: "Mega Shop",
    unitNameToBuy: "kg",
    unitNameToUse: "g",
    readonly: false,
    description: ""
  }
];

ingredientSchema.statics.initData = async (Ingredient) => {
  var promises = [];
  Ingredient.deleteMany({}, (err) => {
    systemIngredients.forEach((ingredient) => {
      promises.push(Ingredient.create(ingredient));
    });
  });
  Promise.all(promises);
};

module.exports = mongoose.model("Ingredient", ingredientSchema);
module.exports.systemIngredients = function () {
  return systemIngredients;
};
