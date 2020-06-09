const mongoose = require("mongoose");

const unitSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  readonly: { type: Boolean, require: true },
  description: { type: String },
  type: { type: String },
});

unitSchema.statics.initData = (Unit) => {
  console.log("Initializing Unit collection.");
  let units = [
    {
      name: "mm",
      readonly: true,
      description: "Milimeter",
      type: "length",
      __v: 0,
    },
    {
      name: "cm",
      readonly: true,
      description: "Centimeter",
      type: "length",
      __v: 0,
    },
    {
      name: "m",
      readonly: true,
      description: "Meter",
      type: "length",
      __v: 0,
    },
    {
      name: "in",
      readonly: true,
      description: "Inch",
      type: "length",
      __v: 0,
    },
    {
      name: "ft-us",
      readonly: true,
      description: "US Feet",
      type: "length",
      __v: 0,
    },
    {
      name: "ft",
      readonly: true,
      description: "Feet",
      type: "length",
      __v: 0,
    },
    {
      name: "mi",
      readonly: true,
      description: "Mile",
      type: "length",
      __v: 0,
    },
    {
      name: "mg",
      readonly: true,
      description: "Miligram",
      type: "mass",
      __v: 0,
    },
    {
      name: "g",
      readonly: true,
      description: "Gram",
      type: "mass",
      __v: 0,
    },
    {
      name: "kg",
      readonly: true,
      description: "Kilogram",
      type: "mass",
      __v: 0,
    },
    {
      name: "oz",
      readonly: true,
      description: "Ounce",
      type: "mass",
      __v: 0,
    },
    {
      name: "lb",
      readonly: true,
      description: "Pound",
      type: "mass",
      __v: 0,
    },
    {
      name: "t",
      readonly: true,
      description: "Tone",
      type: "mass",
      __v: 0,
    },
    {
      name: "mm3",
      readonly: true,
      description: "Cubic milimeter",
      type: "volume",
      __v: 0,
    },
    {
      name: "cm3",
      readonly: true,
      description: "Cubic centimeter",
      type: "volume",
      __v: 0,
    },
    {
      name: "ml",
      readonly: true,
      description: "Milimeter",
      type: "volume",
      __v: 0,
    },
    {
      name: "l",
      readonly: true,
      description: "Liter",
      type: "volume",
      __v: 0,
    },
    {
      name: "m3",
      readonly: true,
      description: "Cubic meter",
      type: "volume",
      __v: 0,
    },
    {
      name: "tsp",
      readonly: true,
      description: "Tablespoon",
      type: "volume",
      __v: 0,
    },
    {
      name: "in3",
      readonly: true,
      description: "Cubic inch",
      type: "volume",
      __v: 0,
    },
    {
      name: "fl-oz",
      readonly: true,
      description: "Fluid ounce",
      type: "volume",
      __v: 0,
    },
    {
      name: "cup",
      readonly: true,
      description: "Cup",
      type: "volume",
      __v: 0,
    },
    {
      name: "pnt",
      readonly: true,
      description: "Pint",
      type: "volume",
      __v: 0,
    },
    {
      name: "gal",
      readonly: true,
      description: "Gallon",
      type: "volume",
      __v: 0,
    },
    {
      name: "ft3",
      readonly: true,
      description: "Cubic feet",
      type: "volume",
      __v: 0,
    },
    {
      name: "yd3",
      readonly: true,
      description: "Cubic yard",
      type: "volume",
      __v: 0,
    },
  ];

  Unit.deleteMany({}, (err) => {
    units.forEach((unit) => {
      Unit.create(unit);
    });
  });
};

module.exports = mongoose.model("Unit", unitSchema);
