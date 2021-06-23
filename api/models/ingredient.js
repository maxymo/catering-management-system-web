const mongoose = require("mongoose");

const ingredientSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  shopName:  { type: String, require: true },
  defaultUnitWhenBuying: { type: String, require: true },
  defaultUnitWhenUsing: { type: String, require: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
});

const systemIngredients = [
  {
    name: "Onions",
    shopName: "Market A",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: "White and medium size"
  },
  {
    name: "Garlic",
    shopName: "Market A",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Double cream",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "l",
    defaultUnitWhenUsing: "ml",
    readonly: false,
    description: ""
  },
  {
    name: "Parmesan cheese",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Eggs",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "quantity",
    defaultUnitWhenUsing: "quantity",
    readonly: false,
    description: ""
  },
  {
    name: "Spaghetti",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Bacon",
    shopName: "Mr Butcher",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Salt",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
    readonly: false,
    description: ""
  },
  {
    name: "Pepper",
    shopName: "Mega Shop",
    defaultUnitWhenBuying: "kg",
    defaultUnitWhenUsing: "g",
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
