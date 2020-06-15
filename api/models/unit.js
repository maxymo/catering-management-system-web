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
      type: "Length",
      __v: 0,
    },
    {
      name: "cm",
      readonly: true,
      description: "Centimeter",
      type: "Length",
      __v: 0,
    },
    {
      name: "m",
      readonly: true,
      description: "Meter",
      type: "Length",
      __v: 0,
    },
    {
      name: "in",
      readonly: true,
      description: "Inch",
      type: "Length",
      __v: 0,
    },
    {
      name: "ft-us",
      readonly: true,
      description: "US Feet",
      type: "Length",
      __v: 0,
    },
    {
      name: "ft",
      readonly: true,
      description: "Feet",
      type: "Length",
      __v: 0,
    },
    {
      name: "mi",
      readonly: true,
      description: "Mile",
      type: "Length",
      __v: 0,
    },
    {
      name: "mg",
      readonly: true,
      description: "Miligram",
      type: "Mass",
      __v: 0,
    },
    {
      name: "g",
      readonly: true,
      description: "Gram",
      type: "Mass",
      __v: 0,
    },
    {
      name: "kg",
      readonly: true,
      description: "Kilogram",
      type: "Mass",
      __v: 0,
    },
    {
      name: "oz",
      readonly: true,
      description: "Ounce",
      type: "Mass",
      __v: 0,
    },
    {
      name: "lb",
      readonly: true,
      description: "Pound",
      type: "Mass",
      __v: 0,
    },
    {
      name: "t",
      readonly: true,
      description: "Tone",
      type: "Mass",
      __v: 0,
    },
    {
      name: "mm3",
      readonly: true,
      description: "Cubic milimeter",
      type: "Volume",
      __v: 0,
    },
    {
      name: "cm3",
      readonly: true,
      description: "Cubic centimeter",
      type: "Volume",
      __v: 0,
    },
    {
      name: "ml",
      readonly: true,
      description: "Milimeter",
      type: "Volume",
      __v: 0,
    },
    {
      name: "l",
      readonly: true,
      description: "Liter",
      type: "Volume",
      __v: 0,
    },
    {
      name: "m3",
      readonly: true,
      description: "Cubic meter",
      type: "Volume",
      __v: 0,
    },
    {
      name: "tsp",
      readonly: true,
      description: "Tablespoon",
      type: "Volume",
      __v: 0,
    },
    {
      name: "in3",
      readonly: true,
      description: "Cubic inch",
      type: "Volume",
      __v: 0,
    },
    {
      name: "fl-oz",
      readonly: true,
      description: "Fluid ounce",
      type: "Volume",
      __v: 0,
    },
    {
      name: "cup",
      readonly: true,
      description: "Cup",
      type: "Volume",
      __v: 0,
    },
    {
      name: "pnt",
      readonly: true,
      description: "Pint",
      type: "Volume",
      __v: 0,
    },
    {
      name: "gal",
      readonly: true,
      description: "Gallon",
      type: "Volume",
      __v: 0,
    },
    {
      name: "ft3",
      readonly: true,
      description: "Cubic feet",
      type: "Volume",
      __v: 0,
    },
    {
      name: "yd3",
      readonly: true,
      description: "Cubic yard",
      type: "Volume",
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
